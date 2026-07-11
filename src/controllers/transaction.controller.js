import mongoose from "mongoose";
import transactionModel from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import { sendTransactionEmail, sendFailedTransactionEmail } from "../services/email.service.js";
import accountModel from "../models/account.model.js";

/**
 * - POST /api/transactions/
 * - Create a new transfer transaction between two accounts
 * - Protected Route
 */
const createTransaction = async (req, res) => {
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body;

    // Validate if the request coming is from the account or another account
    if (fromAccount === toAccount) {
        return res.status(400).json({
            success: false,
            message: "From account and to account cannot be the same",
        });
    }
    
}

/**
 * - POST /api/transactions/system/initial-funds
 * - Create an initial funds transaction from the system user to a target account
 * - Protected Route (requires authMiddleware and systemUserMiddleware)
 */
const createInitialFundsTransaction = async (req, res) => {
    const {toAccount, amount, idempotencyKey} = req.body;
    
    if(!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            success: false,
            message: "To account, amount and idempotency key are required",
        });
    }

    const toUserAccount =  await accountModel.findOne({_id: toAccount});
    if(!toUserAccount) {
        return res.status(404).json({
            success: false,
            message: "To account not found",
        });
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id,
    })
    
    if(!fromUserAccount) {
        return res.status(404).json({
            success: false,
            message: "System user account not found",
        });
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const transaction = await transactionModel.create([{
            fromAccount: fromUserAccount._id,
            toAccount: toUserAccount._id,
            amount: amount,
            idempotencyKey: idempotencyKey,
            status: "COMPLETED",
        }], { session });

        const createdTransaction = transaction[0];

        // Create debit entry for sender
        await ledgerModel.create([{
            account: fromUserAccount._id,
            transaction: createdTransaction._id,
            amount: -amount,
            type: "DEBIT",
        }], { session });

        // Create credit entry for receiver
        await ledgerModel.create([{
            account: toUserAccount._id,
            transaction: createdTransaction._id,
            amount: amount,
            type: "CREDIT",
        }], { session });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message: "Initial funds transaction created successfully",
            data: createdTransaction,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
export { createTransaction, createInitialFundsTransaction };   