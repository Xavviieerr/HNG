import express from "express";
import {
	githubLogin,
	githubCallback,
	refreshToken,
	logout,
	getSataus,
} from "../controllers/authController.js";

const router = express.Router();
router.get("/github", githubLogin);
router.get("/status", getSataus);
router.get("/github/callback", githubCallback);

router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
