import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();


    // =====================================================
    // GET USER FROM LOCAL STORAGE
    // =====================================================

    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;

    });


    const userId = user?.id;


    // =====================================================
    // DASHBOARD STATES
    // =====================================================

    const [balance, setBalance] =
        useState(0);

    const [totalIncome, setTotalIncome] =
        useState(0);

    const [totalExpenses, setTotalExpenses] =
        useState(0);

    const [recentTransactions, setRecentTransactions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // NOTIFICATION STATE
    // =====================================================

    const [unreadNotifications, setUnreadNotifications] =
        useState(0);


    // =====================================================
    // FETCH DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        const fetchDashboardData = async () => {

            if (!userId) {

                setLoading(false);

                return;

            }


            try {

                setLoading(true);

                setError("");


                const response =
                    await fetch(
                        `http://localhost:5000/api/transactions/summary/${userId}`
                    );


                const data =
                    await response.json();


                if (response.ok) {

                    setBalance(
                        Number(
                            data.balance || 0
                        )
                    );


                    setTotalIncome(
                        Number(
                            data.totalIncome || 0
                        )
                    );


                    setTotalExpenses(
                        Number(
                            data.totalExpenses || 0
                        )
                    );


                    setRecentTransactions(
                        data.recentTransactions || []
                    );


                    setUser((currentUser) => {

                        if (!currentUser) {

                            return currentUser;

                        }


                        const updatedUser = {

                            ...currentUser,

                            balance:
                                data.balance

                        };


                        localStorage.setItem(
                            "user",
                            JSON.stringify(
                                updatedUser
                            )
                        );


                        return updatedUser;

                    });

                } else {

                    setError(
                        data.message ||
                        "Unable to load dashboard."
                    );

                }

            } catch (error) {

                console.error(
                    "Dashboard Error:",
                    error
                );


                setError(
                    "Unable to connect to server."
                );

            } finally {

                setLoading(false);

            }

        };


        // =================================================
        // FETCH UNREAD NOTIFICATIONS
        // =================================================

        const fetchUnreadNotifications = async () => {

            try {

                const token =
                    localStorage.getItem("token");


                if (!token) {

                    return;

                }


                const response =
                    await fetch(
                        "http://localhost:5000/api/notifications/unread-count",
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


                if (response.ok) {

                    setUnreadNotifications(
                        Number(
                            data.unreadCount || 0
                        )
                    );

                }

            } catch (error) {

                console.error(
                    "Unread Notification Error:",
                    error
                );

            }

        };


        fetchDashboardData();

        fetchUnreadNotifications();

    }, [userId, navigate]);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );


        navigate("/");

    };


    // =====================================================
    // SETTINGS
    // =====================================================

    const handleSettings = () => {

        alert(
            "Settings feature will be added next."
        );

    };


    // =====================================================
    // FORMAT MONEY
    // =====================================================

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


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {

            return "";

        }


        return new Date(
            date
        ).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    };


    // =====================================================
    // TRANSACTION TYPE
    // =====================================================

    const getTransactionType = (type) => {

        if (type === "deposit") {

            return "Deposit";

        }


        if (type === "withdraw") {

            return "Withdrawal";

        }


        if (type === "transfer") {

            return "Transfer";

        }


        if (type === "bill") {

            return "Bill Payment";

        }


        return type;

    };


    // =====================================================
    // TRANSACTION ICON
    // =====================================================

    const getTransactionIcon = (type) => {

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
    // CHECK DEBIT TRANSACTION
    // =====================================================

    const isDebit = (type) => {

        return (
            type === "withdraw" ||
            type === "transfer" ||
            type === "bill"
        );

    };


    // =====================================================
    // NAVIGATION ITEMS
    // =====================================================

    const navigationItems = [

        {
            label: "Dashboard",
            icon: "▦",
            path: "/dashboard",
            active: true
        },

        {
            label: "Accounts",
            icon: "▣",
            path: "/account"
        },

        {
            label: "Send Money",
            icon: "↗",
            path: "/send-money"
        },

        {
            label: "Transactions",
            icon: "↔",
            path: "/transactions"
        },

        {
            label: "Bill Payments",
            icon: "₹",
            path: "/bill-payment"
        },

        {
            label: "Account Statement",
            icon: "▤",
            path: "/statement"
        },

        {
            label: "Financial Analytics",
            icon: "◫",
            path: "/analytics"
        },

        {
            label: "My Profile",
            icon: "◉",
            path: "/profile"
        },

        {
            label: "Customer Support",
            icon: "?",
            path: "/support"
        }

    ];


    // =====================================================
    // QUICK ACTION ITEMS
    // =====================================================

    const quickActions = [

        {
            title: "Send Money",
            description: "Transfer funds",
            icon: "↗",
            path: "/send-money"
        },

        {
            title: "Deposit",
            description: "Add money",
            icon: "+",
            path: "/deposit"
        },

        {
            title: "Withdraw",
            description: "Take out money",
            icon: "−",
            path: "/withdraw"
        },

        {
            title: "Bill Payment",
            description: "Pay your bills",
            icon: "₹",
            path: "/bill-payment"
        },

        {
            title: "Statement",
            description: "View statement",
            icon: "▤",
            path: "/statement"
        },

        {
            title: "Analytics",
            description: "View insights",
            icon: "◫",
            path: "/analytics"
        }

    ];


    // =====================================================
    // LOGIN CHECK
    // =====================================================

    if (!user) {

        return (

            <div className="dashboard-login-required">

                <div className="dashboard-login-box">

                    <div className="dashboard-login-icon">
                        🔐
                    </div>

                    <h2>
                        Please login first
                    </h2>

                    <p>
                        Sign in to your BankEase account
                        to access your dashboard.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Go to Login
                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="dashboard-page">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="dashboard-sidebar">


                {/* BRAND */}

                <div className="dashboard-brand">

                    <div className="dashboard-brand-icon">

                        <div className="dashboard-bank-roof">
                        </div>

                        <div className="dashboard-bank-building">

                            <span></span>
                            <span></span>
                            <span></span>

                        </div>

                    </div>


                    <div>

                        <h2>
                            Bank<span>Ease</span>
                        </h2>

                        <p>
                            Digital Banking
                        </p>

                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="dashboard-navigation">

                    <div className="dashboard-nav-label">
                        MAIN MENU
                    </div>


                    {navigationItems.map(
                        (item) => (

                            <button
                                key={item.label}
                                className={
                                    item.active
                                        ? "dashboard-nav-item active"
                                        : "dashboard-nav-item"
                                }
                                onClick={() =>
                                    navigate(
                                        item.path
                                    )
                                }
                            >

                                <span className="dashboard-nav-icon">
                                    {item.icon}
                                </span>

                                <span>
                                    {item.label}
                                </span>

                            </button>

                        )
                    )}

                </nav>


                {/* SIDEBAR BOTTOM */}

                <div className="dashboard-sidebar-bottom">

                    <button
                        className="dashboard-bottom-item"
                        onClick={handleSettings}
                    >

                        <span>
                            ⚙
                        </span>

                        Settings

                    </button>


                    <button
                        className="dashboard-bottom-item logout"
                        onClick={handleLogout}
                    >

                        <span>
                            ↪
                        </span>

                        Logout

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="dashboard-main">


                {/* =================================================
                    TOP HEADER
                ================================================= */}

                <header className="dashboard-header">

                    <div className="dashboard-welcome">

                        <span>
                            CUSTOMER DASHBOARD
                        </span>

                        <h1>

                            Good Morning,{" "}

                            {user.name} 👋

                        </h1>

                        <p>
                            Here's your complete banking overview.
                        </p>

                    </div>


                    <div className="dashboard-header-actions">


                        {/* NOTIFICATIONS */}

                        <button
                            type="button"
                            className="dashboard-notification-button"
                            onClick={() =>
                                navigate(
                                    "/notifications"
                                )
                            }
                            title="Notifications"
                        >

                            <span>
                                🔔
                            </span>


                            {unreadNotifications > 0 && (

                                <span className="notification-badge">

                                    {unreadNotifications > 99
                                        ? "99+"
                                        : unreadNotifications}

                                </span>

                            )}

                        </button>


                        {/* PROFILE */}

                        <button
                            className="dashboard-profile-button"
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

                    </div>

                </header>


                {/* =================================================
                    ACCOUNT STRIP
                ================================================= */}

                <section className="dashboard-account-strip">


                    <div className="account-strip-item">

                        <span>
                            ACCOUNT NUMBER
                        </span>

                        <strong>
                            XXXX XXXX {user.accountNumber?.slice(-4)}
                        </strong>

                    </div>


                    <div className="account-strip-divider">
                    </div>


                    <div className="account-strip-item">

                        <span>
                            ACCOUNT TYPE
                        </span>

                        <strong>
                            Savings Account
                        </strong>

                    </div>


                    <div className="account-strip-divider">
                    </div>


                    <div className="account-strip-item">

                        <span>
                            ACCOUNT STATUS
                        </span>

                        <strong className="account-status">
                            <span></span>
                            Active
                        </strong>

                    </div>

                </section>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="dashboard-error">

                        <span>
                            !
                        </span>

                        {error}

                    </div>

                )}


                {/* =================================================
                    BALANCE CARDS
                ================================================= */}

                <section className="dashboard-balance-grid">


                    {/* TOTAL BALANCE */}

                    <div className="dashboard-balance-card primary">

                        <div className="balance-card-top">

                            <div>

                                <span className="balance-card-label">
                                    Total Balance
                                </span>

                                <h2>

                                    ₹
                                    {loading
                                        ? "..."
                                        : formatMoney(
                                            balance
                                        )}

                                </h2>

                            </div>


                            <div className="balance-card-icon">
                                ₹
                            </div>

                        </div>


                        <div className="balance-card-footer">

                            <span>
                                Available account balance
                            </span>

                            <span className="balance-status-dot">
                                ●
                            </span>

                        </div>

                    </div>


                    {/* INCOME */}

                    <div className="dashboard-balance-card">

                        <div className="balance-card-top">

                            <div>

                                <span className="balance-card-label">
                                    Total Income
                                </span>

                                <h2>

                                    ₹
                                    {loading
                                        ? "..."
                                        : formatMoney(
                                            totalIncome
                                        )}

                                </h2>

                            </div>


                            <div className="balance-card-icon income">
                                ↑
                            </div>

                        </div>


                        <div className="balance-card-footer">

                            <span className="positive">
                                Money received
                            </span>

                        </div>

                    </div>


                    {/* EXPENSES */}

                    <div className="dashboard-balance-card">

                        <div className="balance-card-top">

                            <div>

                                <span className="balance-card-label">
                                    Total Expenses
                                </span>

                                <h2>

                                    ₹
                                    {loading
                                        ? "..."
                                        : formatMoney(
                                            totalExpenses
                                        )}

                                </h2>

                            </div>


                            <div className="balance-card-icon expense">
                                ↓
                            </div>

                        </div>


                        <div className="balance-card-footer">

                            <span className="negative">
                                Money spent
                            </span>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <section className="dashboard-section">

                    <div className="dashboard-section-heading">

                        <div>

                            <h2>
                                Quick Actions
                            </h2>

                            <p>
                                Manage your money easily
                            </p>

                        </div>

                    </div>


                    <div className="dashboard-quick-actions">

                        {quickActions.map(
                            (action) => (

                                <button
                                    key={action.title}
                                    className="dashboard-quick-action"
                                    onClick={() =>
                                        navigate(
                                            action.path
                                        )
                                    }
                                >

                                    <div className="quick-action-icon">
                                        {action.icon}
                                    </div>

                                    <div className="quick-action-content">

                                        <strong>
                                            {action.title}
                                        </strong>

                                        <span>
                                            {action.description}
                                        </span>

                                    </div>

                                    <span className="quick-action-arrow">
                                        →
                                    </span>

                                </button>

                            )
                        )}

                    </div>

                </section>


                {/* =================================================
                    ANALYTICS BANNER
                ================================================= */}

                <section className="dashboard-analytics-banner">


                    <div className="analytics-banner-left">

                        <div className="analytics-banner-icon">
                            ◫
                        </div>


                        <div>

                            <span>
                                FINANCIAL INSIGHTS
                            </span>

                            <h2>
                                Understand your finances
                            </h2>

                            <p>
                                View income, expenses, transfers
                                and spending insights.
                            </p>

                        </div>

                    </div>


                    <button
                        onClick={() =>
                            navigate(
                                "/analytics"
                            )
                        }
                    >

                        View Analytics

                        <span>
                            →
                        </span>

                    </button>

                </section>


                {/* =================================================
                    BOTTOM GRID
                ================================================= */}

                <section className="dashboard-bottom-grid">


                    {/* =================================================
                        RECENT TRANSACTIONS
                    ================================================= */}

                    <div className="dashboard-transactions-card">


                        <div className="dashboard-card-heading">

                            <div>

                                <span>
                                    ACTIVITY
                                </span>

                                <h2>
                                    Recent Transactions
                                </h2>

                            </div>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/transactions"
                                    )
                                }
                            >
                                View All →
                            </button>

                        </div>


                        {loading ? (

                            <div className="dashboard-empty-state">

                                <div className="empty-state-icon">
                                    ◌
                                </div>

                                <h3>
                                    Loading transactions...
                                </h3>

                                <p>
                                    Please wait
                                </p>

                            </div>

                        ) : recentTransactions.length === 0 ? (

                            <div className="dashboard-empty-state">

                                <div className="empty-state-icon">
                                    $
                                </div>

                                <h3>
                                    No transactions yet
                                </h3>

                                <p>
                                    Your recent transactions
                                    will appear here.
                                </p>

                            </div>

                        ) : (

                            <div className="dashboard-transaction-list">

                                {recentTransactions.map(
                                    (transaction) => {

                                        const debit =
                                            isDebit(
                                                transaction.type
                                            );


                                        return (

                                            <div
                                                key={
                                                    transaction.transactionId
                                                }
                                                className="dashboard-transaction-item"
                                            >


                                                <div className="transaction-main">


                                                    <div
                                                        className={
                                                            debit
                                                                ? "transaction-icon debit"
                                                                : "transaction-icon credit"
                                                        }
                                                    >

                                                        {getTransactionIcon(
                                                            transaction.type
                                                        )}

                                                    </div>


                                                    <div className="transaction-details">

                                                        <strong>
                                                            {
                                                                getTransactionType(
                                                                    transaction.type
                                                                )
                                                            }
                                                        </strong>


                                                        <span>
                                                            {
                                                                transaction.description
                                                            }
                                                        </span>


                                                        <small>
                                                            {
                                                                formatDate(
                                                                    transaction.date ||
                                                                    transaction.createdAt
                                                                )
                                                            }
                                                        </small>

                                                    </div>

                                                </div>


                                                <div className="transaction-amount">


                                                    <strong
                                                        className={
                                                            debit
                                                                ? "debit-text"
                                                                : "credit-text"
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


                                                    <span className="transaction-status">
                                                        {transaction.status}
                                                    </span>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        ACCOUNT SUMMARY
                    ================================================= */}

                    <div className="dashboard-summary-card">


                        <div className="dashboard-card-heading">

                            <div>

                                <span>
                                    ACCOUNT
                                </span>

                                <h2>
                                    Account Summary
                                </h2>

                            </div>

                        </div>


                        <div className="dashboard-summary-list">


                            <div className="dashboard-summary-item">

                                <span>
                                    Customer Name
                                </span>

                                <strong>
                                    {user.name}
                                </strong>

                            </div>


                            <div className="dashboard-summary-item">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {user.email}
                                </strong>

                            </div>


                            <div className="dashboard-summary-item">

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {user.phone ||
                                        "Not available"}
                                </strong>

                            </div>


                            <div className="dashboard-summary-item">

                                <span>
                                    Account Number
                                </span>

                                <strong>
                                    {user.accountNumber}
                                </strong>

                            </div>


                            <div className="dashboard-summary-item balance">

                                <span>
                                    Current Balance
                                </span>

                                <strong>
                                    ₹
                                    {formatMoney(
                                        balance
                                    )}
                                </strong>

                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="dashboard-summary-actions">


                            <button
                                className="summary-action primary"
                                onClick={() =>
                                    navigate(
                                        "/profile"
                                    )
                                }
                            >

                                View Profile

                            </button>


                            <button
                                className="summary-action secondary"
                                onClick={() =>
                                    navigate(
                                        "/statement"
                                    )
                                }
                            >

                                Account Statement

                            </button>


                            <button
                                className="summary-action analytics"
                                onClick={() =>
                                    navigate(
                                        "/analytics"
                                    )
                                }
                            >

                                Financial Analytics

                            </button>


                            <button
                                className="summary-action bill"
                                onClick={() =>
                                    navigate(
                                        "/bill-payment"
                                    )
                                }
                            >

                                Pay Bills

                            </button>

                        </div>

                    </div>

                </section>

            </main>

        </div>

    );

}

export default Dashboard;