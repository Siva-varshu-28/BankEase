import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Deposit.css";


function Deposit() {

    const navigate = useNavigate();


    // =====================================================
    // GET USER
    // =====================================================

    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;

    });


    // =====================================================
    // STATES
    // =====================================================

    const [amount, setAmount] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [success, setSuccess] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (value) => {

        return Number(
            value || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    // =====================================================
    // DEPOSIT
    // =====================================================

    const handleDeposit = async (e) => {

        e.preventDefault();

        setMessage("");
        setSuccess(false);


        // -----------------------------------------------
        // LOGIN CHECK
        // -----------------------------------------------

        if (!user) {

            setMessage(
                "Please login first."
            );

            return;

        }


        // -----------------------------------------------
        // AMOUNT CHECK
        // -----------------------------------------------

        if (
            !amount ||
            Number(amount) <= 0
        ) {

            setMessage(
                "Please enter a valid deposit amount."
            );

            return;

        }


        // -----------------------------------------------
        // TOKEN CHECK
        // -----------------------------------------------

        const token =
            localStorage.getItem("token");


        if (!token) {

            setMessage(
                "Session expired. Please login again."
            );

            return;

        }


        setLoading(true);


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/transactions/deposit",
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify({

                                amount:
                                    Number(amount)

                            })

                    }
                );


            const data =
                await response.json();


            // -------------------------------------------
            // SUCCESS
            // -------------------------------------------

            if (response.ok) {

                const updatedUser = {

                    ...user,

                    balance:
                        data.balance

                };


                setUser(
                    updatedUser
                );


                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        updatedUser
                    )
                );


                setSuccess(true);


                setMessage(
                    `Deposit successful! Transaction ID: ${data.transaction.transactionId}`
                );


                setAmount("");


            } else {

                // ---------------------------------------
                // SESSION EXPIRED
                // ---------------------------------------

                if (
                    response.status === 401
                ) {

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );


                    setMessage(
                        "Session expired. Please login again."
                    );


                    setTimeout(() => {

                        navigate("/");

                    }, 1000);


                } else {

                    setMessage(
                        data.message ||
                        "Deposit failed."
                    );

                }

            }


        } catch (error) {

            console.error(
                "Deposit Error:",
                error
            );


            setMessage(
                "Unable to connect to server."
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOGIN REQUIRED
    // =====================================================

    if (!user) {

        return (

            <div className="deposit-page">

                <div className="deposit-card login-required-card">

                    <div className="deposit-icon">
                        🔐
                    </div>


                    <span className="deposit-label">
                        SECURE BANKING
                    </span>


                    <h1>
                        Please login first
                    </h1>


                    <p>
                        Sign in to your BankEase account
                        to deposit money.
                    </p>


                    <button
                        className="deposit-primary-button"
                        onClick={() =>
                            navigate("/")
                        }
                    >

                        Go to Login

                        <span>
                            →
                        </span>

                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // DEPOSIT PAGE
    // =====================================================

    return (

        <div className="deposit-page">


            {/* =================================================
                MAIN CARD
            ================================================= */}

            <div className="deposit-card">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="deposit-page-header">

                    <div>

                        <button
                            className="deposit-back-link"
                            onClick={() =>
                                navigate(
                                    "/dashboard"
                                )
                            }
                        >
                            ← Back to Dashboard
                        </button>


                        <span className="deposit-label">
                            MONEY MANAGEMENT
                        </span>


                        <h1>
                            Deposit Money
                        </h1>


                        <p>
                            Add money securely to your
                            BankEase account.
                        </p>

                    </div>


                    <div className="deposit-header-icon">
                        +
                    </div>

                </div>


                {/* =================================================
                    BALANCE CARD
                ================================================= */}

                <div className="deposit-balance-card">


                    <div>

                        <span>
                            CURRENT BALANCE
                        </span>

                        <h2>
                            ₹
                            {formatMoney(
                                user.balance
                            )}
                        </h2>

                    </div>


                    <div className="deposit-balance-icon">
                        ₹
                    </div>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleDeposit}
                    className="deposit-form"
                >


                    <div className="deposit-input-group">

                        <label htmlFor="deposit-amount">
                            Deposit Amount
                        </label>


                        <div className="deposit-input-wrapper">

                            <span className="deposit-currency">
                                ₹
                            </span>


                            <input
                                id="deposit-amount"
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(
                                        e.target.value
                                    )
                                }
                                min="1"
                                step="0.01"
                                required
                            />

                        </div>


                        <small>
                            Enter the amount you want
                            to add to your account.
                        </small>

                    </div>


                    {/* QUICK AMOUNTS */}

                    <div className="deposit-quick-section">

                        <span>
                            QUICK AMOUNT
                        </span>


                        <div className="deposit-quick-buttons">


                            <button
                                type="button"
                                onClick={() =>
                                    setAmount("1000")
                                }
                            >
                                ₹1,000
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setAmount("5000")
                                }
                            >
                                ₹5,000
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setAmount("10000")
                                }
                            >
                                ₹10,000
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setAmount("25000")
                                }
                            >
                                ₹25,000
                            </button>

                        </div>

                    </div>


                    {/* CONFIRM */}

                    <button
                        type="submit"
                        className="deposit-primary-button"
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                <span className="deposit-spinner">
                                </span>

                                Processing...

                            </>

                        ) : (

                            <>
                                Confirm Deposit

                                <span>
                                    →
                                </span>
                            </>

                        )}

                    </button>

                </form>


                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (

                    <div
                        className={
                            success
                                ? "deposit-message success"
                                : "deposit-message error"
                        }
                    >

                        <span>
                            {success
                                ? "✓"
                                : "!"}
                        </span>


                        <p>
                            {message}
                        </p>

                    </div>

                )}


                {/* =================================================
                    BOTTOM ACTIONS
                ================================================= */}

                <div className="deposit-bottom-actions">


                    <button
                        onClick={() =>
                            navigate(
                                "/transactions"
                            )
                        }
                    >
                        View Transactions
                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/account"
                            )
                        }
                    >
                        Account Details
                    </button>

                </div>


                {/* =================================================
                    SECURITY NOTE
                ================================================= */}

                <div className="deposit-security-note">

                    <span>
                        🔐
                    </span>

                    <p>
                        Your deposit is processed through
                        the secure BankEase banking system.
                    </p>

                </div>


            </div>

        </div>

    );

}


export default Deposit;