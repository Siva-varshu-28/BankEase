const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


// ==========================================
// ROUTES
// ==========================================

const authRoutes =
    require("./routes/authRoutes");

const transactionRoutes =
    require("./routes/transactionRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

const notificationRoutes =
    require("./routes/notificationRoutes");

const supportRoutes =
    require("./routes/supportRoutes");


// ==========================================
// APP
// ==========================================

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/transactions",
    transactionRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);

app.use(
    "/api/support",
    supportRoutes
);


// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.send(
        "Banking Management System API Running"
    );

});


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "MongoDB Connected"
        );


        // ==================================
        // START SERVER
        // ==================================

        app.listen(
            process.env.PORT || 5000,
            () => {

                console.log(
                    `Server running on port ${
                        process.env.PORT || 5000
                    }`
                );

            }
        );

    })

    .catch((error) => {

        console.log(
            "MongoDB Connection Error:",
            error
        );

    });