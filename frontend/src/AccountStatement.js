import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "./AccountStatement.css";


function AccountStatement() {

    const navigate = useNavigate();


    // =========================================
    // GET LOGGED-IN USER
    // =========================================

    const [user] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;

    });


    const userId =
        user?.id;


    // =========================================
    // STATES
    // =========================================

    const [account, setAccount] =
        useState(null);

    const [transactions, setTransactions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");


    // =========================================
    // FILTER STATES
    // =========================================

    const [search, setSearch] =
        useState("");

    const [typeFilter, setTypeFilter] =
        useState("all");

    const [dateFilter, setDateFilter] =
        useState("all");


    // =========================================
    // SESSION EXPIRED
    // =========================================

    const handleSessionExpired =
        useCallback(() => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            navigate("/");

        }, [navigate]);


    // =========================================
    // FETCH ACCOUNT STATEMENT
    // =========================================

    useEffect(() => {

        const fetchStatement = async () => {

            if (!userId) {

                setLoading(false);

                return;

            }


            const token =
                localStorage.getItem("token");


            if (!token) {

                handleSessionExpired();

                return;

            }


            try {

                setLoading(true);

                setMessage("");


                const response =
                    await fetch(
                        "http://localhost:5000/api/transactions/statement",
                        {
                            method: "GET",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                const data =
                    await response.json();


                // =====================================
                // SESSION EXPIRED
                // =====================================

                if (
                    response.status === 401
                ) {

                    handleSessionExpired();

                    return;

                }


                // =====================================
                // SUCCESS
                // =====================================

                if (response.ok) {

                    setAccount(
                        data.account
                    );

                    setTransactions(
                        data.transactions || []
                    );

                } else {

                    setMessage(
                        data.message ||
                        "Unable to load account statement"
                    );

                }

            } catch (error) {

                console.error(
                    "Statement Error:",
                    error
                );

                setMessage(
                    "Unable to connect to server"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchStatement();

    }, [
        userId,
        handleSessionExpired
    ]);


    // =========================================
    // FORMAT MONEY
    // =========================================

    const formatMoney = (amount) => {

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


    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {

        if (!date) {

            return "Date unavailable";

        }


        return new Date(
            date
        ).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // =========================================
    // FORMAT TRANSACTION TYPE
    // =========================================

    const formatType = (type) => {

        switch (type) {

            case "deposit":
                return "Deposit";

            case "withdraw":
                return "Withdrawal";

            case "transfer":
                return "Transfer";

            case "bill":
                return "Bill Payment";

            default:
                return type || "Transaction";

        }

    };


    // =========================================
    // CHECK DEBIT
    // =========================================

    const isDebit = (type) => {

        return (
            type === "withdraw" ||
            type === "transfer" ||
            type === "bill"
        );

    };


    // =========================================
    // DATE FILTER
    // =========================================

    const matchesDateFilter =
        useCallback(
            (transactionDate) => {

                if (dateFilter === "all") {

                    return true;

                }


                if (!transactionDate) {

                    return false;

                }


                const transaction =
                    new Date(
                        transactionDate
                    );


                const today =
                    new Date();


                today.setHours(
                    23,
                    59,
                    59,
                    999
                );


                // =================================
                // TODAY
                // =================================

                if (
                    dateFilter ===
                    "today"
                ) {

                    return (
                        transaction.toDateString() ===
                        today.toDateString()
                    );

                }


                // =================================
                // LAST 7 DAYS
                // =================================

                if (
                    dateFilter ===
                    "7days"
                ) {

                    const startDate =
                        new Date();


                    startDate.setDate(
                        startDate.getDate() - 7
                    );


                    startDate.setHours(
                        0,
                        0,
                        0,
                        0
                    );


                    return (
                        transaction >=
                        startDate
                    );

                }


                // =================================
                // LAST 30 DAYS
                // =================================

                if (
                    dateFilter ===
                    "30days"
                ) {

                    const startDate =
                        new Date();


                    startDate.setDate(
                        startDate.getDate() - 30
                    );


                    startDate.setHours(
                        0,
                        0,
                        0,
                        0
                    );


                    return (
                        transaction >=
                        startDate
                    );

                }


                // =================================
                // LAST 90 DAYS
                // =================================

                if (
                    dateFilter ===
                    "90days"
                ) {

                    const startDate =
                        new Date();


                    startDate.setDate(
                        startDate.getDate() - 90
                    );


                    startDate.setHours(
                        0,
                        0,
                        0,
                        0
                    );


                    return (
                        transaction >=
                        startDate
                    );

                }


                return true;

            },
            [dateFilter]
        );


    // =========================================
    // FILTER TRANSACTIONS
    // =========================================

    const filteredTransactions =
        useMemo(() => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            return transactions.filter(
                (transaction) => {

                    const matchesSearch =
                        !searchText ||

                        transaction.transactionId
                            ?.toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        transaction.description
                            ?.toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        transaction.type
                            ?.toLowerCase()
                            .includes(
                                searchText
                            );


                    const matchesType =
                        typeFilter === "all" ||
                        transaction.type ===
                        typeFilter;


                    const transactionDate =
                        transaction.date ||
                        transaction.createdAt;


                    const matchesDate =
                        matchesDateFilter(
                            transactionDate
                        );


                    return (
                        matchesSearch &&
                        matchesType &&
                        matchesDate
                    );

                }
            );

        }, [
            transactions,
            search,
            typeFilter,
            matchesDateFilter
        ]);


    // =========================================
    // STATEMENT SUMMARY
    // =========================================

    const summary =
        useMemo(() => {

            let credits = 0;

            let debits = 0;


            filteredTransactions.forEach(
                (transaction) => {

                    const amount =
                        Number(
                            transaction.amount || 0
                        );


                    if (
                        isDebit(
                            transaction.type
                        )
                    ) {

                        debits += amount;

                    } else {

                        credits += amount;

                    }

                }
            );


            return {

                credits,

                debits,

                count:
                    filteredTransactions.length

            };

        }, [filteredTransactions]);


    // =========================================
    // TOTAL TRANSACTION COUNT
    // =========================================

    const totalTransactionCount =
        transactions.length;


    // =========================================
    // PRINT
    // =========================================

    const handlePrint = () => {

        window.print();

    };


    // =========================================
    // CLEAR FILTERS
    // =========================================

    const clearFilters = () => {

        setSearch("");

        setTypeFilter("all");

        setDateFilter("all");

    };


    // =========================================
    // LOADING SCREEN
    // =========================================

    if (loading) {

        return (

            <div className="statement-page">

                <div className="statement-wrapper">

                    <div className="statement-loading-card">

                        <div className="statement-loading-spinner">
                        </div>

                        <h2>
                            Loading Account Statement
                        </h2>

                        <p>
                            Please wait while we fetch
                            your transaction history.
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // =========================================
    // LOGIN CHECK
    // =========================================

    if (!user) {

        return (

            <div className="statement-page">

                <div className="statement-login-card">

                    <div className="statement-brand">

                        <div className="statement-brand-mark">
                            B
                        </div>

                        <div>

                            <div className="statement-brand-name">
                                BankEase
                            </div>

                            <div className="statement-brand-subtitle">
                                Smart Banking
                            </div>

                        </div>

                    </div>


                    <div className="statement-login-state">

                        <div className="statement-state-icon">
                            🔐
                        </div>

                        <h1>
                            Account Statement
                        </h1>

                        <p>
                            Please login to continue
                            to your account statement.
                        </p>

                        <button
                            className="statement-primary-button"
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


    // =========================================
    // MAIN PAGE
    // =========================================

    return (

        <div className="statement-page">

            <div className="statement-wrapper">


                {/* =====================================
                    TOP BAR
                ===================================== */}

                <div className="statement-topbar">

                    <button
                        className="statement-back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>


                    <div className="statement-page-label">
                        ACCOUNT STATEMENT
                    </div>

                </div>


                {/* =====================================
                    PAGE HEADER
                ===================================== */}

                <div className="statement-page-header">

                    <div>

                        <p className="statement-eyebrow">
                            ACCOUNT ACTIVITY
                        </p>

                        <h1>
                            Account Statement
                        </h1>

                        <p>
                            Review your complete banking
                            transaction history.
                        </p>

                    </div>


                    <div className="statement-header-actions">

                        <button
                            className="statement-print-button"
                            onClick={handlePrint}
                        >
                            🖨 Print Statement
                        </button>

                    </div>

                </div>


                {/* =====================================
                    ACCOUNT DETAILS
                ===================================== */}

                <div className="statement-account-card">

                    <div className="statement-account-heading">

                        <div className="statement-account-icon">
                            🏦
                        </div>

                        <div>

                            <h2>
                                Account Details
                            </h2>

                            <p>
                                BankEase Customer Account
                            </p>

                        </div>

                    </div>


                    <div className="statement-account-grid">


                        <div className="statement-account-item">

                            <span>
                                Account Holder
                            </span>

                            <strong>
                                {account?.name ||
                                    user.name}
                            </strong>

                        </div>


                        <div className="statement-account-item">

                            <span>
                                Account Number
                            </span>

                            <strong>
                                {account?.accountNumber ||
                                    user.accountNumber}
                            </strong>

                        </div>


                        <div className="statement-account-item">

                            <span>
                                Email Address
                            </span>

                            <strong>
                                {account?.email ||
                                    user.email}
                            </strong>

                        </div>


                        <div className="statement-account-item balance">

                            <span>
                                Current Balance
                            </span>

                            <strong>
                                ₹
                                {formatMoney(
                                    account?.balance ??
                                    user.balance
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    SUMMARY
                ===================================== */}

                <div className="statement-summary">


                    <div className="statement-summary-card">

                        <div className="statement-summary-icon total">
                            #
                        </div>

                        <div>

                            <span>
                                Transactions
                            </span>

                            <strong>
                                {summary.count}
                            </strong>

                        </div>

                    </div>


                    <div className="statement-summary-card">

                        <div className="statement-summary-icon credit">
                            +
                        </div>

                        <div>

                            <span>
                                Total Credits
                            </span>

                            <strong>
                                ₹
                                {formatMoney(
                                    summary.credits
                                )}
                            </strong>

                        </div>

                    </div>


                    <div className="statement-summary-card">

                        <div className="statement-summary-icon debit">
                            −
                        </div>

                        <div>

                            <span>
                                Total Debits
                            </span>

                            <strong>
                                ₹
                                {formatMoney(
                                    summary.debits
                                )}
                            </strong>

                        </div>

                    </div>


                    <div className="statement-summary-card">

                        <div className="statement-summary-icon records">
                            ✓
                        </div>

                        <div>

                            <span>
                                Total Records
                            </span>

                            <strong>
                                {totalTransactionCount}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    TRANSACTION HISTORY
                ===================================== */}

                <div className="statement-transactions-card">

                    <div className="statement-card-header">

                        <div>

                            <h2>
                                Transaction History
                            </h2>

                            <p>
                                Search and filter your
                                banking transactions.
                            </p>

                        </div>


                        <div className="statement-result-badge">

                            {filteredTransactions.length}

                            {" "}

                            result
                            {filteredTransactions.length !== 1
                                ? "s"
                                : ""}

                        </div>

                    </div>


                    {/* =================================
                        FILTERS
                    ================================= */}

                    <div className="statement-filters">


                        <div className="statement-search-box">

                            <span>
                                🔎
                            </span>

                            <input
                                type="text"
                                placeholder="Search transaction..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="statement-filter-field">

                            <label>
                                Type
                            </label>

                            <select
                                value={typeFilter}
                                onChange={(e) =>
                                    setTypeFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="all">
                                    All Transactions
                                </option>

                                <option value="deposit">
                                    Deposits
                                </option>

                                <option value="withdraw">
                                    Withdrawals
                                </option>

                                <option value="transfer">
                                    Transfers
                                </option>

                                <option value="bill">
                                    Bill Payments
                                </option>

                            </select>

                        </div>


                        <div className="statement-filter-field">

                            <label>
                                Period
                            </label>

                            <select
                                value={dateFilter}
                                onChange={(e) =>
                                    setDateFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="all">
                                    All Time
                                </option>

                                <option value="today">
                                    Today
                                </option>

                                <option value="7days">
                                    Last 7 Days
                                </option>

                                <option value="30days">
                                    Last 30 Days
                                </option>

                                <option value="90days">
                                    Last 90 Days
                                </option>

                            </select>

                        </div>


                        <button
                            className="statement-clear-button"
                            onClick={clearFilters}
                        >
                            Clear
                        </button>

                    </div>


                    {/* =================================
                        MESSAGE
                    ================================= */}

                    {message && (

                        <div className="statement-message">

                            <span>
                                !
                            </span>

                            <p>
                                {message}
                            </p>

                        </div>

                    )}


                    {/* =================================
                        EMPTY STATE
                    ================================= */}

                    {filteredTransactions.length === 0 ? (

                        <div className="statement-empty">

                            <div className="statement-empty-icon">
                                📄
                            </div>

                            <h3>
                                No Transactions Found
                            </h3>

                            <p>
                                Try changing your search
                                or filter options.
                            </p>

                            <button
                                onClick={
                                    clearFilters
                                }
                            >
                                Clear Filters
                            </button>

                        </div>

                    ) : (

                        <div className="statement-table-wrapper">

                            <table className="statement-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Transaction
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Description
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Date & Time
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredTransactions.map(
                                        (transaction) => {

                                            const debit =
                                                isDebit(
                                                    transaction.type
                                                );


                                            const transactionDate =
                                                transaction.date ||
                                                transaction.createdAt;


                                            return (

                                                <tr
                                                    key={
                                                        transaction.transactionId
                                                    }
                                                >

                                                    <td>

                                                        <div className="statement-transaction-cell">

                                                            <strong>
                                                                {
                                                                    transaction.transactionId
                                                                }
                                                            </strong>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                `statement-type ${transaction.type}`
                                                            }
                                                        >
                                                            {formatType(
                                                                transaction.type
                                                            )}
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="statement-description">

                                                            {
                                                                transaction.description
                                                            }

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <strong
                                                            className={
                                                                debit
                                                                    ? "statement-amount debit"
                                                                    : "statement-amount credit"
                                                            }
                                                        >

                                                            {debit
                                                                ? "-"
                                                                : "+"}

                                                            ₹
                                                            {formatMoney(
                                                                transaction.amount
                                                            )}

                                                        </strong>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                `statement-status ${transaction.status}`
                                                            }
                                                        >

                                                            {
                                                                transaction.status
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="statement-date">

                                                            {
                                                                formatDate(
                                                                    transactionDate
                                                                )
                                                            }

                                                        </div>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>


                {/* =====================================
                    SECURITY NOTE
                ===================================== */}

                <div className="statement-security-note">

                    <div className="statement-security-icon">
                        🔒
                    </div>

                    <div>

                        <strong>
                            Secure digital statement
                        </strong>

                        <p>
                            This statement contains confidential
                            banking information. Keep it secure.
                        </p>

                    </div>

                </div>


                {/* =====================================
                    FOOTER
                ===================================== */}

                <div className="statement-footer">

                    <span>
                        BankEase • Secure Digital Banking
                    </span>

                    <span>
                        Electronically generated statement
                    </span>

                </div>


                {/* =====================================
                    BACK BUTTON
                ===================================== */}

                <button
                    className="statement-bottom-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>

            </div>

        </div>

    );

}

export default AccountStatement;