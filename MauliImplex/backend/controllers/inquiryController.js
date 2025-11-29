import Inquiry from "../models/Inquiry.js";

// Create new inquiry (user side form)
export const createInquiry = async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();
    res.status(201).json(newInquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all inquiries (admin inbox)
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ read: 1, createdAt: -1 }); 
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark inquiry as read
export const markAsRead = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete inquiry (only if read)
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ error: "Not found" });
    if (!inquiry.read)
      return res.status(403).json({ error: "Can delete only if read" });

    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: "Inquiry deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
