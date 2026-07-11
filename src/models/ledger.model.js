import mongoose from "mongoose"

const LedgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Account is required for creating a ledger entry"],
        immutable: true,
        index: true
    },
    transaction:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true, "Ledger must be associated with a transaction"],
        immutable: true,
        index: true
    },
    amount:{
        type: Number,
        required: [true, "Amount is required for creating a ledger entry"],
        immutable: true
    },
    type:{
        type: String,
        enum: ["DEBIT", "CREDIT"],
        required: [true, "Type is required for creating a ledger entry"],
        immutable: true
    }
}, {timestamps: true})

const preventLedgerModification = ()=>{
    throw new Error("Ledger entries are immutable and cannot be modified once created nor be deleted");
}

// Prevent updates and deletions
LedgerSchema.pre("updateOne", preventLedgerModification);
LedgerSchema.pre("deleteOne", preventLedgerModification);
LedgerSchema.pre("findOneAndUpdate", preventLedgerModification);
LedgerSchema.pre("findOneAndDelete", preventLedgerModification);
LedgerSchema.pre("updateMany", preventLedgerModification);
LedgerSchema.pre("deleteMany", preventLedgerModification);
LedgerSchema.pre("bulkWrite", preventLedgerModification);
LedgerSchema.pre("replaceOne", preventLedgerModification);
LedgerSchema.pre("findOneAndReplace", preventLedgerModification);
LedgerSchema.pre("update", preventLedgerModification);
LedgerSchema.pre("delete", preventLedgerModification);


 const LedgerModel = mongoose.model("ledger", LedgerSchema);
 
 export default LedgerModel;
