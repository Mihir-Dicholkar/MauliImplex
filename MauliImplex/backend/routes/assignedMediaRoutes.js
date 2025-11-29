import express from "express";
import {
  assignMediaToPosition,
  getAssignedMedia
} from "../controllers/assignedMediaController.js";

const router = express.Router();

// POST: Assign a file to a section
router.post("/assign", assignMediaToPosition);

// GET: All assigned media
router.get("/", getAssignedMedia);

// ✅ GET: Assigned media by position (e.g. /assigned-media/Hero)
router.get("/:position", getAssignedMedia);

export default router;
