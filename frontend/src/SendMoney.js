import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SendMoney.css";


function SendMoney() {

    const navigate = useNavigate();


    // =====================================================
    // USER
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

    const [receiverAccountNumber, setReceiverAccountNumber] =
        useState("");

    const [amount, setAmount] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [success, setSuccess] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [transaction, setTransaction] =
        useState(null);

    const [completedReceiver, setCompletedReceiver] =
        useState("");


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
    // TRANSFER
    // =====================================================

    const handleTransfer = async (e) => {

        e.preventDefault();

        setMessage("");
        setSuccess(false);
        setTransaction(null);
        setCompletedReceiver("");


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
        // RECEIVER ACCOUNT VALIDATION
        // -----------------------------------------------

        if (
            !receiverAccountNumber.trim()
        ) {

            setMessage(
                "Please enter the receiver account number."
            );

            return;

        }


        // -----------------------------------------------
        // AMOUNT VALIDATION
        // -----------------------------------------------

        if (!amount) {

            setMessage(
                "Please enter the transfer amount."
            );

            return;

        }


        if (
            Number(amount) <= 0
        ) {

            setMessage(
                "Transfer amount must be greater than 0."
            );

            return;

        }


        // -----------------------------------------------
        // BALANCE VALIDATION
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
        // TOKEN
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

            const cleanReceiver =
                receiverAccountNumber.trim();


            const response =
                await fetch(
                    "http://localhost:5000/api/transactions/transfer",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            receiverAccountNumber:
                                cleanReceiver,

                            amount:
                                Number(amount)

                        })
                    }
                );


            const data =
                await response.json();


            // -------------------------------------------
            // UNAUTHORIZED
            // -------------------------------------------

            if (
                response.status === 401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate("/");

                return;

            }


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
                    "Money transferred successfully!"
                );


                setTransaction(
                    data.transaction
                );


                setCompletedReceiver(
                    cleanReceiver
                );


                setReceiverAccountNumber("");

                setAmount("");


            } else {

                setMessage(
                    data.message ||
                    "Transfer failed."
                );

            }


        } catch (error) {

            console.error(
                "Transfer Error:",
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

            <div className="send-money-page">

                <div className="send-money-card login-required-card">

                    <div className="send-money-icon">
                        🔐
                    </div>


                    <span className="send-money-label">
                        SECURE BANKING
                    </span>


                    <h1>
                        Please login first
                    </h1>


                    <p>
                        Sign in to your BankEase account
                        to send money securely.
                    </p>


                    <button
                        className="send-primary-button"
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
    // SEND MONEY PAGE
    // =====================================================

    return (

        <div className="send-money-page">


            <div className="send-money-card">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="send-money-page-header">

                    <div>

                        <button
                            className="send-back-link"
                            onClick={() =>
                                navigate(
                                    "/dashboard"
                                )
                            }
                        >
                            ← Back to Dashboard
                        </button>


                        <span className="send-money-label">
                            MONEY TRANSFER
                        </span>


                        <h1>
                            Send Money
                        </h1>


                        <p>
                            Transfer money securely to
                            another BankEase account.
                        </p>

                    </div>


                    <div className="send-money-header-icon">
                        ↗
                    </div>

                </div>


                {/* =================================================
                    AVAILABLE BALANCE
                ================================================= */}

                <div className="send-balance-card">


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


                    <div className="send-balance-icon">
                        ₹
                    </div>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleTransfer}
                    className="send-money-form"
                >


                    {/* RECEIVER ACCOUNT */}

                    <div className="send-input-group">

                        <label htmlFor="receiver-account">
                            Receiver Account Number
                        </label>


                        <div className="send-input-wrapper">

                            <span className="send-input-icon">
                                #
                            </span>


                            <input
                                id="receiver-account"
                                type="text"
                                placeholder="Enter receiver account number"
                                value={receiverAccountNumber}
                                onChange={(e) =>
                                    setReceiverAccountNumber(
                                        e.target.value
                                    )
                                }
                                autoComplete="off"
                                required
                            />

                        </div>


                        <small>
                            Enter the BankEase account number
                            of the person receiving the money.
                        </small>

                    </div>


                    {/* AMOUNT */}

                    <div className="send-input-group">

                        <label htmlFor="transfer-amount">
                            Transfer Amount
                        </label>


                        <div className="send-amount-wrapper">

                            <span>
                                ₹
                            </span>


                            <input
                                id="transfer-amount"
                                type="number"
                                placeholder="Enter transfer amount"
                                min="1"
                                max={
                                    user.balance ||
                                    undefined
                                }
                                step="0.01"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <small>
                            Transfer amount cannot exceed
                            your available balance.
                        </small>

                    </div>


                    {/* QUICK AMOUNTS */}

                    <div className="send-quick-section">

                        <span>
                            QUICK AMOUNT
                        </span>


                        <div className="send-quick-buttons">


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


                    {/* SEND BUTTON */}

                    <button
                        type="submit"
                        className="send-primary-button"
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                <span className="send-spinner">
                                </span>

                                Processing...

                            </>

                        ) : (

                            <>
                                Send Money

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
                                ? "send-message success"
                                : "send-message error"
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
                    TRANSACTION DETAILS
                ================================================= */}

                {transaction && (

                    <div className="send-transaction-card">


                        <div className="send-transaction-heading">

                            <div className="send-transaction-icon">
                                ✓
                            </div>

                            <div>

                                <span>
                                    TRANSFER COMPLETED
                                </span>

                                <h2>
                                    Transaction Details
                                </h2>

                            </div>

                        </div>


                        <div className="send-transaction-list">


                            <div>

                                <span>
                                    Transaction ID
                                </span>

                                <strong>
                                    {
                                        transaction.transactionId ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Receiver Account Number
                                </span>

                                <strong>
                                    {
                                        completedReceiver ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Amount
                                </span>

                                <strong className="transfer-amount">
                                    ₹
                                    {formatMoney(
                                        transaction.amount
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Status
                                </span>

                                <strong className="transfer-status">
                                    {transaction.status ||
                                        "Success"}
                                </strong>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    BOTTOM ACTIONS
                ================================================= */}

                <div className="send-bottom-actions">

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

                <div className="send-security-note">

                    <span>
                        🔐
                    </span>

                    <p>
                        Transfers are processed through the
                        secure BankEase banking system.
                    </p>

                </div>

            </div>

        </div>

    );

}


export default SendMoney;