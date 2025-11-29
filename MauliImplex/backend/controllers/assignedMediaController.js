import AssignedMedia from "../models/AssignedMedia.js";
import Product from "../models/Product.js";  // ✅ make sure you import Product

// POST: Assign media to a position
export const assignMediaToPosition = async (req, res) => {
  const { position, fileUrl, orientation, mediaType } = req.body;

  if (!position || !fileUrl || !orientation || !mediaType) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // 1. Upsert into AssignedMedia
    const updated = await AssignedMedia.findOneAndUpdate(
      { position },
      { fileUrl, orientation, mediaType, assignedAt: new Date() },
      { upsert: true, new: true }
    );

    // 2. Update the Product collection so media knows where it's used
    await Product.updateOne(
      {
        $or: [
          { portraitFiles: fileUrl },
          { landscapeFiles: fileUrl },
          { externalPortraitVideos: fileUrl },
          { externalLandscapeVideos: fileUrl },
          { externalPortraitImages: fileUrl },
          { externalLandscapeImages: fileUrl },
        ],
      },
      { $set: { usedIn: position } }   // ✅ this will be picked up by your frontend
    );

    res.status(200).json({ message: "Media assigned", assigned: updated });
  } catch (error) {
    console.error("Assign error:", error);
    res.status(500).json({ error: "Failed to assign media." });
  }
};

// GET: Fetch all assigned media
export const getAssignedMedia = async (req, res) => {
  try {
    if (req.params.position) {
      const assigned = await AssignedMedia.findOne({ position: req.params.position });
      if (!assigned) {
        return res.status(404).json({ error: "No media found for the given position." });
      }
      return res.json(assigned);
    }

    const assigned = await AssignedMedia.find();
    res.json(assigned);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assigned media." });
  }
};
