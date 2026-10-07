import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BillPayment.css";

function BillPayment() {

    const navigate = useNavigate();

    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;

    });

    const [billType, setBillType] =
        useState("Electricity");

    const [consumerNumber, setConsumerNumber] =
        useState("");

    const [amount, setAmount] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [messageType, setMessageType] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [completedPayment, setCompletedPayment] =
        useState(null);


    // =========================================
    // FORMAT CURRENCY
    // =========================================

    const formatCurrency = (value) => {

        return Number(value || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    // =========================================
    // QUICK AMOUNT
    // =========================================

    const handleQuickAmount = (value) => {

        setAmount(String(value));
        setMessage("");
        setMessageType("");

    };


    // =========================================
    // BILL PAYMENT
    // =========================================

    const handlePayment = async (e) => {

        e.preventDefault();

        setMessage("");
        setMessageType("");
        setCompletedPayment(null);


        // Login check

        if (!user) {

            setMessage(
                "Please login first"
            );

            setMessageType("error");

            return;
        }


        // Consumer number check

        if (!consumerNumber.trim()) {

            setMessage(
                "Please enter consumer / account number"
            );

            setMessageType("error");

            return;
        }


        // Amount check

        if (
            !amount ||
            Number(amount) <= 0
        ) {

            setMessage(
                "Please enter a valid bill amount"
            );

            setMessageType("error");

            return;
        }


        // Balance check

        if (
            Number(amount) >
            Number(user.balance || 0)
        ) {

            setMessage(
                "Insufficient balance for this payment"
            );

            setMessageType("error");

            return;
        }


        // Get JWT token

        const token =
            localStorage.getItem("token");


        if (!token) {

            setMessage(
                "Session expired. Please login again."
            );

            setMessageType("error");

            localStorage.removeItem("user");
            localStorage.removeItem("token");

            navigate("/");

            return;
        }


        setLoading(true);


        try {

            const response = await fetch(
                "http://localhost:5000/api/transactions/bill-payment",
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        billType:
                            billType,

                        consumerNumber:
                            consumerNumber.trim(),

                        amount:
                            Number(amount)

                    })
                }
            );


            const data =
                await response.json();


            // =====================================
            // UNAUTHORIZED
            // =====================================

            if (response.status === 401) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate("/");

                return;
            }


            // =====================================
            // SUCCESS
            // =====================================

            if (response.ok) {

                const updatedUser = {

                    ...user,

                    balance:
                        data.balance

                };


                setUser(updatedUser);


                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        updatedUser
                    )
                );


                const transactionId =
                    data?.transaction?.transactionId ||
                    "N/A";


                setCompletedPayment({

                    billType:
                        billType,

                    consumerNumber:
                        consumerNumber.trim(),

                    amount:
                        Number(amount),

                    transactionId:
                        transactionId,

                    balance:
                        data.balance

                });


                setMessage(
                    "Bill payment completed successfully."
                );

                setMessageType("success");


                // Clear form

                setConsumerNumber("");

                setAmount("");


            } else {

                setMessage(
                    data.message ||
                    "Bill payment failed"
                );

                setMessageType("error");

            }


        } catch (error) {

            console.error(
                "Bill Payment Error:",
                error
            );


            setMessage(
                "Unable to connect to server. Please try again."
            );

            setMessageType("error");

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // LOGIN CHECK
    // =========================================

    if (!user) {

        return (

            <div className="bill-page">

                <div className="bill-card">

                    <div className="bill-brand">

                        <div className="bill-brand-mark">
                            B
                        </div>

                        <div>

                            <div className="bill-brand-name">
                                BankEase
                            </div>

                            <div className="bill-brand-subtitle">
                                Smart Banking
                            </div>

                        </div>

                    </div>


                    <div className="bill-login-state">

                        <div className="bill-state-icon">
                            🔐
                        </div>

                        <h1>
                            Bill Payments
                        </h1>

                        <p>
                            Please login to continue
                            with your bill payment.
                        </p>

                        <button
                            className="bill-primary-button"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Go to Login
                        </button>

                    </div>

                </div>

            </div>

        );
    }


    return (

        <div className="bill-page">

            <div className="bill-wrapper">


                {/* =====================================
                    TOP NAVIGATION
                ===================================== */}

                <div className="bill-topbar">

                    <button
                        className="bill-back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>


                    <div className="bill-page-label">
                        MONEY MANAGEMENT
                    </div>

                </div>


                {/* =====================================
                    PAGE HEADER
                ===================================== */}

                <div className="bill-page-header">

                    <div>

                        <p className="bill-eyebrow">
                            PAYMENTS
                        </p>

                        <h1>
                            Bill Payments
                        </h1>

                        <p>
                            Pay your utility bills securely
                            with BankEase.
                        </p>

                    </div>


                    <div className="bill-header-badge">

                        <span>
                            ●
                        </span>

                        Secure Payment

                    </div>

                </div>


                {/* =====================================
                    MAIN GRID
                ===================================== */}

                <div className="bill-main-grid">


                    {/* =================================
                        PAYMENT CARD
                    ================================= */}

                    <div className="bill-payment-card">

                        <div className="bill-card-heading">

                            <div>

                                <h2>
                                    Pay a Bill
                                </h2>

                                <p>
                                    Enter your bill details
                                    below.
                                </p>

                            </div>

                            <div className="bill-card-icon">
                                ₹
                            </div>

                        </div>


                        {/* BILL TYPE */}

                        <div className="bill-field">

                            <label>
                                Bill Type
                            </label>

                            <div className="bill-select-wrapper">

                                <select
                                    value={billType}
                                    onChange={(e) => {

                                        setBillType(
                                            e.target.value
                                        );

                                        setMessage("");
                                        setMessageType("");

                                    }}
                                >

                                    <option value="Electricity">
                                        ⚡ Electricity
                                    </option>

                                    <option value="Water">
                                        💧 Water
                                    </option>

                                    <option value="Mobile">
                                        📱 Mobile
                                    </option>

                                    <option value="Internet">
                                        🌐 Internet
                                    </option>

                                    <option value="DTH">
                                        📺 DTH
                                    </option>

                                    <option value="Credit Card">
                                        💳 Credit Card
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* CONSUMER NUMBER */}

                        <div className="bill-field">

                            <label>
                                Consumer / Account Number
                            </label>

                            <input
                                type="text"
                                placeholder="Enter consumer number"
                                value={consumerNumber}
                                onChange={(e) => {

                                    setConsumerNumber(
                                        e.target.value
                                    );

                                    setMessage("");
                                    setMessageType("");

                                }}
                            />

                            <span className="bill-field-hint">
                                Enter the number registered
                                with your bill provider.
                            </span>

                        </div>


                        {/* AMOUNT */}

                        <div className="bill-field">

                            <label>
                                Bill Amount
                            </label>

                            <div className="bill-amount-input">

                                <span className="bill-currency">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => {

                                        setAmount(
                                            e.target.value
                                        );

                                        setMessage("");
                                        setMessageType("");

                                    }}
                                    min="1"
                                    step="0.01"
                                />

                            </div>

                        </div>


                        {/* QUICK AMOUNTS */}

                        <div className="bill-quick-section">

                            <span>
                                Quick Amount
                            </span>

                            <div className="bill-quick-buttons">

                                {[500, 1000, 2500, 5000].map(
                                    (value) => (

                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() =>
                                                handleQuickAmount(
                                                    value
                                                )
                                            }
                                        >
                                            ₹
                                            {value.toLocaleString(
                                                "en-IN"
                                            )}
                                        </button>

                                    )
                                )}

                            </div>

                        </div>


                        {/* PAYMENT BUTTON */}

                        <button
                            className="bill-primary-button bill-pay-button"
                            onClick={handlePayment}
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="bill-spinner"></span>
                                    Processing Payment...
                                </>

                            ) : (

                                <>
                                    Pay Bill
                                    <span>→</span>
                                </>

                            )}

                        </button>


                        {/* MESSAGE */}

                        {message && (

                            <div
                                className={`bill-message ${messageType}`}
                            >

                                <span>

                                    {messageType === "success"
                                        ? "✓"
                                        : "!"}

                                </span>

                                <p>
                                    {message}
                                </p>

                            </div>

                        )}

                    </div>


                    {/* =================================
                        SIDE PANEL
                    ================================= */}

                    <div className="bill-side-panel">


                        {/* BALANCE */}

                        <div className="bill-balance-card">

                            <div className="bill-balance-top">

                                <span>
                                    Available Balance
                                </span>

                                <div className="bill-balance-icon">
                                    ₹
                                </div>

                            </div>

                            <strong>
                                ₹
                                {formatCurrency(
                                    user.balance
                                )}
                            </strong>

                            <p>
                                Available for bill payments
                            </p>

                        </div>


                        {/* PAYMENT SUMMARY */}

                        {completedPayment ? (

                            <div className="bill-success-card">

                                <div className="bill-success-icon">
                                    ✓
                                </div>

                                <h3>
                                    Payment Successful
                                </h3>

                                <p>
                                    Your bill payment has
                                    been completed.
                                </p>


                                <div className="bill-success-details">

                                    <div>

                                        <span>
                                            Bill Type
                                        </span>

                                        <strong>
                                            {
                                                completedPayment.billType
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Amount
                                        </span>

                                        <strong>
                                            ₹
                                            {formatCurrency(
                                                completedPayment.amount
                                            )}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Transaction ID
                                        </span>

                                        <strong className="bill-transaction-id">
                                            {
                                                completedPayment.transactionId
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        ) : (

                            <div className="bill-info-card">

                                <h3>
                                    Payment Information
                                </h3>

                                <div className="bill-info-item">

                                    <span>
                                        ⚡
                                    </span>

                                    <div>

                                        <strong>
                                            Multiple bill types
                                        </strong>

                                        <p>
                                            Electricity, water,
                                            mobile and more.
                                        </p>

                                    </div>

                                </div>


                                <div className="bill-info-item">

                                    <span>
                                        🔒
                                    </span>

                                    <div>

                                        <strong>
                                            Secure transactions
                                        </strong>

                                        <p>
                                            Your payment is
                                            protected.
                                        </p>

                                    </div>

                                </div>


                                <div className="bill-info-item">

                                    <span>
                                        ✓
                                    </span>

                                    <div>

                                        <strong>
                                            Instant confirmation
                                        </strong>

                                        <p>
                                            Transaction details
                                            appear immediately.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* SHORTCUTS */}

                        <div className="bill-shortcuts-card">

                            <h3>
                                Quick Access
                            </h3>

                            <button
                                onClick={() =>
                                    navigate("/transactions")
                                }
                            >
                                <span>
                                    ↗
                                </span>

                                View Transactions

                                <b>
                                    →
                                </b>

                            </button>


                            <button
                                onClick={() =>
                                    navigate("/account")
                                }
                            >
                                <span>
                                    ◉
                                </span>

                                Account Details

                                <b>
                                    →
                                </b>

                            </button>


                            <button
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                            >
                                <span>
                                    ⌂
                                </span>

                                Back to Dashboard

                                <b>
                                    →
                                </b>

                            </button>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    SECURITY NOTE
                ===================================== */}

                <div className="bill-security-note">

                    <div className="bill-security-icon">
                        🔒
                    </div>

                    <div>

                        <strong>
                            Your payment is secure
                        </strong>

                        <p>
                            BankEase protects your transaction
                            using authenticated and encrypted
                            communication.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default BillPayment;