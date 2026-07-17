import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import { createAccountController, getUserAccountsController, getAccountBalanceController, getAccountByIdController } from "../controllers/account.controller.js";

const router = express.Router();

/**
 * - POST /api/accounts/
 * - Create a new account for the logged-in user
 * - Protected Route
 */ 
router.post("/", authMiddleware, createAccountController);

/**
 * - GET /api/accounts/get-all-accounts
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/get-all-accounts", authMiddleware, getUserAccountsController);

/**
 * - GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId", authMiddleware, getAccountBalanceController);

/**
 * - GET /api/accounts/:accountId
 * - Get a single account of the logged-in user
 * - Protected Route
 */
router.get("/:accountId", authMiddleware, getAccountByIdController);

export default router;
