import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

/**
 * - Verifies JWT from cookie or Authorization header
 * - Attaches authenticated user to req.user
 * - Protected Route Middleware
 */
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthroised access, token is missing",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    /**
     * Selecting SystemUser field as it was given false under select: false, in the schema
     * So we need to explicitly select it
    */
    const user = await userModel.findById(decodedToken.userId).select("+systemUser");

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthroised access, token is invalid",
    });
  }
};


/**
 * - Ensures the authenticated user is a system user
 * - Must be used after authMiddleware
 * - Protected Route Middleware
 */
const systemUserMiddleware = async (req, res, next) => {
  const user = req.user;
  if (!user || !user.systemUser) {
    return res.status(403).json({
      message: "Forbidden access, system user required",
    });
  }
  return next();
}
export { authMiddleware, systemUserMiddleware };

