import express from "express";
const router = express.Router();
import {
	createProfile,
	getAllProfiles,
	getProfileById,
	deleteProfile,
	searchProfiles,
} from "../controllers/profileController.js";

router.post("/", createProfile);
router.get("/", getAllProfiles);
router.get("/search", searchProfiles);
router.get("/:id", getProfileById);
router.delete("/:id", deleteProfile);

export default router;
