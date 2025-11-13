import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },     // unread by default
    deleted: { type: Boolean, default: false },  // not deleted by default
  },
  { timestamps: true } // adds createdAt and updatedAt
);

export default mongoose.model("Inquiry", inquirySchema);
