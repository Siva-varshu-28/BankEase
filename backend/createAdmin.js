const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");


const createAdmin = async () => {

    try {

        // =====================================
        // CONNECT MONGODB
        // =====================================

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB Connected"
        );


        // =====================================
        // ADMIN DETAILS
        // =====================================

        const name =
            "BankEase Admin";

        const email =
            "admin@bankease.com";

        const phone =
            "9999999999";

        const password =
            "admin123";


        // =====================================
        // CHECK EXISTING ADMIN
        // =====================================

        const existingAdmin =
            await User.findOne({
                email: email
            });


        if (existingAdmin) {

            console.log(
                "Admin account already exists"
            );

            await mongoose.connection.close();

            return;
        }


        // =====================================
        // HASH PASSWORD
        // =====================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // =====================================
        // CREATE ADMIN
        // =====================================

        const admin =
            new User({

                name: name,

                email: email,

                phone: phone,

                password: hashedPassword,

                accountNumber:
                    "9999999999",

                role: "admin",

                balance: 0

            });


        await admin.save();


        console.log(
            "================================="
        );

        console.log(
            "Admin account created successfully"
        );

        console.log(
            "Email:",
            email
        );

        console.log(
            "Password:",
            password
        );

        console.log(
            "Role:",
            admin.role
        );

        console.log(
            "================================="
        );


        await mongoose.connection.close();


    } catch (error) {

        console.error(
            "Admin Creation Error:",
            error
        );

        await mongoose.connection.close();

    }

};


createAdmin();