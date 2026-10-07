const express = require("express");

const User =
    require("../models/User");

const Transaction =
    require("../models/Transaction");

const SupportTicket =
    require("../models/SupportTicket");

const Notification =
    require("../models/Notification");

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");

const router = express.Router();


// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            // =================================================
            // CUSTOMER COUNT
            // =================================================

            const totalCustomers =
                await User.countDocuments({
                    role: "user"
                });


            // =================================================
            // ADMIN COUNT
            // =================================================

            const totalAdmins =
                await User.countDocuments({
                    role: "admin"
                });


            // =================================================
            // TRANSACTION COUNTS
            // =================================================

            const totalTransactions =
                await Transaction.countDocuments();


            const successfulTransactions =
                await Transaction.countDocuments({
                    status: "success"
                });


            const pendingTransactions =
                await Transaction.countDocuments({
                    status: "pending"
                });


            const failedTransactions =
                await Transaction.countDocuments({
                    status: "failed"
                });


            // =================================================
            // TOTAL CUSTOMER BALANCE
            // =================================================

            const users =
                await User.find({
                    role: "user"
                })
                .select("balance");


            const totalBalance =
                users.reduce(
                    (total, user) => {

                        return (
                            total +
                            Number(
                                user.balance || 0
                            )
                        );

                    },
                    0
                );


            // =================================================
            // RECENT CUSTOMERS
            // =================================================

            const recentCustomers =
                await User.find({
                    role: "user"
                })
                .select(
                    "name email phone accountNumber balance role createdAt"
                )
                .sort({
                    createdAt: -1
                })
                .limit(5);


            // =================================================
            // RECENT TRANSACTIONS
            // =================================================

            const recentTransactions =
                await Transaction.find()
                .populate(
                    "userId",
                    "name email accountNumber"
                )
                .sort({
                    createdAt: -1
                })
                .limit(5);


            // =================================================
            // SEND DASHBOARD DATA
            // =================================================

            res.status(200).json({

                message:
                    "Admin dashboard data fetched successfully",

                stats: {

                    totalCustomers,

                    totalAdmins,

                    totalTransactions,

                    successfulTransactions,

                    pendingTransactions,

                    failedTransactions,

                    totalBalance

                },

                recentCustomers,

                recentTransactions

            });


        } catch (error) {

            console.error(
                "Admin Dashboard Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// =====================================================
// GET ALL CUSTOMERS
// =====================================================

router.get(
    "/customers",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const customers =
                await User.find({
                    role: "user"
                })
                .select(
                    "name email phone accountNumber balance role createdAt updatedAt"
                )
                .sort({
                    createdAt: -1
                });


            res.status(200).json({

                message:
                    "Customers fetched successfully",

                customers

            });


        } catch (error) {

            console.error(
                "Admin Customers Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// =====================================================
// GET ALL TRANSACTIONS
// =====================================================

router.get(
    "/transactions",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const transactions =
                await Transaction.find()
                .populate(
                    "userId",
                    "name email phone accountNumber"
                )
                .sort({
                    createdAt: -1
                });


            res.status(200).json({

                message:
                    "Transactions fetched successfully",

                transactions

            });


        } catch (error) {

            console.error(
                "Admin Transactions Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// =====================================================
// GET ALL SUPPORT TICKETS
// =====================================================

router.get(
    "/support",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const tickets =
                await SupportTicket.find()
                .populate(
                    "userId",
                    "name email phone accountNumber"
                )
                .sort({
                    createdAt: -1
                });


            res.status(200).json({

                message:
                    "Support tickets fetched successfully",

                tickets

            });


        } catch (error) {

            console.error(
                "Admin Support Tickets Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// =====================================================
// UPDATE SUPPORT TICKET
// =====================================================

router.put(
    "/support/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const {
                status,
                adminResponse
            } = req.body;


            // =================================================
            // VALID STATUS VALUES
            // =================================================

            const validStatuses = [

                "Open",

                "In Progress",

                "Resolved"

            ];


            if (
                status &&
                !validStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid support ticket status"

                });

            }


            // =================================================
            // FIND SUPPORT TICKET
            // =================================================

            const ticket =
                await SupportTicket.findById(
                    req.params.id
                );


            if (!ticket) {

                return res.status(404).json({

                    message:
                        "Support ticket not found"

                });

            }


            // =================================================
            // UPDATE STATUS
            // =================================================

            if (status) {

                ticket.status =
                    status;

            }


            // =================================================
            // UPDATE ADMIN RESPONSE
            // =================================================

            if (
                typeof adminResponse ===
                "string"
            ) {

                ticket.adminResponse =
                    adminResponse.trim();

            }


            await ticket.save();


            // =================================================
            // CUSTOMER NOTIFICATION
            // =================================================

            let notificationMessage =
                `Your support ticket ${ticket.ticketId} has been updated.`;


            if (
                status === "Resolved"
            ) {

                notificationMessage =
                    `Your support ticket ${ticket.ticketId} has been resolved successfully.`;

            }


            if (
                status === "In Progress"
            ) {

                notificationMessage =
                    `Your support ticket ${ticket.ticketId} is now being reviewed by our support team.`;

            }


            if (
                adminResponse &&
                adminResponse.trim()
            ) {

                notificationMessage +=
                    ` Admin response: ${adminResponse.trim()}`;

            }


            try {

                await Notification.create({

                    userId:
                        ticket.userId,

                    title:
                        "Support Ticket Updated",

                    message:
                        notificationMessage,

                    type:
                        "general"

                });

            } catch (notificationError) {

                console.error(
                    "Support Notification Error:",
                    notificationError
                );

            }


            // =================================================
            // GET UPDATED TICKET
            // =================================================

            const updatedTicket =
                await SupportTicket.findById(
                    ticket._id
                )
                .populate(
                    "userId",
                    "name email phone accountNumber"
                );


            res.status(200).json({

                message:
                    "Support ticket updated successfully",

                ticket:
                    updatedTicket

            });


        } catch (error) {

            console.error(
                "Update Support Ticket Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// =====================================================
// ADMIN SUPPORT SUMMARY
// =====================================================

router.get(
    "/support-summary",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const totalTickets =
                await SupportTicket.countDocuments();


            const openTickets =
                await SupportTicket.countDocuments({

                    status:
                        "Open"

                });


            const inProgressTickets =
                await SupportTicket.countDocuments({

                    status:
                        "In Progress"

                });


            const resolvedTickets =
                await SupportTicket.countDocuments({

                    status:
                        "Resolved"

                });


            res.status(200).json({

                totalTickets,

                openTickets,

                inProgressTickets,

                resolvedTickets

            });


        } catch (error) {

            console.error(
                "Support Summary Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;