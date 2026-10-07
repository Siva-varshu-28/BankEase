import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Withdraw.css";


function Withdraw() {

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
    // WITHDRAW
    // =====================================================

    const handleWithdraw = async (e) => {

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
        // AMOUNT VALIDATION
        // -----------------------------------------------

        if (
            !amount ||
            Number(amount) <= 0
        ) {

            setMessage(
                "Please enter a valid withdrawal amount."
            );

            return;

        }


        // -----------------------------------------------
        // BALANCE CHECK
        // -----------------------------------------------

        if (
            Number(amount) >
            Number(user.balance || 0)
        ) {

            setMessage(
                "Insufficient balance."
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
                    "http://localhost:5000/api/transactions/withdraw",
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
                    `Withdrawal successful! Transaction ID: ${data.transaction.transactionId}`
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
                        "Withdrawal failed."
                    );

                }

            }


        } catch (error) {

            console.error(
                "Withdrawal Error:",
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

            <div className="withdraw-page">

                <div className="withdraw-card login-required-card">

                    <div className="withdraw-icon">
                        🔐
                    </div>


                    <span className="withdraw-label">
                        SECURE BANKING
                    </span>


                    <h1>
                        Please login first
                    </h1>


                    <p>
                        Sign in to your BankEase account
                        to withdraw money.
                    </p>


                    <button
                        className="withdraw-primary-button"
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
    // WITHDRAW PAGE
    // =====================================================

    return (

        <div className="withdraw-page">


            <div className="withdraw-card">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="withdraw-page-header">

                    <div>

                        <button
                            className="withdraw-back-link"
                            onClick={() =>
                                navigate(
                                    "/dashboard"
                                )
                            }
                        >
                            ← Back to Dashboard
                        </button>


                        <span className="withdraw-label">
                            MONEY MANAGEMENT
                        </span>


                        <h1>
                            Withdraw Money
                        </h1>


                        <p>
                            Withdraw funds securely from
                            your BankEase account.
                        </p>

                    </div>


                    <div className="withdraw-header-icon">
                        −
                    </div>

                </div>


                {/* =================================================
                    BALANCE
                ================================================= */}

                <div className="withdraw-balance-card">


                    <div>

                        <span>
                            AVAILABLE BALANCE
                        </span>

                        <h2>
                            ₹
                            {formatMoney(
                                user.balance
                            )}
                        </h2>

                    </div>


                    <div className="withdraw-balance-icon">
                        ₹
                    </div>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleWithdraw}
                    className="withdraw-form"
                >


                    <div className="withdraw-input-group">

                        <label htmlFor="withdraw-amount">
                            Withdrawal Amount
                        </label>


                        <div className="withdraw-input-wrapper">

                            <span className="withdraw-currency">
                                ₹
                            </span>


                            <input
                                id="withdraw-amount"
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(
                                        e.target.value
                                    )
                                }
                                min="1"
                                max={
                                    user.balance ||
                                    undefined
                                }
                                step="0.01"
                                required
                            />

                        </div>


                        <small>
                            Amount cannot exceed your
                            available balance.
                        </small>

                    </div>


                    {/* QUICK AMOUNTS */}

                    <div className="withdraw-quick-section">

                        <span>
                            QUICK AMOUNT
                        </span>


                        <div className="withdraw-quick-buttons">

                            <button
                                type="button"
                                onClick={() =>
                                    setAmount("1000")
                                }
                                disabled={
                                    Number(
                                        user.balance || 0
                                    ) < 1000
                                }
                            >
                                ₹1,000
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setAmount("5000")
                                }
                                disabled={
                                    Number(
                                        user.balance || 0
                                    ) < 5000
                                }
                            >
                                ₹5,000
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setAmount("10000")
                                }
                                disabled={
                                    Number(
                                        user.balance || 0
                                    ) < 10000
                                }
                            >
                                ₹10,000
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setAmount("25000")
                                }
                                disabled={
                                    Number(
                                        user.balance || 0
                                    ) < 25000
                                }
                            >
                                ₹25,000
                            </button>

                        </div>

                    </div>


                    {/* CONFIRM */}

                    <button
                        type="submit"
                        className="withdraw-primary-button"
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                <span className="withdraw-spinner">
                                </span>

                                Processing...

                            </>

                        ) : (

                            <>
                                Confirm Withdrawal

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
                                ? "withdraw-message success"
                                : "withdraw-message error"
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

                <div className="withdraw-bottom-actions">


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

                <div className="withdraw-security-note">

                    <span>
                        🔐
                    </span>

                    <p>
                        Withdrawals are processed through
                        the secure BankEase banking system.
                    </p>

                </div>


            </div>

        </div>

    );

}


export default Withdraw;