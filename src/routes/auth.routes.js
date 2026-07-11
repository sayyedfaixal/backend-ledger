import express from "express";
import userRegistrationController from "../controllers/auth.controller.js";
const router = express.Router();

router.get("/hello", (req, res) => {
  res.send("Hello from `/helo` route");
});
router.post("/register", userRegistrationController);

export default router;
