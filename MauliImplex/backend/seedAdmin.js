import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config(); // load .env with MONGO_URI

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminID = "fruitadmin"; // your login ID
    const plainPassword = "admin123"; // your login password

    // hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // check if already exists
    const existingAdmin = await Admin.findOne({ adminID });
    if (existingAdmin) {
      console.log("Admin already exists!");
    } else {
      await Admin.create({ adminID, password: hashedPassword });
      console.log("✅ Admin created successfully!");
    }

    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding admin:", err.message);
    mongoose.disconnect();
  }
};

seedAdmin();
