import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AccountManagement.css";


function AccountManagement() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD USER
    // =====================================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        const token =
            localStorage.getItem("token");


        if (!token || !storedUser) {

            navigate("/");

            return;

        }


        try {

            const parsedUser =
                JSON.parse(storedUser);

            setUser(parsedUser);

        } catch (error) {

            console.error(
                "User data error:",
                error
            );

            navigate("/");

        } finally {

            setLoading(false);

        }

    }, [navigate]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="account-loading">

                <div className="account-loading-card">

                    <div className="account-spinner">
                    </div>

                    <h3>
                        Loading account details
                    </h3>

                    <p>
                        Please wait while we load your
                        BankEase account information.
                    </p>

                </div>

            </div>

        );

    }


    if (!user) {

        return null;

    }


    // =====================================================
    // FORMAT BALANCE
    // =====================================================

    const formatBalance = (amount) => {

        return Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    // =====================================================
    // ACCOUNT PAGE
    // =====================================================

    return (

        <div className="account-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="account-page-header">


                <div className="account-header-left">

                    <button
                        className="account-back-btn"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                    >
                        ← Back to Dashboard
                    </button>


                    <span className="account-header-label">
                        ACCOUNT MANAGEMENT
                    </span>


                    <h1>
                        Your BankEase Account
                    </h1>


                    <p>
                        View your account details,
                        balance and personal information.
                    </p>

                </div>


                <button
                    className="account-profile-button"
                    onClick={() =>
                        navigate(
                            "/profile"
                        )
                    }
                    title="My Profile"
                >

                    {user.name
                        ?.charAt(0)
                        .toUpperCase()}

                </button>

            </header>


            {/* =================================================
                ACCOUNT OVERVIEW
            ================================================= */}

            <section className="account-overview-card">


                <div className="account-overview-left">


                    <div className="account-bank-icon">

                        <div className="account-roof">
                        </div>

                        <div className="account-building">

                            <span></span>
                            <span></span>
                            <span></span>

                        </div>

                    </div>


                    <div className="account-overview-content">

                        <span className="account-label">
                            BANKEASE ACCOUNT
                        </span>

                        <h2>
                            {user.name}
                        </h2>

                        <p>
                            {user.email}
                        </p>

                    </div>

                </div>


                <div className="account-status-badge">

                    <span className="status-dot">
                    </span>

                    Active

                </div>

            </section>


            {/* =================================================
                TOP DETAILS GRID
            ================================================= */}

            <section className="account-details-grid">


                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================= */}

                <div className="account-card">


                    <div className="account-card-header">

                        <div className="card-header-icon">
                            🏦
                        </div>

                        <div>

                            <span className="account-card-label">
                                ACCOUNT
                            </span>

                            <h3>
                                Account Information
                            </h3>

                            <p>
                                Your banking account details
                            </p>

                        </div>

                    </div>


                    <div className="account-info-list">


                        <div className="account-info-row">

                            <span>
                                Account Number
                            </span>

                            <strong>
                                {user.accountNumber ||
                                    "Not available"}
                            </strong>

                        </div>


                        <div className="account-info-row">

                            <span>
                                Account Type
                            </span>

                            <strong>
                                Savings Account
                            </strong>

                        </div>


                        <div className="account-info-row">

                            <span>
                                IFSC Code
                            </span>

                            <strong>
                                BKES0001234
                            </strong>

                        </div>


                        <div className="account-info-row">

                            <span>
                                Account Status
                            </span>

                            <strong className="active-text">

                                <span className="mini-status-dot">
                                </span>

                                Active

                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    BALANCE
                ================================================= */}

                <div className="account-card account-balance-card">


                    <div className="account-card-header">

                        <div className="card-header-icon balance-icon">
                            ₹
                        </div>

                        <div>

                            <span className="account-card-label">
                                BALANCE
                            </span>

                            <h3>
                                Account Balance
                            </h3>

                            <p>
                                Current available balance
                            </p>

                        </div>

                    </div>


                    <div className="balance-content">

                        <span>
                            AVAILABLE BALANCE
                        </span>

                        <h2>
                            ₹
                            {formatBalance(
                                user.balance
                            )}
                        </h2>

                    </div>


                    <button
                        className="balance-action"
                        onClick={() =>
                            navigate(
                                "/deposit"
                            )
                        }
                    >

                        <span>
                            +
                        </span>

                        Add Money

                        <span className="button-arrow">
                            →
                        </span>

                    </button>

                </div>

            </section>


            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <section className="account-card personal-card">


                <div className="account-card-header">

                    <div className="card-header-icon">
                        👤
                    </div>

                    <div>

                        <span className="account-card-label">
                            PROFILE
                        </span>

                        <h3>
                            Personal Information
                        </h3>

                        <p>
                            Information associated with
                            your BankEase account
                        </p>

                    </div>

                </div>


                <div className="personal-grid">


                    <div className="personal-item">

                        <span>
                            Full Name
                        </span>

                        <strong>
                            {user.name}
                        </strong>

                    </div>


                    <div className="personal-item">

                        <span>
                            Email Address
                        </span>

                        <strong>
                            {user.email}
                        </strong>

                    </div>


                    <div className="personal-item">

                        <span>
                            Mobile Number
                        </span>

                        <strong>
                            {user.phone ||
                                "Not available"}
                        </strong>

                    </div>


                    <div className="personal-item">

                        <span>
                            Account Role
                        </span>

                        <strong>
                            Customer
                        </strong>

                    </div>

                </div>


                <button
                    className="profile-action"
                    onClick={() =>
                        navigate(
                            "/profile"
                        )
                    }
                >

                    <span>
                        View My Profile
                    </span>

                    <span>
                        →
                    </span>

                </button>

            </section>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="account-card quick-actions-card">


                <div className="account-card-header">

                    <div className="card-header-icon">
                        ⚡
                    </div>

                    <div>

                        <span className="account-card-label">
                            SHORTCUTS
                        </span>

                        <h3>
                            Quick Actions
                        </h3>

                        <p>
                            Manage your banking activities
                        </p>

                    </div>

                </div>


                <div className="account-quick-actions">


                    {/* DEPOSIT */}

                    <button
                        onClick={() =>
                            navigate(
                                "/deposit"
                            )
                        }
                    >

                        <span className="quick-action-icon">
                            +
                        </span>

                        <span className="quick-action-text">

                            <strong>
                                Deposit Money
                            </strong>

                            <small>
                                Add funds to your account
                            </small>

                        </span>

                        <span className="quick-action-arrow">
                            →
                        </span>

                    </button>


                    {/* WITHDRAW */}

                    <button
                        onClick={() =>
                            navigate(
                                "/withdraw"
                            )
                        }
                    >

                        <span className="quick-action-icon">
                            −
                        </span>

                        <span className="quick-action-text">

                            <strong>
                                Withdraw Money
                            </strong>

                            <small>
                                Withdraw available funds
                            </small>

                        </span>

                        <span className="quick-action-arrow">
                            →
                        </span>

                    </button>


                    {/* TRANSACTIONS */}

                    <button
                        onClick={() =>
                            navigate(
                                "/transactions"
                            )
                        }
                    >

                        <span className="quick-action-icon">
                            ↔
                        </span>

                        <span className="quick-action-text">

                            <strong>
                                Transaction History
                            </strong>

                            <small>
                                View your recent activity
                            </small>

                        </span>

                        <span className="quick-action-arrow">
                            →
                        </span>

                    </button>


                    {/* PROFILE */}

                    <button
                        onClick={() =>
                            navigate(
                                "/profile"
                            )
                        }
                    >

                        <span className="quick-action-icon">
                            ◉
                        </span>

                        <span className="quick-action-text">

                            <strong>
                                Edit Profile
                            </strong>

                            <small>
                                Manage your personal details
                            </small>

                        </span>

                        <span className="quick-action-arrow">
                            →
                        </span>

                    </button>

                </div>

            </section>


        </div>

    );

}


export default AccountManagement;