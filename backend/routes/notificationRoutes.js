const express = require("express");

const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================

router.get(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const notifications =
                await Notification.find({
                    userId: req.user.id
                })
                .sort({
                    createdAt: -1
                });


            res.status(200).json({

                message:
                    "Notifications fetched successfully",

                notifications

            });

        } catch (error) {

            console.error(
                "Get Notifications Error:",
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
// GET UNREAD NOTIFICATION COUNT
// ==========================================

router.get(
    "/unread-count",
    authMiddleware,
    async (req, res) => {

        try {

            const unreadCount =
                await Notification.countDocuments({

                    userId:
                        req.user.id,

                    isRead:
                        false

                });


            res.status(200).json({

                unreadCount

            });

        } catch (error) {

            console.error(
                "Unread Count Error:",
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
// MARK ONE NOTIFICATION AS READ
// ==========================================

router.put(
    "/:id/read",
    authMiddleware,
    async (req, res) => {

        try {

            const notification =
                await Notification.findOneAndUpdate(

                    {
                        _id:
                            req.params.id,

                        userId:
                            req.user.id
                    },

                    {
                        isRead:
                            true
                    },

                    {
                        new: true
                    }

                );


            if (!notification) {

                return res.status(404).json({

                    message:
                        "Notification not found"

                });

            }


            res.status(200).json({

                message:
                    "Notification marked as read",

                notification

            });

        } catch (error) {

            console.error(
                "Mark Notification Read Error:",
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
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

router.put(
    "/read-all",
    authMiddleware,
    async (req, res) => {

        try {

            await Notification.updateMany(

                {
                    userId:
                        req.user.id,

                    isRead:
                        false
                },

                {
                    isRead:
                        true
                }

            );


            res.status(200).json({

                message:
                    "All notifications marked as read"

            });

        } catch (error) {

            console.error(
                "Mark All Read Error:",
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
// DELETE NOTIFICATION
// ==========================================

router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const notification =
                await Notification.findOneAndDelete({

                    _id:
                        req.params.id,

                    userId:
                        req.user.id

                });


            if (!notification) {

                return res.status(404).json({

                    message:
                        "Notification not found"

                });

            }


            res.status(200).json({

                message:
                    "Notification deleted successfully"

            });

        } catch (error) {

            console.error(
                "Delete Notification Error:",
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