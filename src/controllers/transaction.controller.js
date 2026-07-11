import mongoose from "mongoose";
import transactionModel from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import { sendTransactionEmail, sendFailedTransactionEmail } from "../services/email.service.js";
import accountModel from "../models/account.model.js";

/**
 * Create a new transaction
 * The TRANSFER flow
 * 
 * Validation Steps:
 * 1. Validate request body (fromAccount, toAccount, amount, idempotencyKey)
 * 2. Validate fromAccount !== toAccount (no self-transfer)
 * 3. Validate amount is positive number
 * 4. Validate idempotency key (check for duplicate transaction)
 * 5. Validate fromAccount exists
 * 6. Validate toAccount exists
 * 7. Validate fromAccount status is ACTIVE
 * 8. Validate toAccount status is ACTIVE
 * 9. Validate currency match between accounts
 * 10. Derive sender balance from ledger
 * 11. Validate sufficient balance for transfer
 * 
 * Transaction Steps:
 * 12. Start MongoDB session
 * 13. Create transaction (PENDING)
 * 14. Create Debit entry for sender
 * 15. Create Credit entry for receiver
 * 16. Mark transaction COMPLETED
 * 17. Commit MongoDB session
 * 
 * Post-Transaction Steps:
 * 18. Send email notification to sender
 * 19. Send email notification to receiver
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