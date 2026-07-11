import express from "express";
import { createInitialFundsTransaction } from "../controllers/transaction.controller.js";
import { authMiddleware, systemUserMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/system/initial-funds", authMiddleware, systemUserMiddleware, createInitialFundsTransaction);

export default router;