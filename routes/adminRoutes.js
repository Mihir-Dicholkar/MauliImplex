import express from "express";
import { loginAdmin } from "../controllers/adminController.js";
import { body } from "express-validator";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

router.post(
  "/login",
  [
    body("adminID", "Admin ID is required").notEmpty(),
    body("password", "Password is required").notEmpty(),
  ],
  loginAdmin
);


// protected route
router.get("/dashboard", adminAuth, (req, res) => {
  res.json({ message: "Welcome Admin!", admin: req.admin });
});


export default router;
