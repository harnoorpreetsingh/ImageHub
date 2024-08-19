import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    // Retrieve the token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).json({
        message: "No token provided",
      });
    }

    // Verify the token
    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    // Find the user by the ID from the token
    const user = await User.findById(decodedData.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Check for specific errors
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        message: "Invalid token",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        message: "Token expired",
      });
    }
    
    res.status(500).json({
      message: "Server error",
    });
  }
};
