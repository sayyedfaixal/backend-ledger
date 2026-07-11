import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Account must be associated with a User."],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Status can be either ACTIVE, FROZEN or CLOSED",
      },
      default: "ACTIVE",
    },
    currency: {
      type: String,
      required: [true, "Currency is required while creating an account"],
      default: "INR",
    },
  },
  { timestamps: true },
);

// Creating compound index based on user or status
accountSchema.index({
  user: 1,
  status: 1,
});

const accountModel = mongoose.model("account", accountSchema);

export default accountModel;
