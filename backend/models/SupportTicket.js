const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        ticketId: {
            type: String,
            unique: true,
            required: true
        },

        category: {
            type: String,
            enum: [
                "Account",
                "Transaction",
                "Money Transfer",
                "Bill Payment",
                "Deposit",
                "Withdrawal",
                "Login & Security",
                "Other"
            ],
            required: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Open",
                "In Progress",
                "Resolved"
            ],
            default: "Open"
        },

        adminResponse: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "SupportTicket",
    supportTicketSchema
);