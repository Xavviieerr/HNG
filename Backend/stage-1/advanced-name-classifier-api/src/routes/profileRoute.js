import express from "express";
const router = express.Router();
import {
	createProfile,
	getAllProfiles,
	getProfileById,
	deleteProfile,
	searchProfiles,
} from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

router.use(authMiddleware);

//read routes
router.get("/", getAllProfiles);
router.get("/search", searchProfiles);
router.get("/:id", getProfileById);

//admin
router.post("/", roleMiddleware(["admin"]), createProfile);
router.delete("/:id", roleMiddleware(["admin"]), deleteProfile);

export default router;
