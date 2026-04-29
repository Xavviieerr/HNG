import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateCodeVerifier, generateCodeChallenge } from "../utils/pkce.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const BASE_URL = process.env.BASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

export const handleGithubLogin = (req, res) => {
	const state = Math.random().toString(36).substring(2);
	const codeVerifier = generateCodeVerifier();

	req.session.codeVerifier = codeVerifier;
	req.session.state = state;

	const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${BASE_URL}/auth/github/callback&state=${state}&scope=read:user user:email`;

	res.redirect(redirectUrl);
};

export const handleGithubCallback = async (req, res) => {
	try {
		const { code, state } = req.query;

		if (!req.session.state || req.session.state !== state) {
			return res.status(400).json({
				status: "error",
				message: "Invalid state",
			});
		}

		const codeVerifier = req.session.codeVerifier;

		// exchange code for access token
		const tokenResponse = await axios.post(
			`https://github.com/login/oauth/access_token`,
			{
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				code,
				redirect_uri: `${BASE_URL}/auth/github/callback`,
				state,
			},
			{ headers: { Accept: "application/json" } },
		);

		const githubAccessToken = tokenResponse.data.access_token;

		// fetch GitHub user
		const githubUser = await axios.get("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${githubAccessToken}`,
			},
		});

		const { id, login, email, avatar_url } = githubUser.data;
		const githubId = String(id);

		// create or update user
		let user = await User.findOne({ github_id: githubId });

		if (!user) {
			user = await User.create({
				github_id: githubId,
				username: login,
				email,
				avatar_url,
			});
		} else {
			user.username = login;
			user.email = email;
			user.avatar_url = avatar_url;
			user.last_login_at = new Date();
		}

		// issue JWT (access token)
		const appAccessToken = generateAccessToken(user);
		const appRefreshToken = generateRefreshToken(user);

		// store refresh token in DB
		user.refresh_token = appRefreshToken;
		await user.save();

		res.json({
			status: "success",
			access_token: appAccessToken,
			refresh_token: appRefreshToken,
			user: {
				username: user.username,
				role: user.role,
			},
		});
	} catch (err) {
		console.error("OAuth Callback Error:", err);
		res.status(500).json({
			status: "error",
			message: "OAuth failed",
		});
	}
};

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
			console.log("Refresh token not found in DB:", refresh_token);
			return res.status(403).json({
				status: "error",
				message: "Invalid or expired refresh token",
			});
		}

		// ROTATION
		const newAccessToken = generateAccessToken(user);
		const newRefreshToken = generateRefreshToken(user);

		user.refresh_token = newRefreshToken;
		await user.save();

		res.json({
			status: "success",
			access_token: newAccessToken,
			refresh_token: newRefreshToken,
		});
	} catch (err) {
		console.error("Refresh Token Error:", err);
		res.status(500).json({
			status: "error",
			message: "Server error",
		});
	}
};
// export const handleRefreshToken = async (req, res) => {
// 	try {
// 		const { refresh_token } = req.body;

// 		if (!refresh_token) {
// 			return res.status(400).json({
// 				status: "error",
// 				message: "Refresh token required",
// 			});
// 		}

// 		const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);

// 		const user = await User.findById(decoded.userId);

// 		if (!user || user.refresh_token !== refresh_token) {
// 			return res.status(403).json({
// 				status: "error",
// 				message: "Invalid refresh token",
// 			});
// 		}

// 		// ROTATION: invalidate old token
// 		user.refresh_token = null;
// 		await user.save();

// 		// issue new tokens
// 		const newAccessToken = generateAccessToken(user);
// 		const newRefreshToken = generateRefreshToken(user);

// 		user.refresh_token = newRefreshToken;
// 		await user.save();

// 		res.json({
// 			status: "success",
// 			access_token: newAccessToken,
// 			refresh_token: newRefreshToken,
// 		});
// 	} catch (err) {
// 		res.status(403).json({
// 			status: "error",
// 			message: "Invalid or expired refresh token",
// 		});
// 	}
// };

export const handleLogout = async (req, res) => {
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

	res.json({
		status: "success",
		message: "Logged out successfully",
	});
};
