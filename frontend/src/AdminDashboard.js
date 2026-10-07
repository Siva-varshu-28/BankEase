import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import AdminSidebar from "./components/AdminSidebar";

import "./AdminDashboard.css";


function AdminDashboard() {

    const navigate = useNavigate();


    // =========================================
    // STATE
    // =========================================

    const [dashboardData, setDashboardData] =
        useState({
            totalCustomers: 0,
            totalBalance: 0,
            totalTransactions: 0,
            totalAdmins: 0
        });

    const [customers, setCustomers] =
        useState([]);

    const [transactions, setTransactions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================
    // SESSION EXPIRED
    // =========================================

    const handleAdminSessionExpired =
        useCallback(() => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            navigate("/admin/login");

        }, [navigate]);


    // =========================================
    // AUTH CHECK
    // =========================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        const userString =
            localStorage.getItem("user");


        if (!token || !userString) {

            navigate("/admin/login");

            return;

        }


        try {

            const user =
                JSON.parse(userString);


            if (
                !user ||
                user.role !== "admin"
            ) {

                handleAdminSessionExpired();

            }

        } catch (error) {

            console.error(
                "Admin Session Error:",
                error
            );

            handleAdminSessionExpired();

        }

    }, [
        navigate,
        handleAdminSessionExpired
    ]);


    // =========================================
    // FETCH DASHBOARD DATA
    // =========================================

    const fetchDashboardData =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    setError("");


                    const token =
                        localStorage.getItem(
                            "token"
                        );


                    if (!token) {

                        handleAdminSessionExpired();

                        return;

                    }


                    const headers = {

                        Authorization:
                            `Bearer ${token}`

                    };


                    // =====================================
                    // DASHBOARD
                    // =====================================

                    const dashboardResponse =
                        await fetch(
                            "http://localhost:5000/api/admin/dashboard",
                            {
                                headers
                            }
                        );


                    const dashboardResult =
                        await dashboardResponse.json();


                    if (
                        dashboardResponse.status === 401 ||
                        dashboardResponse.status === 403
                    ) {

                        handleAdminSessionExpired();

                        return;

                    }


                    if (!dashboardResponse.ok) {

                        throw new Error(
                            dashboardResult.message ||
                            "Failed to load dashboard"
                        );

                    }


                    setDashboardData({

                        totalCustomers:
                            dashboardResult.stats
                                ?.totalCustomers || 0,

                        totalBalance:
                            dashboardResult.stats
                                ?.totalBalance || 0,

                        totalTransactions:
                            dashboardResult.stats
                                ?.totalTransactions || 0,

                        totalAdmins:
                            dashboardResult.stats
                                ?.totalAdmins || 0

                    });


                    // =====================================
                    // CUSTOMERS
                    // =====================================

                    const customersResponse =
                        await fetch(
                            "http://localhost:5000/api/admin/customers",
                            {
                                headers
                            }
                        );


                    const customersResult =
                        await customersResponse.json();


                    if (
                        customersResponse.status === 401 ||
                        customersResponse.status === 403
                    ) {

                        handleAdminSessionExpired();

                        return;

                    }


                    if (!customersResponse.ok) {

                        throw new Error(
                            customersResult.message ||
                            "Failed to load customers"
                        );

                    }


                    setCustomers(
                        customersResult.customers || []
                    );


                    // =====================================
                    // TRANSACTIONS
                    // =====================================

                    const transactionsResponse =
                        await fetch(
                            "http://localhost:5000/api/admin/transactions",
                            {
                                headers
                            }
                        );


                    const transactionsResult =
                        await transactionsResponse.json();


                    if (
                        transactionsResponse.status === 401 ||
                        transactionsResponse.status === 403
                    ) {

                        handleAdminSessionExpired();

                        return;

                    }


                    if (!transactionsResponse.ok) {

                        throw new Error(
                            transactionsResult.message ||
                            "Failed to load transactions"
                        );

                    }


                    setTransactions(
                        transactionsResult.transactions || []
                    );


                } catch (error) {

                    console.error(
                        "Admin Dashboard Error:",
                        error
                    );

                    setError(
                        error.message ||
                        "Failed to load admin dashboard"
                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                handleAdminSessionExpired
            ]
        );


    // =========================================
    // LOAD DASHBOARD
    // =========================================

    useEffect(() => {

        fetchDashboardData();

    }, [fetchDashboardData]);


    // =========================================
    // FORMAT CURRENCY
    // =========================================

    const formatCurrency = (amount) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(
            Number(amount || 0)
        );

    };


    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =========================================
    // ADMIN USER
    // =========================================

    let adminUser = {};

    try {

        adminUser =
            JSON.parse(
                localStorage.getItem(
                    "user"
                ) || "{}"
            );

    } catch (error) {

        adminUser = {};

    }


    const adminName =
        adminUser.name ||
        "Administrator";


    // =========================================
    // RECENT CUSTOMERS
    // =========================================

    const recentCustomers =
        customers.slice(
            0,
            5
        );


    // =========================================
    // RECENT TRANSACTIONS
    // =========================================

    const recentTransactions =
        transactions.slice(
            0,
            5
        );


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="admin-dashboard-page">


            {/* =====================================
                SIDEBAR
            ===================================== */}

            <AdminSidebar
                activePage="dashboard"
            />


            {/* =====================================
                MAIN CONTENT
            ===================================== */}

            <main className="admin-main">


                {/* =================================
                    TOP BAR
                ================================= */}

                <header className="admin-topbar">

                    <div>

                        <p className="admin-eyebrow">
                            ADMINISTRATION PORTAL
                        </p>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Welcome back, {adminName}.
                            Here's your BankEase overview.
                        </p>

                    </div>


                    <div className="admin-topbar-actions">

                        <button
                            className="admin-refresh-button"
                            onClick={
                                fetchDashboardData
                            }
                            disabled={loading}
                        >

                            {loading
                                ? "Loading..."
                                : "↻ Refresh"}

                        </button>


                        <div className="admin-profile">

                            <div className="admin-profile-avatar">
                                A
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


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="admin-alert error">

                        <span>
                            !
                        </span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* =================================
                    LOADING
                ================================= */}

                {loading ? (

                    <div className="admin-loading-card">

                        <div className="admin-loading-spinner">
                        </div>

                        <h2>
                            Loading Dashboard
                        </h2>

                        <p>
                            Please wait while we fetch
                            the latest administration data.
                        </p>

                    </div>

                ) : (

                    <>


                        {/* =================================
                            SUMMARY
                        ================================= */}

                        <section className="admin-stats">


                            {/* CUSTOMERS */}

                            <div className="admin-stat-card">

                                <div className="admin-stat-icon customers">
                                    👥
                                </div>

                                <div>

                                    <span>
                                        Total Customers
                                    </span>

                                    <strong>
                                        {
                                            dashboardData
                                                .totalCustomers
                                        }
                                    </strong>

                                </div>

                            </div>


                            {/* BALANCE */}

                            <div className="admin-stat-card">

                                <div className="admin-stat-icon balance">
                                    ₹
                                </div>

                                <div>

                                    <span>
                                        Total Balance
                                    </span>

                                    <strong>
                                        {
                                            formatCurrency(
                                                dashboardData
                                                    .totalBalance
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>


                            {/* TRANSACTIONS */}

                            <div className="admin-stat-card">

                                <div className="admin-stat-icon transactions">
                                    ↔
                                </div>

                                <div>

                                    <span>
                                        Total Transactions
                                    </span>

                                    <strong>
                                        {
                                            dashboardData
                                                .totalTransactions
                                        }
                                    </strong>

                                </div>

                            </div>


                            {/* ADMINS */}

                            <div className="admin-stat-card">

                                <div className="admin-stat-icon admins">
                                    🛡
                                </div>

                                <div>

                                    <span>
                                        Total Admins
                                    </span>

                                    <strong>
                                        {
                                            dashboardData
                                                .totalAdmins
                                        }
                                    </strong>

                                </div>

                            </div>


                        </section>


                        {/* =================================
                            RECENT CUSTOMERS
                        ================================= */}

                        <section className="admin-section">

                            <div className="admin-section-header">

                                <div>

                                    <p className="admin-section-eyebrow">
                                        CUSTOMER ACTIVITY
                                    </p>

                                    <h2>
                                        Recent Customers
                                    </h2>

                                    <p>
                                        Recently registered
                                        BankEase customers.
                                    </p>

                                </div>


                                <button
                                    className="admin-section-button"
                                    onClick={() =>
                                        navigate(
                                            "/admin/customers"
                                        )
                                    }
                                >
                                    View All Customers →
                                </button>

                            </div>


                            {recentCustomers.length === 0 ? (

                                <div className="admin-empty">

                                    <div className="admin-empty-icon">
                                        👥
                                    </div>

                                    <h3>
                                        No Customers Found
                                    </h3>

                                    <p>
                                        Customer registrations
                                        will appear here.
                                    </p>

                                </div>

                            ) : (

                                <div className="admin-table-wrapper">

                                    <table className="admin-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Customer
                                                </th>

                                                <th>
                                                    Email
                                                </th>

                                                <th>
                                                    Account Number
                                                </th>

                                                <th>
                                                    Balance
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {recentCustomers.map(
                                                (customer) => (

                                                    <tr
                                                        key={
                                                            customer._id
                                                        }
                                                    >

                                                        <td>

                                                            <div className="admin-customer-cell">

                                                                <div className="admin-customer-avatar">

                                                                    {
                                                                        customer.name
                                                                            ?.charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()
                                                                    }

                                                                </div>

                                                                <div>

                                                                    <strong>
                                                                        {
                                                                            customer.name
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                        Customer
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        <td>
                                                            {
                                                                customer.email
                                                            }
                                                        </td>


                                                        <td>

                                                            <span className="admin-account-number">

                                                                {
                                                                    customer.accountNumber
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <strong className="admin-balance-value">

                                                                {
                                                                    formatCurrency(
                                                                        customer.balance
                                                                    )
                                                                }

                                                            </strong>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </section>


                        {/* =================================
                            RECENT TRANSACTIONS
                        ================================= */}

                        <section className="admin-section">

                            <div className="admin-section-header">

                                <div>

                                    <p className="admin-section-eyebrow">
                                        TRANSACTION ACTIVITY
                                    </p>

                                    <h2>
                                        Recent Transactions
                                    </h2>

                                    <p>
                                        Latest banking transactions
                                        across the system.
                                    </p>

                                </div>


                                <button
                                    className="admin-section-button"
                                    onClick={() =>
                                        navigate(
                                            "/admin/transactions"
                                        )
                                    }
                                >
                                    View All Transactions →
                                </button>

                            </div>


                            {recentTransactions.length === 0 ? (

                                <div className="admin-empty">

                                    <div className="admin-empty-icon">
                                        💳
                                    </div>

                                    <h3>
                                        No Transactions Found
                                    </h3>

                                    <p>
                                        Banking transactions
                                        will appear here.
                                    </p>

                                </div>

                            ) : (

                                <div className="admin-table-wrapper">

                                    <table className="admin-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Transaction ID
                                                </th>

                                                <th>
                                                    Type
                                                </th>

                                                <th>
                                                    Amount
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Date
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {recentTransactions.map(
                                                (transaction) => (

                                                    <tr
                                                        key={
                                                            transaction._id
                                                        }
                                                    >

                                                        <td>

                                                            <strong className="admin-transaction-id">

                                                                {
                                                                    transaction.transactionId
                                                                }

                                                            </strong>

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    `admin-transaction-type ${transaction.type}`
                                                                }
                                                            >

                                                                {
                                                                    transaction.type
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <strong className="admin-transaction-amount">

                                                                {
                                                                    formatCurrency(
                                                                        transaction.amount
                                                                    )
                                                                }

                                                            </strong>

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    `admin-transaction-status ${transaction.status}`
                                                                }
                                                            >

                                                                {
                                                                    transaction.status
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <span className="admin-date">

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

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </section>


                        {/* =================================
                            SECURITY NOTE
                        ================================= */}

                        <div className="admin-security-note">

                            <div className="admin-security-icon">
                                🔒
                            </div>

                            <div>

                                <strong>
                                    Administrator Security
                                </strong>

                                <p>
                                    This portal is restricted to
                                    authorized BankEase administrators.
                                    Keep your credentials private.
                                </p>

                            </div>

                        </div>


                    </>

                )}

            </main>

        </div>

    );

}

export default AdminDashboard;