import userModel from "../models/user.model.js";
import tokenBlackListModel from "../models/blacklist.models.js";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "../services/email.service.js";
/**
 * - POST /api/auth/register
 * - Register a new user and return user data with JWT token
 * - Public Route
 */
async function userRegistrationController(req, res) {
  const { email, password, name } = req.body;

  const doesExists = await userModel.findOne({ email });

  if (doesExists) {
    return res.status(422).json({
      message: "User with given email already exists.",
      status: "failed",
    });
  }

  const user = await userModel.create({
    email,
    name,
    password,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token: token,
  });

  console.log("sending email function call");
  await sendRegistrationEmail(user.email, user.name);
}

/**
 * - POST /api/auth/login
 * - Authenticate user with email and password and return JWT token
 * - Public Route
 */
async function loginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
      status: "failed",
    });
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password.",
      status: "failed",
    });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid email or password.",
      status: "failed",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token: token,
  });
}

async function logoutController(req, res) {
  const token = req.token || req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      message: "Token is required to logout",
    });
  }

  try {
    await tokenBlackListModel.create({ token });
  } catch (error) {
    if (error.code !== 11000) {
      console.error("Error blacklisting token", error);
      return res.status(500).json({
        message: "Unable to logout right now",
      });
    }
  }

  res.clearCookie("token");
  return res.status(200).json({
    message: "Logged out successfully",
  });
}

export { userRegistrationController, loginController, logoutController };
