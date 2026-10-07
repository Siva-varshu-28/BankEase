import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "./Transactions.css";


function Transactions() {

    const navigate = useNavigate();


    // =====================================================
    // STATES
    // =====================================================

    const [transactions, setTransactions] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [typeFilter, setTypeFilter] =
        useState("all");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // FETCH TRANSACTIONS
    // =====================================================

    const fetchTransactions =
        useCallback(async () => {

            try {

                setLoading(true);

                setError("");


                const token =
                    localStorage.getItem("token");


                if (!token) {

                    navigate("/");

                    return;

                }


                const response =
                    await fetch(
                        "http://localhost:5000/api/transactions/history",
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


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to fetch transactions"
                    );

                }


                setTransactions(
                    data.transactions || []
                );


            } catch (error) {

                console.error(
                    "Transaction fetch error:",
                    error
                );


                setError(
                    error.message ||
                    "Unable to load transactions"
                );


            } finally {

                setLoading(false);

            }

        }, [navigate]);


    // =====================================================
    // LOAD
    // =====================================================

    useEffect(() => {

        fetchTransactions();

    }, [fetchTransactions]);


    // =====================================================
    // FILTER TRANSACTIONS
    // =====================================================

    const filteredTransactions =
        transactions.filter(
            (transaction) => {

                const searchText =
                    search
                        .trim()
                        .toLowerCase();


                const matchesSearch =
                    transaction.description
                        ?.toLowerCase()
                        .includes(searchText) ||

                    transaction.transactionId
                        ?.toLowerCase()
                        .includes(searchText);


                const matchesType =
                    typeFilter === "all" ||
                    transaction.type === typeFilter;


                const matchesStatus =
                    statusFilter === "all" ||
                    transaction.status === statusFilter;


                return (
                    matchesSearch &&
                    matchesType &&
                    matchesStatus
                );

            }
        );


    // =====================================================
    // SUMMARY
    // =====================================================

    const totalTransactions =
        transactions.length;


    const successfulTransactions =
        transactions.filter(
            (transaction) =>
                transaction.status === "success"
        ).length;


    const pendingTransactions =
        transactions.filter(
            (transaction) =>
                transaction.status === "pending"
        ).length;


    const failedTransactions =
        transactions.filter(
            (transaction) =>
                transaction.status === "failed"
        ).length;


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {

            return "-";

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


    // =====================================================
    // FORMAT TYPE
    // =====================================================

    const formatType = (type) => {

        if (!type) {

            return "-";

        }


        if (type === "withdraw") {

            return "Withdrawal";

        }


        if (type === "bill") {

            return "Bill Payment";

        }


        return (
            type.charAt(0).toUpperCase() +
            type.slice(1)
        );

    };


    // =====================================================
    // AMOUNT CLASS
    // =====================================================

    const getAmountClass = (type) => {

        if (
            type === "deposit" ||
            type === "transfer"
        ) {

            return "transaction-credit";

        }


        return "transaction-debit";

    };


    // =====================================================
    // AMOUNT PREFIX
    // =====================================================

    const getAmountPrefix = (type) => {

        if (
            type === "withdraw" ||
            type === "bill"
        ) {

            return "-";

        }


        return "+";

    };


    // =====================================================
    // TYPE ICON
    // =====================================================

    const getTypeIcon = (type) => {

        if (type === "deposit") {

            return "↓";

        }


        if (type === "withdraw") {

            return "↑";

        }


        if (type === "transfer") {

            return "↗";

        }


        if (type === "bill") {

            return "₹";

        }


        return "•";

    };


    // =====================================================
    // FILTER RESET
    // =====================================================

    const clearFilters = () => {

        setSearch("");

        setTypeFilter("all");

        setStatusFilter("all");

    };


    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {

        navigate("/dashboard");

    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="transactions-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="transactions-page-header">


                <div className="transactions-header-left">

                    <button
                        className="transactions-back-btn"
                        onClick={handleBack}
                    >
                        ← Back to Dashboard
                    </button>


                    <span className="transactions-header-label">
                        BANKING ACTIVITY
                    </span>


                    <h1>
                        Transaction History
                    </h1>


                    <p>
                        View, search and manage your
                        recent banking transactions.
                    </p>

                </div>


                <button
                    className="transactions-refresh-btn"
                    onClick={fetchTransactions}
                    disabled={loading}
                >

                    <span>
                        ↻
                    </span>

                    {loading
                        ? "Refreshing..."
                        : "Refresh"}

                </button>

            </header>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <section className="transactions-summary">


                {/* TOTAL */}

                <div className="transaction-summary-card">

                    <div className="summary-icon">
                        ↔
                    </div>

                    <div>

                        <span>
                            TOTAL TRANSACTIONS
                        </span>

                        <strong>
                            {totalTransactions}
                        </strong>

                    </div>

                </div>


                {/* SUCCESS */}

                <div className="transaction-summary-card">

                    <div className="summary-icon success">
                        ✓
                    </div>

                    <div>

                        <span>
                            SUCCESSFUL
                        </span>

                        <strong>
                            {successfulTransactions}
                        </strong>

                    </div>

                </div>


                {/* PENDING */}

                <div className="transaction-summary-card">

                    <div className="summary-icon pending">
                        ⏳
                    </div>

                    <div>

                        <span>
                            PENDING
                        </span>

                        <strong>
                            {pendingTransactions}
                        </strong>

                    </div>

                </div>


                {/* FAILED */}

                <div className="transaction-summary-card">

                    <div className="summary-icon failed">
                        !
                    </div>

                    <div>

                        <span>
                            FAILED
                        </span>

                        <strong>
                            {failedTransactions}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                FILTER CARD
            ================================================= */}

            <section className="transactions-filter-card">


                <div className="transactions-filter-title">

                    <span>
                        FILTERS
                    </span>

                    <h2>
                        Find a transaction
                    </h2>

                </div>


                <div className="transactions-filter-controls">


                    {/* SEARCH */}

                    <div className="transaction-search">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search by description or transaction ID..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* TYPE */}

                    <select
                        value={typeFilter}
                        onChange={(e) =>
                            setTypeFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Types
                        </option>

                        <option value="deposit">
                            Deposit
                        </option>

                        <option value="withdraw">
                            Withdrawal
                        </option>

                        <option value="transfer">
                            Transfer
                        </option>

                        <option value="bill">
                            Bill Payment
                        </option>

                    </select>


                    {/* STATUS */}

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Status
                        </option>

                        <option value="success">
                            Success
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="failed">
                            Failed
                        </option>

                    </select>


                    {/* CLEAR */}

                    {(search ||
                        typeFilter !== "all" ||
                        statusFilter !== "all") && (

                        <button
                            className="clear-filter-btn"
                            onClick={clearFilters}
                        >
                            Clear
                        </button>

                    )}

                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="transactions-error">

                    <span>
                        !
                    </span>

                    <p>
                        {error}
                    </p>

                </div>

            )}


            {/* =================================================
                TABLE CARD
            ================================================= */}

            <section className="transactions-table-card">


                <div className="transactions-table-header">

                    <div>

                        <span>
                            TRANSACTION RECORDS
                        </span>

                        <h2>
                            All Transactions
                        </h2>

                        <p>
                            {filteredTransactions.length}
                            {" "}
                            transaction(s) found
                        </p>

                    </div>


                    <div className="transaction-record-count">

                        {filteredTransactions.length}

                    </div>

                </div>


                {/* LOADING */}

                {loading ? (

                    <div className="transactions-loading">

                        <div className="loading-spinner">
                        </div>

                        <h3>
                            Loading transactions
                        </h3>

                        <p>
                            Please wait while we fetch
                            your transaction history.
                        </p>

                    </div>

                ) : filteredTransactions.length === 0 ? (

                    /* EMPTY */

                    <div className="transactions-empty">

                        <div className="empty-icon">
                            📄
                        </div>

                        <h3>
                            No Transactions Found
                        </h3>

                        <p>
                            No transactions match
                            your current filters.
                        </p>


                        <button
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    /* TABLE */

                    <div className="transactions-table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Date & Time
                                    </th>

                                    <th>
                                        Transaction ID
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

                                </tr>

                            </thead>


                            <tbody>

                                {filteredTransactions.map(
                                    (transaction) => (

                                        <tr
                                            key={
                                                transaction._id ||
                                                transaction.transactionId
                                            }
                                        >


                                            {/* DATE */}

                                            <td>

                                                <div className="transaction-date">

                                                    <strong>
                                                        {formatDate(
                                                            transaction.createdAt
                                                        )}
                                                    </strong>

                                                </div>

                                            </td>


                                            {/* ID */}

                                            <td>

                                                <span className="transaction-id">

                                                    {
                                                        transaction.transactionId
                                                    }

                                                </span>

                                            </td>


                                            {/* TYPE */}

                                            <td>

                                                <span
                                                    className={
                                                        `transaction-type ${transaction.type}`
                                                    }
                                                >

                                                    <span>
                                                        {
                                                            getTypeIcon(
                                                                transaction.type
                                                            )
                                                        }
                                                    </span>

                                                    {formatType(
                                                        transaction.type
                                                    )}

                                                </span>

                                            </td>


                                            {/* DESCRIPTION */}

                                            <td>

                                                <span className="transaction-description">

                                                    {
                                                        transaction.description ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            {/* AMOUNT */}

                                            <td>

                                                <span
                                                    className={
                                                        getAmountClass(
                                                            transaction.type
                                                        )
                                                    }
                                                >

                                                    {
                                                        getAmountPrefix(
                                                            transaction.type
                                                        )
                                                    }

                                                    ₹
                                                    {Number(
                                                        transaction.amount ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN",
                                                        {
                                                            minimumFractionDigits:
                                                                2,
                                                            maximumFractionDigits:
                                                                2
                                                        }
                                                    )}

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        `transaction-status ${transaction.status}`
                                                    }
                                                >

                                                    <span>
                                                        ●
                                                    </span>

                                                    {formatType(
                                                        transaction.status
                                                    )}

                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>

    );

}


export default Transactions;