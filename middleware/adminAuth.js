import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  // Get token from request headers
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Token comes as: "Bearer tokenstring"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    // Verify token with your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach admin info to request (optional)
    req.admin = decoded;

    // Continue to next middleware/controller
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
};

export default adminAuth;
