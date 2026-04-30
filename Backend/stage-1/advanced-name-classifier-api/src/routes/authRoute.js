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

const router = express.Router();

router.use(authMiddleware);

router.get("/github", githubLogin);
router.get("/me", getMe);
router.get("/github/callback", githubCallback);

router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
