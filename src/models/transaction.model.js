import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Transaction must be associated with FROM Account"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Transaction must be associated with TO Account"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required for creating a Transaction"],
      min: [0, "Transaction cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        message: "Status can be either PENDING, COMPLETED, FAILED or REVERSED",
      },
      default: "PENDING",
    },
    idempotencyKey: {
      type: String,
      required: [
        true,
        "Idempotency key is required for creating a transaction",
      ],
    },
  },
  { timestamps: true },
);

const transactionModel = mongoose.model("transaction", transactionSchema);
export default transactionModel;
