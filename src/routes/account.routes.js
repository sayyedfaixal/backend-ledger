import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createAccountController,
  getUserAccountsController,
  getAccountBalanceController,
  getAccountByIdController,
} from "../controllers/account.controller.js";
import { asyncHandler } from "../utils/api.utils.js";

const router = express.Router();

/**
 * - POST /api/accounts/
 * - Create a new account for the logged-in user
 * - Protected Route
 */ 
router.post("/", authMiddleware, asyncHandler(createAccountController));

/**
 * - GET /api/accounts/get-all-accounts
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/get-all-accounts", authMiddleware, asyncHandler(getUserAccountsController));

/**
 * - GET /api/accounts/balance/:accountId
 */
router.get(
  "/balance/:accountId",
  authMiddleware,
  asyncHandler(getAccountBalanceController)
);

/**
 * - GET /api/accounts/:accountId
 * - Get a single account of the logged-in user
 * - Protected Route
 */
router.get("/:accountId", authMiddleware, asyncHandler(getAccountByIdController));

export default router;
