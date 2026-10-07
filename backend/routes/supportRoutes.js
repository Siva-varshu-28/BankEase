const express = require("express");

const SupportTicket =
    require("../models/SupportTicket");

const authMiddleware =
    require("../middleware/authMiddleware");

const Notification =
    require("../models/Notification");

const router = express.Router();


// =====================================================
// GENERATE TICKET ID
// =====================================================

const generateTicketId = () => {

    return (
        "TKT" +
        Date.now() +
        Math.floor(
            100 +
            Math.random() * 900
        )
    );

};


// =====================================================
// CREATE SUPPORT TICKET
// =====================================================

router.post(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                category,
                subject,
                description
            } = req.body;


            // =============================================
            // VALIDATION
            // =============================================

            if (
                !category ||
                !subject ||
                !description
            ) {

                return res.status(400).json({

                    message:
                        "Category, subject and description are required"

                });

            }


            if (
                subject.trim().length < 3
            ) {

                return res.status(400).json({

                    message:
                        "Subject must contain at least 3 characters"

                });

            }


            if (
                description.trim().length < 10
            ) {

                return res.status(400).json({

                    message:
                        "Description must contain at least 10 characters"

                });

            }


            // =============================================
            // GENERATE UNIQUE TICKET ID
            // =============================================

            let ticketId;

            let existingTicket;


            do {

                ticketId =
                    generateTicketId();


                existingTicket =
                    await SupportTicket.findOne({
                        ticketId
                    });


            } while (existingTicket);


            // =============================================
            // CREATE TICKET
            // =============================================

            const ticket =
                await SupportTicket.create({

                    userId:
                        req.user.id,

                    ticketId,

                    category:
                        category.trim(),

                    subject:
                        subject.trim(),

                    description:
                        description.trim(),

                    status:
                        "Open"

                });


            // =============================================
            // CREATE NOTIFICATION
            // =============================================

            try {

                await Notification.create({

                    userId:
                        req.user.id,

                    title:
                        "Support Request Submitted",

                    message:
                        `Your support ticket ${ticket.ticketId} has been submitted successfully.`,

                    type:
                        "general"

                });

            } catch (notificationError) {

                console.error(
                    "Support Notification Error:",
                    notificationError
                );

            }


            // =============================================
            // RESPONSE
            // =============================================

            res.status(201).json({

                message:
                    "Support request submitted successfully",

                ticket

            });


        } catch (error) {

            console.error(
                "Create Support Ticket Error:",
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
// GET USER SUPPORT TICKETS
// =====================================================

router.get(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const tickets =
                await SupportTicket.find({

                    userId:
                        req.user.id

                })
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
                "Get Support Tickets Error:",
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
// GET SINGLE SUPPORT TICKET
// =====================================================

router.get(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const ticket =
                await SupportTicket.findOne({

                    _id:
                        req.params.id,

                    userId:
                        req.user.id

                });


            if (!ticket) {

                return res.status(404).json({

                    message:
                        "Support ticket not found"

                });

            }


            res.status(200).json({

                message:
                    "Support ticket fetched successfully",

                ticket

            });


        } catch (error) {

            console.error(
                "Get Support Ticket Error:",
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