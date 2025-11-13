import mongoose from "mongoose";

const AssignedMediaSchema = new mongoose.Schema({
  position: {
    type: String,
    required: true,
    unique: true, // Only one media per position
  },
  fileUrl: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  orientation: {
    type: String,
    enum: ["portrait", "landscape"],
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AssignedMedia", AssignedMediaSchema);
