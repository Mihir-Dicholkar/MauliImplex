import express from "express";
import {
  createInquiry,
  getInquiries,
  markAsRead,
  deleteInquiry,
} from "../controllers/inquiryController.js";

const router = express.Router();

router.post("/", createInquiry);         // user form submits here
router.get("/", getInquiries);           // admin fetch all
router.put("/:id", markAsRead);          // mark as read
router.delete("/:id", deleteInquiry);    // delete only if read

export default router;
