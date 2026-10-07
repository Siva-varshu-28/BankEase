const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: ["deposit", "withdraw", "transfer", "bill"],
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 1
        },

        description: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["success", "pending", "failed"],
            default: "success"
        },

        transactionId: {
            type: String,
            unique: true,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Transaction",
    transactionSchema
);