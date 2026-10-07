import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import AdminSidebar from "./components/AdminSidebar";

import "./AdminTransactions.css";


function AdminTransactions() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
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

    const [message, setMessage] =
        useState("");


    // =====================================================
    // ADMIN SESSION
    // =====================================================

    const handleAdminSessionExpired =
        useCallback(() => {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/admin/login");

        }, [navigate]);


    // =====================================================
    // FETCH TRANSACTIONS
    // =====================================================

    const fetchTransactions =
        useCallback(async () => {

            try {

                setLoading(true);
                setMessage("");


                const token =
                    localStorage.getItem("token");

                const savedUser =
                    localStorage.getItem("user");


                if (!token || !savedUser) {

                    handleAdminSessionExpired();

                    return;

                }


                let user;

                try {

                    user =
                        JSON.parse(savedUser);

                } catch (parseError) {

                    console.error(
                        "Admin user parse error:",
                        parseError
                    );

                    handleAdminSessionExpired();

                    return;

                }


                if (user.role !== "admin") {

                    handleAdminSessionExpired();

                    return;

                }


                const response =
                    await fetch(
                        "http://localhost:5000/api/admin/transactions",
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


                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    handleAdminSessionExpired();

                    return;

                }


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to load transactions"
                    );

                }


                setTransactions(
                    data.transactions || []
                );


            } catch (fetchError) {

                console.error(
                    "Admin Transactions Error:",
                    fetchError
                );

                setMessage(
                    fetchError.message ||
                    "Unable to connect to server"
                );

            } finally {

                setLoading(false);

            }

        }, [handleAdminSessionExpired]);


    useEffect(() => {

        fetchTransactions();

    }, [fetchTransactions]);


    // =====================================================
    // FILTER TRANSACTIONS
    // =====================================================

    const filteredTransactions =
        useMemo(() => {

            const searchValue =
                search
                    .toLowerCase()
                    .trim();


            return transactions.filter(
                (transaction) => {

                    const transactionId =
                        transaction.transactionId
                            ?.toLowerCase() || "";

                    const customerName =
                        transaction.userId?.name
                            ?.toLowerCase() || "";

                    const customerEmail =
                        transaction.userId?.email
                            ?.toLowerCase() || "";

                    const accountNumber =
                        transaction.userId
                            ?.accountNumber
                            ?.toLowerCase() || "";


                    const matchesSearch =
                        !searchValue ||
                        transactionId.includes(
                            searchValue
                        ) ||
                        customerName.includes(
                            searchValue
                        ) ||
                        customerEmail.includes(
                            searchValue
                        ) ||
                        accountNumber.includes(
                            searchValue
                        );


                    const matchesType =
                        typeFilter === "all" ||
                        transaction.type ===
                            typeFilter;


                    const matchesStatus =
                        statusFilter === "all" ||
                        transaction.status ===
                            statusFilter;


                    return (
                        matchesSearch &&
                        matchesType &&
                        matchesStatus
                    );

                }
            );

        }, [
            transactions,
            search,
            typeFilter,
            statusFilter
        ]);


    // =====================================================
    // TRANSACTION COUNTS
    // =====================================================

    const transactionCounts =
        useMemo(() => {

            return {
                total: transactions.length,

                filtered:
                    filteredTransactions.length,

                successful:
                    transactions.filter(
                        (transaction) =>
                            transaction.status ===
                            "success"
                    ).length,

                pending:
                    transactions.filter(
                        (transaction) =>
                            transaction.status ===
                            "pending"
                    ).length,

                failed:
                    transactions.filter(
                        (transaction) =>
                            transaction.status ===
                            "failed"
                    ).length
            };

        }, [
            transactions,
            filteredTransactions
        ]);


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        return new Date(date).toLocaleString(
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
    // FORMAT TYPE / STATUS
    // =====================================================

    const formatType = (type) => {

        if (!type) {
            return "-";
        }


        return (
            type.charAt(0).toUpperCase() +
            type.slice(1)
        );

    };


    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {

        setSearch("");
        setTypeFilter("all");
        setStatusFilter("all");

    };


    const hasActiveFilters =
        search ||
        typeFilter !== "all" ||
        statusFilter !== "all";


    // =====================================================
    // ADMIN DETAILS
    // =====================================================

    let adminUser = {};

    try {

        adminUser =
            JSON.parse(
                localStorage.getItem(
                    "user"
                ) || "{}"
            );

    } catch (parseError) {

        console.error(
            "Admin profile parse error:",
            parseError
        );

        adminUser = {};

    }


    const adminName =
        adminUser.name ||
        "Administrator";


    // =====================================================
    // LOADING STATE
    // =====================================================

    if (loading) {

        return (

            <div className="admin-transactions-page">

                <AdminSidebar
                    activePage="transactions"
                />


                <main className="admin-transactions-main">

                    <div className="admin-transactions-loading-card">

                        <div className="admin-transactions-loading-spinner">
                        </div>

                        <h2>
                            Loading Transactions
                        </h2>

                        <p>
                            Retrieving the latest BankEase transaction records.
                        </p>

                    </div>

                </main>

            </div>

        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="admin-transactions-page">


            {/* =================================================
                COMMON ADMIN SIDEBAR
            ================================================= */}

            <AdminSidebar
                activePage="transactions"
            />


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="admin-transactions-main">


                {/* =================================================
                    TOP BAR
                ================================================= */}

                <header className="admin-transactions-topbar">

                    <div>

                        <p className="admin-transactions-eyebrow">
                            Transaction Administration
                        </p>

                        <h1>
                            Transaction Management
                        </h1>

                        <p>
                            Monitor and review all BankEase financial activities.
                        </p>

                    </div>


                    <div className="admin-transactions-topbar-actions">

                        <button
                            type="button"
                            className="admin-transactions-refresh-button"
                            onClick={fetchTransactions}
                            disabled={loading}
                        >
                            ↻ Refresh
                        </button>


                        <div className="admin-transactions-profile">

                            <div className="admin-transactions-avatar">
                                🛡️
                            </div>


                            <div>

                                <strong>
                                    {adminName}
                                </strong>

                                <span>
                                    Administrator
                                </span>

                            </div>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (

                    <div className="admin-transactions-alert error">
                        {message}
                    </div>

                )}


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <section className="admin-transactions-summary">


                    {/* TOTAL */}

                    <div className="admin-transactions-summary-card">

                        <div className="admin-transactions-summary-icon total">
                            💳
                        </div>


                        <div>

                            <span>
                                Total Transactions
                            </span>

                            <strong>
                                {transactionCounts.total}
                            </strong>

                        </div>

                    </div>


                    {/* FILTERED */}

                    <div className="admin-transactions-summary-card">

                        <div className="admin-transactions-summary-icon filtered">
                            🔎
                        </div>


                        <div>

                            <span>
                                Filtered Results
                            </span>

                            <strong>
                                {transactionCounts.filtered}
                            </strong>

                        </div>

                    </div>


                    {/* SUCCESSFUL */}

                    <div className="admin-transactions-summary-card">

                        <div className="admin-transactions-summary-icon success">
                            ✅
                        </div>


                        <div>

                            <span>
                                Successful
                            </span>

                            <strong>
                                {transactionCounts.successful}
                            </strong>

                        </div>

                    </div>


                    {/* PENDING */}

                    <div className="admin-transactions-summary-card">

                        <div className="admin-transactions-summary-icon pending">
                            ⏳
                        </div>


                        <div>

                            <span>
                                Pending
                            </span>

                            <strong>
                                {transactionCounts.pending}
                            </strong>

                        </div>

                    </div>


                </section>


                {/* =================================================
                    TRANSACTION SECTION
                ================================================= */}

                <section className="admin-transactions-section">


                    {/* SECTION HEADER */}

                    <div className="admin-transactions-section-header">

                        <div>

                            <p className="admin-transactions-section-eyebrow">
                                Transaction Directory
                            </p>

                            <h2>
                                All Transactions
                            </h2>

                            <p>
                                Search, filter and review banking activities.
                            </p>

                        </div>


                        <div className="admin-transactions-result-badge">
                            {filteredTransactions.length} Records
                        </div>

                    </div>


                    {/* =================================================
                        FILTERS
                    ================================================= */}

                    <div className="admin-transactions-filters">


                        {/* SEARCH */}

                        <div className="admin-transactions-search">

                            <span>
                                🔎
                            </span>


                            <input
                                type="text"
                                placeholder="Search transaction ID, customer, email or account number..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                aria-label="Search transactions"
                            />


                            {search && (

                                <button
                                    type="button"
                                    className="admin-transactions-search-clear"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>

                            )}

                        </div>


                        {/* TYPE */}

                        <select
                            value={typeFilter}
                            onChange={(event) =>
                                setTypeFilter(
                                    event.target.value
                                )
                            }
                            aria-label="Filter by transaction type"
                        >

                            <option value="all">
                                All Types
                            </option>

                            <option value="deposit">
                                Deposit
                            </option>

                            <option value="withdraw">
                                Withdraw
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
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            aria-label="Filter by transaction status"
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

                        {hasActiveFilters && (

                            <button
                                type="button"
                                className="admin-transactions-clear"
                                onClick={
                                    clearFilters
                                }
                            >
                                Clear Filters
                            </button>

                        )}

                    </div>


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="admin-transactions-table-wrapper">

                        <table className="admin-transactions-table">

                            <thead>

                                <tr>

                                    <th>
                                        TRANSACTION ID
                                    </th>

                                    <th>
                                        CUSTOMER
                                    </th>

                                    <th>
                                        ACCOUNT
                                    </th>

                                    <th>
                                        TYPE
                                    </th>

                                    <th>
                                        AMOUNT
                                    </th>

                                    <th>
                                        STATUS
                                    </th>

                                    <th>
                                        DATE & TIME
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredTransactions.map(
                                    (transaction) => (

                                        <tr
                                            key={
                                                transaction._id
                                            }
                                        >


                                            {/* TRANSACTION ID */}

                                            <td>

                                                <strong className="admin-transaction-id">

                                                    {
                                                        transaction.transactionId ||
                                                        "-"
                                                    }

                                                </strong>

                                            </td>


                                            {/* CUSTOMER */}

                                            <td>

                                                <div className="transaction-customer">

                                                    <div className="transaction-customer-avatar">

                                                        {
                                                            transaction.userId
                                                                ?.name
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                            "U"
                                                        }

                                                    </div>


                                                    <div>

                                                        <strong>

                                                            {
                                                                transaction.userId
                                                                    ?.name ||
                                                                "Unknown"
                                                            }

                                                        </strong>

                                                        <span>

                                                            {
                                                                transaction.userId
                                                                    ?.email ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* ACCOUNT */}

                                            <td>

                                                <span className="admin-transaction-account">

                                                    {
                                                        transaction.userId
                                                            ?.accountNumber ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            {/* TYPE */}

                                            <td>

                                                <span
                                                    className={
                                                        `admin-transaction-type ${transaction.type || ""}`
                                                    }
                                                >

                                                    {
                                                        formatType(
                                                            transaction.type
                                                        )
                                                    }

                                                </span>

                                            </td>


                                            {/* AMOUNT */}

                                            <td>

                                                <strong className="admin-transaction-amount">

                                                    ₹
                                                    {Number(
                                                        transaction.amount ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </strong>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        `admin-transaction-status ${transaction.status || ""}`
                                                    }
                                                >

                                                    {
                                                        formatType(
                                                            transaction.status
                                                        )
                                                    }

                                                </span>

                                            </td>


                                            {/* DATE */}

                                            <td>

                                                <span className="admin-transaction-date">

                                                    {
                                                        formatDate(
                                                            transaction.createdAt
                                                        )
                                                    }

                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}


                                {/* EMPTY */}

                                {filteredTransactions.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="admin-transactions-empty"
                                        >

                                            <div className="admin-transactions-empty-icon">
                                                💳
                                            </div>

                                            <strong>

                                                {hasActiveFilters
                                                    ? "No transactions found for the selected filters"
                                                    : "No transactions available"}

                                            </strong>

                                            <span>

                                                {hasActiveFilters
                                                    ? "Try changing your search or filter options."
                                                    : "There are currently no transaction records to display."}

                                            </span>


                                            {hasActiveFilters && (

                                                <button
                                                    type="button"
                                                    className="admin-transactions-empty-button"
                                                    onClick={
                                                        clearFilters
                                                    }
                                                >
                                                    Clear Filters
                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>


                </section>


                {/* =================================================
                    SECURITY NOTE
                ================================================= */}

                <div className="admin-transactions-security-note">

                    <div className="admin-transactions-security-icon">
                        🔐
                    </div>


                    <div>

                        <strong>
                            Transaction monitoring
                        </strong>

                        <p>
                            Transaction records are available only to
                            authorized BankEase administrators.
                        </p>

                    </div>

                </div>


            </main>

        </div>

    );

}


export default AdminTransactions;