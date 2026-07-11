import express from "express";
import userRegistrationController from "../controllers/auth.controller.js";
const router = express.Router();

/**
 * - GET /api/auth/hello
 * - Simple health check route
 * - Public Route
 */
router.get("/hello", (req, res) => {
  res.send("Hello from `/helo` route");
});

/**
 * - POST /api/auth/register
 * - Register a new user
 * - Public Route
 */
router.post("/register", userRegistrationController);

export default router;
