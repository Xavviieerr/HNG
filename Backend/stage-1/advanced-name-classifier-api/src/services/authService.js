import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateCodeVerifier, generateCodeChallenge } from "../utils/pkce.js";

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

		const accessToken = tokenResponse.data.access_token;

		// fetch GitHub user
		const githubUser = await axios.get("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const { id, login, email, avatar_url } = githubUser.data;

		// create or update user
		let user = await User.findOne({ github_id: id });

		if (!user) {
			user = await User.create({
				github_id: id,
				username: login,
				email,
				avatar_url,
			});
		} else {
			user.last_login_at = new Date();
			await user.save();
		}

		// issue JWT (access token)
		const appToken = jwt.sign(
			{
				userId: user._id,
				role: user.role,
			},
			JWT_SECRET,
			{ expiresIn: "3m" },
		);

		res.json({
			status: "success",
			access_token: appToken,
			user: {
				username: user.username,
				role: user.role,
			},
		});
	} catch (err) {
		res.status(500).json({
			status: "error",
			message: "OAuth failed",
		});
	}
};

export const handleRefreshToken = (req, res) => {
	res.json({ message: "refresh not implemented yet (next step)" });
};

export const handleLogout = (req, res) => {
	res.json({ message: "logout not implemented yet" });
};
