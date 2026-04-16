import express from "express";
const router = express.Router();
import {
	createProfile,
	getAllProfiles,
	getProfileById,
	deleteProfile,
} from "../controllers/profileController.js";

export default router;

router.post("/", createProfile);
router.get("/", getAllProfiles);
router.get("/:id", getProfileById);
router.delete("/:id", deleteProfile);
