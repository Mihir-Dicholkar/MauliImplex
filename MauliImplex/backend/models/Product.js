import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    portraitFiles: [String],
    landscapeFiles: [String],
  externalPortraitVideos: [String],
  externalLandscapeVideos: [String],
        externalPortraitImages: [String],
externalLandscapeImages: [String],

    date: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
