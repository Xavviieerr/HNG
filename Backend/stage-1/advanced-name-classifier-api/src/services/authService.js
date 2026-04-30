import axios from "axios";
import crypto from "crypto";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const BASE_URL = process.env.BASE_URL;
const WEB_PORTAL_URL = process.env.WEB_PORTAL_URL || "http://localhost:3001";
const CLI_CALLBACK_PORT = process.env.CLI_CALLBACK_PORT || 4000;
console.log("BASE_URL:", process.env.BASE_URL);
// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Encode source + nonce into a base64url state string.
 * GitHub passes this back to the callback unchanged,
 * so we can recover source without relying on session.
 */
const encodeState = (source = "web") => {
	const payload = {
		source,
		nonce: crypto.randomBytes(12).toString("hex"),
	};
	return Buffer.from(JSON.stringify(payload)).toString("base64url");
};

/**
 * Decode state string back to { source, nonce }.
 * Returns null if the string is malformed.
 */
const decodeState = (state) => {
	try {
		return JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
	} catch {
		return null;
	}
};

// ─── GET /auth/github ────────────────────────────────────────────────────────

/**
 * Redirect the user (browser or CLI-opened browser) to GitHub OAuth.
 * Query param: ?source=cli | ?source=web  (default: web)
 */
export const handleGithubLogin = (req, res) => {
	const source = req.query.source === "cli" ? "cli" : "web";
	const stateParam = encodeState(source);

	const params = new URLSearchParams({
		client_id: CLIENT_ID,
		redirect_uri: `${BASE_URL}/auth/github/callback`,
		state: stateParam,
		scope: "read:user user:email",
	});

	return res.redirect(
		`https://github.com/login/oauth/authorize?${params.toString()}`,
	);
};

// ─── GET /auth/github/callback ───────────────────────────────────────────────

/**
 * GitHub sends the user here after they approve (or deny) the app.
 * We exchange the code for a GitHub token, fetch the user profile,
 * create/update our user record, issue our own JWT pair, then
 * route the result to the right destination:
 *   - CLI  → redirect to http://localhost:<port>/callback with tokens in query
 *   - Web  → set HTTP-only cookies, redirect to web portal dashboard
 */
export const handleGithubCallback = async (req, res) => {
	try {
		const { code, state } = req.query;

		// ── 1. Basic param check ─────────────────────────────────────────────
		if (!code || !state) {
			return res.status(400).json({
				status: "error",
				message: "Missing OAuth parameters",
			});
		}

		// ── 2. Decode state ──────────────────────────────────────────────────
		const stateData = decodeState(state);

		if (!stateData) {
			return res.status(400).json({
				status: "error",
				message: "Invalid state parameter",
			});
		}

		const { source } = stateData;

		// ── 3. Exchange code for GitHub access token ─────────────────────────
		const tokenResponse = await axios.post(
			"https://github.com/login/oauth/access_token",
			{
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				code,
				redirect_uri: `${BASE_URL}/auth/github/callback`,
			},
			{ headers: { Accept: "application/json" } },
		);

		const githubAccessToken = tokenResponse.data.access_token;

		if (!githubAccessToken) {
			console.error("GitHub token exchange failed:", tokenResponse.data);
			return res.status(401).json({
				status: "error",
				message:
					"GitHub did not return an access token. The code may have expired — please try logging in again.",
			});
		}

		// ── 4. Fetch GitHub user profile ─────────────────────────────────────
		const { data: githubUser } = await axios.get(
			"https://api.github.com/user",
			{ headers: { Authorization: `Bearer ${githubAccessToken}` } },
		);

		const { id: githubId, login: username, email, avatar_url } = githubUser;

		// GitHub sometimes returns null for email if it is set to private.
		// Fall back to fetching from /user/emails.
		let resolvedEmail = email;

		if (!resolvedEmail) {
			try {
				const { data: emails } = await axios.get(
					"https://api.github.com/user/emails",
					{ headers: { Authorization: `Bearer ${githubAccessToken}` } },
				);
				const primary = emails.find((e) => e.primary && e.verified);
				resolvedEmail = primary?.email || null;
			} catch {
				resolvedEmail = null;
			}
		}

		// ── 5. Create or update user ─────────────────────────────────────────
		let user = await User.findOne({ github_id: String(githubId) });

		if (!user) {
			user = await User.create({
				github_id: String(githubId),
				username,
				email: resolvedEmail,
				avatar_url,
				role: "analyst",
				is_active: true,
				last_login_at: new Date(),
			});
		} else {
			user.username = username;
			user.email = resolvedEmail ?? user.email;
			user.avatar_url = avatar_url;
			user.last_login_at = new Date();
		}

		// ── 6. Block inactive users ──────────────────────────────────────────
		if (user.is_active === false) {
			return res.status(403).json({
				status: "error",
				message: "Your account has been deactivated. Contact an admin.",
			});
		}

		// ── 7. Issue tokens ──────────────────────────────────────────────────
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		user.refresh_token = refreshToken;
		await user.save();

		// ── 8. Route to the right destination ───────────────────────────────
		if (source === "cli") {
			// CLI started a local HTTP server on localhost:CLI_CALLBACK_PORT.
			// Send the tokens there via query string — CLI picks them up.
			const cliRedirect = new URL(
				`http://localhost:${CLI_CALLBACK_PORT}/callback`,
			);
			cliRedirect.searchParams.set("access_token", accessToken);
			cliRedirect.searchParams.set("refresh_token", refreshToken);
			cliRedirect.searchParams.set("username", username);

			return res.redirect(cliRedirect.toString());
		}

		// Web flow — set HTTP-only cookies so JS can never read the tokens.
		const cookieBase = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		};

		res.cookie("access_token", accessToken, {
			...cookieBase,
			maxAge: 3 * 60 * 1000, // 3 minutes — matches token expiry
		});

		res.cookie("refresh_token", refreshToken, {
			...cookieBase,
			maxAge: 5 * 60 * 1000, // 5 minutes
		});

		return res.redirect(`${WEB_PORTAL_URL}/dashboard`);
	} catch (err) {
		console.error("OAuth Callback Error:", err.response?.data ?? err.message);
		return res.status(500).json({
			status: "error",
			message: "OAuth failed. Please try again.",
		});
	}
};

