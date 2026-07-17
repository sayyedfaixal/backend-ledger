import express from "express";
import {
  createInitialFundsTransaction,
  createTransaction,
} from "../controllers/transaction.controller.js";
import { authMiddleware, systemUserMiddleware } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/api.utils.js";

const router = express.Router();

/**
 * - POST /api/transactions/
 * - Create a new transaction 
 */
router.post("/", authMiddleware, asyncHandler(createTransaction));

/**
 * - POST /api/transactions/system/initial-funds
 * - Create an initial funds transaction from the system user account
 * - Protected Route (requires authMiddleware and systemUserMiddleware)
 */
router.post(
  "/system/initial-funds",
  systemUserMiddleware,
  asyncHandler(createInitialFundsTransaction)
);

export default router;