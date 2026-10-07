import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

import "./Analytics.css";


function Analytics() {

    const navigate = useNavigate();


    // =========================================
    // STATES
    // =========================================

    const [transactions, setTransactions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


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
    // FETCH ANALYTICS DATA
    // =========================================

    const fetchAnalytics =
        useCallback(
            async () => {

                setLoading(true);

                setError("");


                try {

                    const token =
                        localStorage.getItem("token");


                    if (!token) {

                        handleSessionExpired();

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


                    // =================================
                    // SESSION EXPIRED
                    // =================================

                    if (
                        response.status === 401
                    ) {

                        handleSessionExpired();

                        return;

                    }


                    // =================================
                    // ERROR
                    // =================================

                    if (!response.ok) {

                        setError(
                            data.message ||
                            "Unable to load analytics"
                        );

                        return;

                    }


                    // =================================
                    // SUCCESS
                    // =================================

                    setTransactions(
                        data.transactions || []
                    );


                } catch (error) {

                    console.error(
                        "Analytics Error:",
                        error
                    );

                    setError(
                        "Unable to connect to server"
                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                handleSessionExpired
            ]
        );


    // =========================================
    // LOAD DATA
    // =========================================

    useEffect(() => {

        fetchAnalytics();

    }, [fetchAnalytics]);


    // =========================================
    // SUCCESSFUL TRANSACTIONS
    // =========================================

    const successfulTransactions =
        useMemo(() => {

            return transactions.filter(
                (item) =>
                    item.status === "success"
            );

        }, [transactions]);


    // =========================================
    // INCOME
    // =========================================

    const income =
        useMemo(() => {

            return successfulTransactions
                .filter(
                    (item) =>
                        item.type === "deposit"
                )
                .reduce(
                    (total, item) =>
                        total +
                        Number(
                            item.amount || 0
                        ),
                    0
                );

        }, [successfulTransactions]);


    // =========================================
    // EXPENSES
    // =========================================

    const expenseTransactions =
        useMemo(() => {

            return successfulTransactions.filter(
                (item) =>
                    item.type === "withdraw" ||
                    item.type === "bill"
            );

        }, [successfulTransactions]);


    const expenses =
        useMemo(() => {

            return expenseTransactions
                .reduce(
                    (total, item) =>
                        total +
                        Number(
                            item.amount || 0
                        ),
                    0
                );

        }, [expenseTransactions]);


    // =========================================
    // TRANSFERS
    // =========================================

    const transfers =
        useMemo(() => {

            return successfulTransactions
                .filter(
                    (item) =>
                        item.type ===
                        "transfer"
                )
                .reduce(
                    (total, item) =>
                        total +
                        Number(
                            item.amount || 0
                        ),
                    0
                );

        }, [successfulTransactions]);


    // =========================================
    // NET POSITION
    // =========================================

    const netAmount =
        income - expenses;


    // =========================================
    // SPENDING DATA
    // =========================================

    const spendingData =
        useMemo(() => {

            const withdrawals =
                successfulTransactions
                    .filter(
                        (item) =>
                            item.type ===
                            "withdraw"
                    )
                    .reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item.amount || 0
                            ),
                        0
                    );


            const billPayments =
                successfulTransactions
                    .filter(
                        (item) =>
                            item.type ===
                            "bill"
                    )
                    .reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item.amount || 0
                            ),
                        0
                    );


            return [

                {
                    name: "Withdrawals",
                    value: withdrawals
                },

                {
                    name: "Bill Payments",
                    value: billPayments
                },

                {
                    name: "Transfers",
                    value: transfers
                }

            ].filter(
                (item) =>
                    item.value > 0
            );

        }, [
            successfulTransactions,
            transfers
        ]);


    // =========================================
    // ACTIVITY DATA
    // =========================================

    const activityData = useMemo(() => {

        return [

            {
                name: "Income",
                amount: income
            },

            {
                name: "Expenses",
                amount: expenses
            },

            {
                name: "Transfers",
                amount: transfers
            }

        ];

    }, [
        income,
        expenses,
        transfers
    ]);


    // =========================================
    // AVERAGE EXPENSE
    // =========================================

    const averageExpense =
        expenseTransactions.length > 0
            ? Math.round(
                expenses /
                expenseTransactions.length
            )
            : 0;


    // =========================================
    // FORMATTING
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


    const formatCompactMoney = (amount) => {

        return Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 0
            }
        );

    };


    // =========================================
    // CHART COLORS
    // =========================================

    const spendingColors = [
        "#2563eb",
        "#ef4444",
        "#f59e0b"
    ];


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="analytics-page">

                <div className="analytics-wrapper">

                    <div className="analytics-loading-card">

                        <div className="analytics-loading-spinner">
                        </div>

                        <h2>
                            Loading Financial Analytics
                        </h2>

                        <p>
                            Please wait while we analyze
                            your banking activity.
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="analytics-page">

            <div className="analytics-wrapper">


                {/* =====================================
                    TOP BAR
                ===================================== */}

                <div className="analytics-topbar">

                    <button
                        className="analytics-back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>


                    <div className="analytics-page-label">
                        FINANCIAL ANALYTICS
                    </div>

                </div>


                {/* =====================================
                    PAGE HEADER
                ===================================== */}

                <div className="analytics-page-header">

                    <div>

                        <p className="analytics-eyebrow">
                            FINANCIAL OVERVIEW
                        </p>

                        <h1>
                            Financial Analytics
                        </h1>

                        <p>
                            Understand your income, expenses
                            and overall banking activity.
                        </p>

                    </div>


                    <button
                        className="analytics-refresh-button"
                        onClick={
                            fetchAnalytics
                        }
                    >
                        ↻ Refresh
                    </button>

                </div>


                {/* =====================================
                    ERROR
                ===================================== */}

                {error && (

                    <div className="analytics-message">

                        <span>
                            !
                        </span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* =====================================
                    SUMMARY CARDS
                ===================================== */}

                <div className="analytics-summary">


                    {/* INCOME */}

                    <div className="analytics-summary-card">

                        <div className="analytics-summary-icon income">
                            ↑
                        </div>

                        <div>

                            <span>
                                Total Income
                            </span>

                            <strong>
                                ₹
                                {formatMoney(
                                    income
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* EXPENSES */}

                    <div className="analytics-summary-card">

                        <div className="analytics-summary-icon expense">
                            ↓
                        </div>

                        <div>

                            <span>
                                Total Expenses
                            </span>

                            <strong>
                                ₹
                                {formatMoney(
                                    expenses
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* TRANSFERS */}

                    <div className="analytics-summary-card">

                        <div className="analytics-summary-icon transfer">
                            ↔
                        </div>

                        <div>

                            <span>
                                Transfers
                            </span>

                            <strong>
                                ₹
                                {formatMoney(
                                    transfers
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* NET */}

                    <div className="analytics-summary-card">

                        <div className="analytics-summary-icon net">
                            ₹
                        </div>

                        <div>

                            <span>
                                Net Position
                            </span>

                            <strong
                                className={
                                    netAmount >= 0
                                        ? "positive"
                                        : "negative"
                                }
                            >
                                ₹
                                {formatMoney(
                                    netAmount
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    CHART GRID
                ===================================== */}

                <div className="analytics-chart-grid">


                    {/* =================================
                        SPENDING BREAKDOWN
                    ================================= */}

                    <div className="analytics-card">

                        <div className="analytics-card-header">

                            <div>

                                <h2>
                                    Spending Breakdown
                                </h2>

                                <p>
                                    Where your money is going
                                </p>

                            </div>

                            <span className="analytics-card-tag">
                                Spending
                            </span>

                        </div>


                        {spendingData.length === 0 ? (

                            <div className="analytics-empty">

                                <div className="analytics-empty-icon">
                                    📊
                                </div>

                                <h3>
                                    No Spending Data
                                </h3>

                                <p>
                                    Completed expense transactions
                                    will appear here.
                                </p>

                            </div>

                        ) : (

                            <div className="analytics-pie-section">

                                <div className="analytics-pie-chart">

                                    <ResponsiveContainer
                                        width="100%"
                                        height={290}
                                    >

                                        <PieChart>

                                            <Pie
                                                data={
                                                    spendingData
                                                }
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={58}
                                                outerRadius={100}
                                                paddingAngle={3}
                                            >

                                                {spendingData.map(
                                                    (
                                                        entry,
                                                        index
                                                    ) => (

                                                        <Cell
                                                            key={
                                                                entry.name
                                                            }
                                                            fill={
                                                                spendingColors[
                                                                    index %
                                                                    spendingColors.length
                                                                ]
                                                            }
                                                        />

                                                    )
                                                )}

                                            </Pie>

                                            <Tooltip
                                                formatter={
                                                    (
                                                        value
                                                    ) =>
                                                        `₹${formatCompactMoney(
                                                            value
                                                        )}`
                                                }
                                            />

                                        </PieChart>

                                    </ResponsiveContainer>

                                </div>


                                <div className="analytics-legend">

                                    {spendingData.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    item.name
                                                }
                                                className="analytics-legend-item"
                                            >

                                                <span
                                                    style={{
                                                        background:
                                                            spendingColors[
                                                                index %
                                                                spendingColors.length
                                                            ]
                                                    }}
                                                >
                                                </span>

                                                <div>

                                                    <strong>
                                                        {
                                                            item.name
                                                        }
                                                    </strong>

                                                    <small>
                                                        ₹
                                                        {formatCompactMoney(
                                                            item.value
                                                        )}
                                                    </small>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    {/* =================================
                        FINANCIAL ACTIVITY
                    ================================= */}

                    <div className="analytics-card">

                        <div className="analytics-card-header">

                            <div>

                                <h2>
                                    Financial Activity
                                </h2>

                                <p>
                                    Overall transaction amounts
                                </p>

                            </div>

                            <span className="analytics-card-tag">
                                Activity
                            </span>

                        </div>


                        <div className="analytics-bar-chart">

                            <ResponsiveContainer
                                width="100%"
                                height={320}
                            >

                                <BarChart
                                    data={
                                        activityData
                                    }
                                    margin={{
                                        top: 20,
                                        right: 10,
                                        left: 5,
                                        bottom: 5
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="name"
                                    />

                                    <YAxis />

                                    <Tooltip
                                        formatter={
                                            (
                                                value
                                            ) =>
                                                `₹${formatCompactMoney(
                                                    value
                                                )}`
                                        }
                                    />

                                    <Bar
                                        dataKey="amount"
                                        fill="#2563eb"
                                        radius={
                                            [
                                                7,
                                                7,
                                                0,
                                                0
                                            ]
                                        }
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    FINANCIAL SUMMARY
                ===================================== */}

                <div className="analytics-card analytics-insights-card">

                    <div className="analytics-card-header">

                        <div>

                            <h2>
                                Financial Summary
                            </h2>

                            <p>
                                Quick overview of your
                                banking performance.
                            </p>

                        </div>

                    </div>


                    <div className="analytics-insight-grid">


                        {/* SUCCESSFUL */}

                        <div className="analytics-insight-item">

                            <span>
                                Successful Transactions
                            </span>

                            <strong>
                                {
                                    successfulTransactions.length
                                }
                            </strong>

                        </div>


                        {/* AVG EXPENSE */}

                        <div className="analytics-insight-item">

                            <span>
                                Average Expense
                            </span>

                            <strong>
                                ₹
                                {formatMoney(
                                    averageExpense
                                )}
                            </strong>

                        </div>


                        {/* TOTAL COUNT */}

                        <div className="analytics-insight-item">

                            <span>
                                Transaction Count
                            </span>

                            <strong>
                                {transactions.length}
                            </strong>

                        </div>


                        {/* POSITION */}

                        <div className="analytics-insight-item">

                            <span>
                                Savings Position
                            </span>

                            <strong
                                className={
                                    netAmount >= 0
                                        ? "positive"
                                        : "negative"
                                }
                            >
                                {netAmount >= 0
                                    ? "Positive"
                                    : "Negative"}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    QUICK INSIGHTS
                ===================================== */}

                <div className="analytics-insight-banner">

                    <div className="analytics-insight-banner-icon">
                        💡
                    </div>

                    <div>

                        <strong>
                            Financial Insight
                        </strong>

                        <p>
                            {transactions.length === 0

                                ? "Once you complete transactions, your financial activity will appear in this analytics dashboard."

                                : netAmount >= 0

                                    ? "Your completed income currently exceeds your recorded withdrawals and bill payments."

                                    : "Your recorded withdrawals and bill payments currently exceed your completed income."

                            }
                        </p>

                    </div>

                </div>


                {/* =====================================
                    SECURITY NOTE
                ===================================== */}

                <div className="analytics-security-note">

                    <div className="analytics-security-icon">
                        🔒
                    </div>

                    <div>

                        <strong>
                            Your financial data is private
                        </strong>

                        <p>
                            Analytics are generated from your
                            authenticated BankEase transactions.
                        </p>

                    </div>

                </div>


                {/* =====================================
                    FOOTER
                ===================================== */}

                <div className="analytics-footer">

                    <span>
                        BankEase • Smart Financial Insights
                    </span>

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Analytics;