// routes/productRoutes.js
import express from "express";
import multer from "multer";
import {
  createProduct,
  getProducts
} from "../controllers/productController.js";
import fs from "fs/promises"; 
import Product from "../models/Product.js"; // Adjust path if needed
import { deleteProductById } from "../controllers/productController.js";
import { deleteSingleFile } from '../controllers/productController.js';

const router = express.Router();

// ✅ File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// ✅ Use `.fields()` to accept multiple files per field name
router.post(
  "/",
  upload.fields([
    { name: "portraitVideos", maxCount: 10 },
    { name: "landscapeVideos", maxCount: 10 },
    { name: "portraitImages", maxCount: 10 },
    { name: "landscapeImages", maxCount: 10 },
  ]),
  
  createProduct
);

// ✅ Get route
router.get("/", getProducts);


router.delete("/media", async (req, res) => {
  try {
    const { url } = req.body;
    const filePath = url.split("/").slice(-2).join("/"); // e.g., uploads/portrait/somefile.jpg

    const product = await Product.findOne({
      $or: [
        { portraitFiles: { $in: [filePath] } },
        { landscapeFiles: { $in: [filePath] } },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "File not found in database" });
    }

    // Remove file from product record
    product.portraitFiles = product.portraitFiles.filter(f => f !== filePath);
    product.landscapeFiles = product.landscapeFiles.filter(f => f !== filePath);
    await product.save();

    // Remove physical file
    try {
      await fs.unlink(`./${filePath}`);
    } catch (err) {
      console.error("File deletion error:", err);
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete('/:id', deleteProductById);
// routes/products.js
router.delete('/file/:productId', deleteSingleFile);

export default router;