// ─── POST /auth/refresh ──────────────────────────────────────────────────────

/**
 * Rotate both tokens.
 * The old refresh token is immediately invalidated — one-time use.
 */
export const handleRefreshToken = async (req, res) => {
	try {
		const { refresh_token } = req.body;

		if (!refresh_token) {
			return res.status(400).json({
				status: "error",
				message: "Refresh token required",
			});
		}

		const user = await User.findOne({ refresh_token });

		if (!user) {
			return res.status(403).json({
				status: "error",
				message: "Invalid or expired refresh token",
			});
		}

		if (user.is_active === false) {
			return res.status(403).json({
				status: "error",
				message: "Account is deactivated",
			});
		}

		// Rotate — old token is now invalid
		const newAccessToken = generateAccessToken(user);
		const newRefreshToken = generateRefreshToken(user);

		user.refresh_token = newRefreshToken;
		await user.save();

		return res.json({
			status: "success",
			access_token: newAccessToken,
			refresh_token: newRefreshToken,
		});
	} catch (err) {
		console.error("Refresh Token Error:", err.message);
		return res.status(500).json({
			status: "error",
			message: "Server error during token refresh",
		});
	}
};

// ─── POST /auth/logout ───────────────────────────────────────────────────────

/**
 * Invalidate the refresh token server-side.
 * Also clears cookies for web clients.
 */
export const handleLogout = async (req, res) => {
	try {
		const { refresh_token } = req.body;

		if (!refresh_token) {
			return res.status(400).json({
				status: "error",
				message: "Refresh token required",
			});
		}

		const user = await User.findOne({ refresh_token });

		if (user) {
			user.refresh_token = null;
			await user.save();
		}

		// Clear cookies for web clients — safe to call even if no cookie exists
		res.clearCookie("access_token");
		res.clearCookie("refresh_token");

		return res.json({
			status: "success",
			message: "Logged out successfully",
		});
	} catch (err) {
		console.error("Logout Error:", err.message);
		return res.status(500).json({
			status: "error",
			message: "Server error during logout",
		});
	}
};

// ─── GET /auth/me ────────────────────────────────────────────────────────────

/**
 * Return the currently authenticated user's profile.
 * Requires a valid access token (enforced by auth middleware upstream).
 */
export const handleGetMe = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-refresh_token -__v");

		if (!user) {
			return res.status(404).json({
				status: "error",
				message: "User not found",
			});
		}

		return res.json({
			status: "success",
			data: {
				id: user._id,
				username: user.username,
				email: user.email,
				avatar_url: user.avatar_url,
				role: user.role,
				last_login_at: user.last_login_at,
				created_at: user.created_at,
			},
		});
	} catch (err) {
		console.error("Get Me Error:", err.message);
		return res.status(500).json({
			status: "error",
			message: "Server error",
		});
	}
};
