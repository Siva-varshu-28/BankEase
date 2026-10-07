const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// DEMO STRIPE ACCOUNT ID GENERATOR
// ==========================================

const generateStripeAccountId = () => {

    return (
        "acct_demo_" +
        Math.floor(
            10000000 +
            Math.random() * 90000000
        )
    );

};


// ==========================================
// REGISTER
// ==========================================

router.post(
    "/register",
    async (req, res) => {

        try {

            const {
                name,
                email,
                phone,
                password
            } = req.body;


            if (
                !name ||
                !email ||
                !phone ||
                !password
            ) {

                return res.status(400).json({
                    message:
                        "All fields are required"
                });

            }


            if (password.length < 6) {

                return res.status(400).json({
                    message:
                        "Password must contain at least 6 characters"
                });

            }


            const existingUser =
                await User.findOne({
                    email:
                        email.toLowerCase().trim()
                });


            if (existingUser) {

                return res.status(400).json({
                    message:
                        "Email already registered"
                });

            }


            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // Generate Account Number

            let accountNumber;
            let existingAccount;


            do {

                accountNumber =
                    "1000" +
                    Math.floor(
                        100000 +
                        Math.random() * 900000
                    );


                existingAccount =
                    await User.findOne({
                        accountNumber
                    });

            } while (existingAccount);


            // Generate Demo Stripe Account ID

            let stripeAccountId;
            let existingStripeAccount;


            do {

                stripeAccountId =
                    generateStripeAccountId();


                existingStripeAccount =
                    await User.findOne({
                        stripeAccountId
                    });

            } while (existingStripeAccount);


            const user = new User({

                name:
                    name.trim(),

                email:
                    email.toLowerCase().trim(),

                phone:
                    phone.trim(),

                password:
                    hashedPassword,

                accountNumber,

                stripeAccountId

            });


            await user.save();


            res.status(201).json({

                message:
                    "Registration successful",

                accountNumber:
                    user.accountNumber,

                stripeAccountId:
                    user.stripeAccountId

            });


        } catch (error) {

            console.error(
                "Registration Error:",
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
// LOGIN
// ==========================================

router.post(
    "/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            if (!email || !password) {

                return res.status(400).json({
                    message:
                        "Email and password are required"
                });

            }


            const user =
                await User.findOne({
                    email:
                        email.toLowerCase().trim()
                });


            if (!user) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });

            }


            const isPasswordCorrect =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!isPasswordCorrect) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });

            }


            const token =
                jwt.sign(
                    {
                        id: user._id,
                        role: user.role
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn: "1d"
                    }
                );


            res.status(200).json({

                message:
                    "Login successful",

                token,

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    accountNumber:
                        user.accountNumber,

                    stripeAccountId:
                        user.stripeAccountId ||
                        null,

                    balance:
                        user.balance,

                    role:
                        user.role

                }

            });


        } catch (error) {

            console.error(
                "Login Error:",
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
// FORGOT PASSWORD
// ==========================================

router.post(
    "/forgot-password",
    async (req, res) => {

        try {

            const { email } = req.body;


            if (!email) {

                return res.status(400).json({
                    message:
                        "Please enter your registered email"
                });

            }


            const user =
                await User.findOne({
                    email:
                        email.toLowerCase().trim()
                });


            /*
             * Security:
             * Don't reveal whether
             * an email exists.
             */

            if (!user) {

                return res.status(200).json({

                    message:
                        "If the email is registered, password reset instructions have been generated."

                });

            }


            // Generate reset token

            const resetToken =
                crypto
                    .randomBytes(32)
                    .toString("hex");


            // Hash token before storing

            const resetTokenHash =
                crypto
                    .createHash("sha256")
                    .update(resetToken)
                    .digest("hex");


            // Token valid for 15 minutes

            const resetTokenExpires =
                Date.now() +
                15 * 60 * 1000;


            user.resetPasswordToken =
                resetTokenHash;


            user.resetPasswordExpires =
                resetTokenExpires;


            await user.save();


            /*
             * DEMO MODE
             *
             * In a real banking application,
             * this token should be sent through
             * a secure email service.
             */

            res.status(200).json({

                message:
                    "Password reset token generated successfully",

                resetToken:
                    resetToken

            });


        } catch (error) {

            console.error(
                "Forgot Password Error:",
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
// RESET PASSWORD
// ==========================================

router.post(
    "/reset-password",
    async (req, res) => {

        try {

            const {
                resetToken,
                newPassword
            } = req.body;


            if (
                !resetToken ||
                !newPassword
            ) {

                return res.status(400).json({

                    message:
                        "Reset token and new password are required"

                });

            }


            if (newPassword.length < 6) {

                return res.status(400).json({

                    message:
                        "Password must contain at least 6 characters"

                });

            }


            // Hash received token

            const resetTokenHash =
                crypto
                    .createHash("sha256")
                    .update(resetToken)
                    .digest("hex");


            // Find user with valid token

            const user =
                await User.findOne({

                    resetPasswordToken:
                        resetTokenHash,

                    resetPasswordExpires: {
                        $gt: new Date()
                    }

                });


            if (!user) {

                return res.status(400).json({

                    message:
                        "Invalid or expired reset token"

                });

            }


            // Check if new password
            // is same as old password

            const isSamePassword =
                await bcrypt.compare(
                    newPassword,
                    user.password
                );


            if (isSamePassword) {

                return res.status(400).json({

                    message:
                        "New password must be different from current password"

                });

            }


            // Hash new password

            const hashedPassword =
                await bcrypt.hash(
                    newPassword,
                    10
                );


            user.password =
                hashedPassword;


            // Clear reset token

            user.resetPasswordToken =
                null;

            user.resetPasswordExpires =
                null;


            await user.save();


            res.status(200).json({

                message:
                    "Password reset successfully"

            });


        } catch (error) {

            console.error(
                "Reset Password Error:",
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
// CHANGE PASSWORD
// ==========================================

router.post(
    "/change-password",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                currentPassword,
                newPassword
            } = req.body;


            if (
                !currentPassword ||
                !newPassword
            ) {

                return res.status(400).json({

                    message:
                        "Current password and new password are required"

                });

            }


            if (newPassword.length < 6) {

                return res.status(400).json({

                    message:
                        "New password must contain at least 6 characters"

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


            const isPasswordCorrect =
                await bcrypt.compare(
                    currentPassword,
                    user.password
                );


            if (!isPasswordCorrect) {

                return res.status(400).json({

                    message:
                        "Current password is incorrect"

                });

            }


            const isSamePassword =
                await bcrypt.compare(
                    newPassword,
                    user.password
                );


            if (isSamePassword) {

                return res.status(400).json({

                    message:
                        "New password must be different from current password"

                });

            }


            const hashedPassword =
                await bcrypt.hash(
                    newPassword,
                    10
                );


            user.password =
                hashedPassword;


            await user.save();


            res.status(200).json({

                message:
                    "Password changed successfully"

            });


        } catch (error) {

            console.error(
                "Change Password Error:",
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