import {
	handleGithubLogin,
	handleGithubCallback,
	handleRefreshToken,
	handleLogout,
	handleGetMe,
} from "../services/authService.js";

export const githubLogin = (req, res) => handleGithubLogin(req, res);

export const githubCallback = async (req, res) =>
	handleGithubCallback(req, res);

export const refreshToken = (req, res) => handleRefreshToken(req, res);

export const logout = (req, res) => handleLogout(req, res);

export const getMe = (req, res) => handleGetMe(req, res);
