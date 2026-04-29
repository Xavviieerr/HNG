import express from "express";
const router = express.Router();
import {
	createProfile,
	getAllProfiles,
	getProfileById,
	deleteProfile,
	searchProfiles,
	exportProfiles,
} from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { versionMiddleware } from "../middleware/versionMiddleware.js";

router.use(authMiddleware);
router.use(versionMiddleware);

//read routes
router.get("/", getAllProfiles);
router.get("/search", searchProfiles);
router.get("/export", exportProfiles);
router.get("/:id", getProfileById);

//admin
router.post("/", roleMiddleware(["admin"]), createProfile);
router.delete("/:id", roleMiddleware(["admin"]), deleteProfile);

export default router;
