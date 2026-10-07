const express = require("express");

const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GENERATE TRANSACTION ID
// ==========================================

const generateTransactionId = () => {

    return (
        "TXN" +
        Date.now() +
        Math.floor(
            1000 +
            Math.random() * 9000
        )
    );

};


// ==========================================
// CREATE NOTIFICATION HELPER
// ==========================================

const createNotification = async (
    userId,
    title,
    message,
    type
) => {

    try {

        await Notification.create({

            userId,

            title,

            message,

            type

        });

    } catch (error) {

        console.error(
            "Notification Creation Error:",
            error
        );

    }

};


// ==========================================
// DEPOSIT
// ==========================================

router.post(
    "/deposit",
    authMiddleware,
    async (req, res) => {

        try {

            const { amount } = req.body;

            const depositAmount =
                Number(amount);


            if (
                !depositAmount ||
                depositAmount <= 0
            ) {

                return res.status(400).json({

                    message:
                        "Please enter a valid deposit amount"

                });

            }


            const user =
                await User.findById(
                    req.user.id
                );


            if (!user) {

                return res.status(404).json({

                    message:
                        "User not found"

                });

            }


            user.balance =
                Number(user.balance || 0) +
                depositAmount;


            await user.save();


            const transaction =
                await Transaction.create({

                    userId:
                        user._id,

                    type:
                        "deposit",

                    amount:
                        depositAmount,

                    description:
                        "Cash deposit",

                    status:
                        "success",

                    transactionId:
                        generateTransactionId()

                });


            await createNotification(

                user._id,

                "Deposit Successful",

                `₹${depositAmount.toFixed(
                    2
                )} has been deposited successfully into your account.`,

                "deposit"

            );


            res.status(200).json({

                message:
                    "Deposit successful",

                balance:
                    user.balance,

                transaction

            });

        } catch (error) {

            console.error(
                "Deposit Error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// ==========================================
// WITHDRAW
// ==========================================

router.post(
    "/withdraw",
    authMiddleware,
    async (req, res) => {

        try {

            const { amount } = req.body;

            const withdrawAmount =
                Number(amount);


            if (
                !withdrawAmount ||
                withdrawAmount <= 0
            ) {

                return res.status(400).json({

                    message:
                        "Please enter a valid withdrawal amount"

                });

            }


            const user =
                await User.findById(
                    req.user.id
                );


            if (!user) {

                return res.status(404).json({

                    message:
                        "User not found"

                });

            }


            if (
                Number(user.balance) <
                withdrawAmount
            ) {

                return res.status(400).json({

                    message:
                        "Insufficient balance"

                });

            }


            user.balance =
                Number(user.balance) -
                withdrawAmount;


            await user.save();


            const transaction =
                await Transaction.create({

                    userId:
                        user._id,

                    type:
                        "withdraw",

                    amount:
                        withdrawAmount,

                    description:
                        "Cash withdrawal",

                    status:
                        "success",

                    transactionId:
                        generateTransactionId()

                });


            await createNotification(

                user._id,

                "Withdrawal Successful",

                `₹${withdrawAmount.toFixed(
                    2
                )} has been withdrawn successfully from your account.`,

                "withdraw"

            );


            res.status(200).json({

                message:
                    "Withdrawal successful",

                balance:
                    user.balance,

                transaction

            });

        } catch (error) {

            console.error(
                "Withdraw Error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// ==========================================
// TRANSFER MONEY
// ==========================================

router.post(
    "/transfer",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                receiverAccountNumber,
                amount
            } = req.body;


            const transferAmount =
                Number(amount);


            if (
                !receiverAccountNumber ||
                !transferAmount ||
                transferAmount <= 0
            ) {

                return res.status(400).json({

                    message:
                        "Receiver account number and valid amount are required"

                });

            }


            const sender =
                await User.findById(
                    req.user.id
                );


            if (!sender) {

                return res.status(404).json({

                    message:
                        "Sender account not found"

                });

            }


            const receiver =
                await User.findOne({

                    accountNumber:
                        receiverAccountNumber.trim()

                });


            if (!receiver) {

                return res.status(404).json({

                    message:
                        "Receiver account not found"

                });

            }


            if (
                sender.accountNumber ===
                receiver.accountNumber
            ) {

                return res.status(400).json({

                    message:
                        "You cannot transfer money to your own account"

                });

            }


            if (
                Number(sender.balance) <
                transferAmount
            ) {

                return res.status(400).json({

                    message:
                        "Insufficient balance"

                });

            }


            // ==============================
            // UPDATE BALANCES
            // ==============================

            sender.balance =
                Number(sender.balance) -
                transferAmount;


            receiver.balance =
                Number(receiver.balance || 0) +
                transferAmount;


            await sender.save();

            await receiver.save();


            // ==============================
            // SENDER TRANSACTION
            // ==============================

            const senderTransactionId =
                generateTransactionId();


            const senderTransaction =
                await Transaction.create({

                    userId:
                        sender._id,

                    type:
                        "transfer",

                    amount:
                        transferAmount,

                    description:
                        `Transfer to ${receiver.name}`,

                    status:
                        "success",

                    transactionId:
                        senderTransactionId

                });


            // ==============================
            // RECEIVER TRANSACTION
            // ==============================

            const receiverTransaction =
                await Transaction.create({

                    userId:
                        receiver._id,

                    type:
                        "deposit",

                    amount:
                        transferAmount,

                    description:
                        `Received from ${sender.name}`,

                    status:
                        "success",

                    transactionId:
                        generateTransactionId()

                });


            // ==============================
            // SENDER NOTIFICATION
            // ==============================

            await createNotification(

                sender._id,

                "Money Transfer Successful",

                `₹${transferAmount.toFixed(
                    2
                )} has been transferred successfully to ${receiver.name}.`,

                "transfer"

            );


            // ==============================
            // RECEIVER NOTIFICATION
            // ==============================

            await createNotification(

                receiver._id,

                "Money Received",

                `₹${transferAmount.toFixed(
                    2
                )} has been received from ${sender.name}.`,

                "transaction"

            );


            res.status(200).json({

                message:
                    "Money transferred successfully",

                balance:
                    sender.balance,

                transaction:
                    senderTransaction,

                receiverTransaction

            });

        } catch (error) {

            console.error(
                "Transfer Error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// ==========================================
// BILL PAYMENT
// ==========================================

router.post(
    "/bill-payment",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                billType,
                consumerNumber,
                amount
            } = req.body;


            const billAmount =
                Number(amount);


            if (
                !billType ||
                !consumerNumber ||
                !billAmount ||
                billAmount <= 0
            ) {

                return res.status(400).json({

                    message:
                        "Bill type, consumer number and valid amount are required"

                });

            }


            const user =
                await User.findById(
                    req.user.id
                );


            if (!user) {

                return res.status(404).json({

                    message:
                        "User not found"

                });

            }


            if (
                Number(user.balance) <
                billAmount
            ) {

                return res.status(400).json({

                    message:
                        "Insufficient balance"

                });

            }


            user.balance =
                Number(user.balance) -
                billAmount;


            await user.save();


            const transaction =
                await Transaction.create({

                    userId:
                        user._id,

                    type:
                        "bill",

                    amount:
                        billAmount,

                    description:
                        `${billType} bill payment - ${consumerNumber}`,

                    status:
                        "success",

                    transactionId:
                        generateTransactionId()

                });


            await createNotification(

                user._id,

                "Bill Payment Successful",

                `₹${billAmount.toFixed(
                    2
                )} ${billType} bill payment was successful.`,

                "bill"

            );


            res.status(200).json({

                message:
                    "Bill payment successful",

                balance:
                    user.balance,

                transaction

            });

        } catch (error) {

            console.error(
                "Bill Payment Error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// ==========================================
// ACCOUNT STATEMENT
// ==========================================

router.get(
    "/statement",
    authMiddleware,
    async (req, res) => {

        try {

            const transactions =
                await Transaction.find({

                    userId:
                        req.user.id

                })
                .sort({
                    createdAt: -1
                });


            res.status(200).json({

                message:
                    "Account statement fetched successfully",

                transactions

            });

        } catch (error) {

            console.error(
                "Statement Error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// ==========================================
// TRANSACTION HISTORY
// ==========================================

router.get(
    "/history",
    authMiddleware,
    async (req, res) => {

        try {

            const transactions =
                await Transaction.find({

                    userId:
                        req.user.id

                })
                .sort({
                    createdAt: -1
                });


            res.status(200).json({

                message:
                    "Transaction history fetched successfully",

                transactions

            });

        } catch (error) {

            console.error(
                "Transaction History Error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// ==========================================
// DASHBOARD SUMMARY
// ==========================================

router.get(
    "/summary",
    authMiddleware,
    async (req, res) => {

        try {

            const transactions =
                await Transaction.find({

                    userId:
                        req.user.id

                });


            let income = 0;
            let expenses = 0;


            transactions.forEach(
                (transaction) => {

                    const amount =
                        Number(
                            transaction.amount || 0
                        );


                    if (
                        transaction.type ===
                        "deposit"
                    ) {

                        income += amount;

                    } else {

                        expenses += amount;

                    }

                }
            );


            res.status(200).json({

                income,

                expenses,

                transactionCount:
                    transactions.length

            });

        } catch (error) {

            console.error(
                "Summary Error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


module.exports = router;