import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthroised access, token is missing",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decodedToken.userId).select("+systemUser");

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthroised access, token is invalid",
    });
  }
};


const systemUserMiddleware = async (req, res, next)=>{
  const user = req.user;
  if (!user || !user.systemUser) {
    return res.status(403).json({
      message: "Forbidden access, system user required",
    });
  }
  return next();
}
export { authMiddleware, systemUserMiddleware };

