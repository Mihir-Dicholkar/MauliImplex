import Product from "../models/Product.js";
import path from "path";
import fs from "fs";
export const createProduct = async (req, res) => {
  try {
    const portrait = [
      ...(req.files.portraitVideos || []),
      ...(req.files.portraitImages || []),
    ].map((file) => file.path);

    const landscape = [
      ...(req.files.landscapeVideos || []),
      ...(req.files.landscapeImages || []),
    ].map((file) => file.path);

    let externalPortraitVideos = [];
    let externalLandscapeVideos = [];

    let externalPortraitImages = [];
    let externalLandscapeImages = [];

    try {
      if (req.body.externalPortraitVideos)
        externalPortraitVideos = JSON.parse(req.body.externalPortraitVideos);
      if (req.body.externalLandscapeVideos)
        externalLandscapeVideos = JSON.parse(req.body.externalLandscapeVideos);
      if (req.body.externalPortraitImages)
        externalPortraitImages = JSON.parse(req.body.externalPortraitImages);
      if (req.body.externalLandscapeImages)
        externalLandscapeImages = JSON.parse(req.body.externalLandscapeImages);
    } catch (err) {
      console.error("Invalid external media JSON:", err);
      return res.status(400).json({ error: "Invalid external media data" });
    }

    const newProduct = new Product({
      name: req.body.name || "Untitled",
      category: req.body.category || "Uncategorized",
      portraitFiles: portrait,
      landscapeFiles: landscape,
      externalPortraitVideos,
      externalLandscapeVideos,
      externalPortraitImages,
      externalLandscapeImages,
      date: new Date(),
    });

    await newProduct.save();
    res.status(201).json({ message: "Product uploaded", product: newProduct });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to upload product" });
  }
};


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Find the product
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Step 2: Delete portrait files
    product.portraitFiles.forEach(file => {
      const filePath = path.join('uploads', file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Step 3: Delete landscape files
    product.landscapeFiles.forEach(file => {
      const filePath = path.join('uploads', file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Step 4: Remove from database
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: 'Product and files deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const deleteSingleFile = async (req, res) => {
  try {
    const { productId } = req.params;
    const { fileUrl, category: fileType } = req.body;

    if (!productId || productId === "undefined") {
      return res.status(400).json({ error: "Invalid or missing productId." });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found." });

    // ✅ Convert fileUrl to relative DB format
    const relativePath = fileUrl.replace("http://localhost:5000/", "");

    // ✅ Remove the file from the correct array
    if (fileType === "portrait") {
      product.portraitFiles = product.portraitFiles.filter(f => f !== relativePath);
    } else if (fileType === "landscape") {
      product.landscapeFiles = product.landscapeFiles.filter(f => f !== relativePath);
    }

    // ✅ Delete from disk (only if local)
    if (!fileUrl.startsWith("http")) {
      const filePath = path.resolve("uploads", path.basename(relativePath));
      fs.unlink(filePath, (err) => {
        if (err) console.warn("File not found or already deleted:", filePath);
      });
    }

    await product.save();
    res.status(200).json({ message: "File deleted successfully." });

  } catch (err) {
    console.error("Error deleting single file:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};



