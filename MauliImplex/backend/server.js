import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import inquiryRoutes from "./routes/inquiryRoutes.js";

import adminRoutes from "./routes/adminRoutes.js"; // adjust path if needed
import productRoutes from "./routes/productRoutes.js"; // adjust path if needed
import assignedMediaRoutes from "./routes/assignedMediaRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files from 'uploads' folder
app.use("/uploads", express.static("uploads"));

// mount here 👇
app.use("/api/admin", adminRoutes);
app.use("/api/inquiries", inquiryRoutes);
// ✅ API Routes
app.use("/api/products", productRoutes);
// ✅ API Routes for assigned media
app.use("/api/assigned-media", assignedMediaRoutes);
// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
