import express from "express";
import {
	githubLogin,
	githubCallback,
	refreshToken,
	logout,
	getMe,
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { router } from "./profileRoute.js";

router.use(authMiddleware);

router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);

router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", getMe);

export default router;
