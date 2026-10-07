import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


// Customer pages
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

import Dashboard from "./Dashboard";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import SendMoney from "./SendMoney";
import Transactions from "./Transactions";
import AccountStatement from "./AccountStatement";
import AccountManagement from "./AccountManagement";
import BillPayment from "./BillPayment";
import Profile from "./Profile";
import Security from "./Security";
import Analytics from "./Analytics";
import Notifications from "./Notifications";
import Support from "./Support";


// Admin pages
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import Customers from "./Customers";
import AdminTransactions from "./AdminTransactions";
import AdminSupport from "./AdminSupport";


function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* =========================
                    CUSTOMER AUTH
                ========================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                {/* =========================
                    CUSTOMER DASHBOARD
                ========================= */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                {/* =========================
                    CUSTOMER BANKING
                ========================= */}

                <Route
                    path="/deposit"
                    element={<Deposit />}
                />

                <Route
                    path="/withdraw"
                    element={<Withdraw />}
                />

                <Route
                    path="/send-money"
                    element={<SendMoney />}
                />

                <Route
                    path="/transactions"
                    element={<Transactions />}
                />

                <Route
                    path="/statement"
                    element={<AccountStatement />}
                />

                <Route
                    path="/account"
                    element={<AccountManagement />}
                />

                <Route
                    path="/bill-payment"
                    element={<BillPayment />}
                />

                <Route
                    path="/analytics"
                    element={<Analytics />}
                />


                {/* =========================
                    CUSTOMER ACCOUNT
                ========================= */}

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/security"
                    element={<Security />}
                />

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />

                <Route
                    path="/support"
                    element={<Support />}
                />


                {/* =========================
                    ADMIN
                ========================= */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/customers"
                    element={<Customers />}
                />

                <Route
                    path="/admin/transactions"
                    element={<AdminTransactions />}
                />

                <Route
                    path="/admin/support"
                    element={<AdminSupport />}
                />


                {/* =========================
                    INVALID ROUTE
                ========================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;