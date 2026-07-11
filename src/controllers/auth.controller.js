import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

/**
 * User Registration Controller
 * POST /api/auth/register
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

  return res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token: token,
  });
}

export default userRegistrationController;
