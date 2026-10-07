import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "./Notifications.css";


function Notifications() {

    const navigate = useNavigate();


    // =========================================
    // STATES
    // =========================================

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState("");


    const token =
        localStorage.getItem("token");


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
    // FETCH NOTIFICATIONS
    // =========================================

    const fetchNotifications =
        useCallback(
            async () => {

                setLoading(true);

                setMessage("");


                try {

                    if (!token) {

                        handleSessionExpired();

                        return;

                    }


                    const response =
                        await fetch(
                            "http://localhost:5000/api/notifications",
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


                    // ---------------------------------
                    // SESSION EXPIRED
                    // ---------------------------------

                    if (
                        response.status === 401
                    ) {

                        handleSessionExpired();

                        return;

                    }


                    // ---------------------------------
                    // ERROR
                    // ---------------------------------

                    if (!response.ok) {

                        setMessage(
                            data.message ||
                            "Unable to load notifications"
                        );

                        return;

                    }


                    // ---------------------------------
                    // SUCCESS
                    // ---------------------------------

                    setNotifications(
                        data.notifications || []
                    );


                } catch (error) {

                    console.error(
                        "Fetch Notifications Error:",
                        error
                    );

                    setMessage(
                        "Unable to connect to server"
                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                token,
                handleSessionExpired
            ]
        );


    // =========================================
    // LOAD NOTIFICATIONS
    // =========================================

    useEffect(() => {

        fetchNotifications();

    }, [fetchNotifications]);


    // =========================================
    // MARK ONE AS READ
    // =========================================

    const markAsRead = async (id) => {

        setActionLoading(
            `read-${id}`
        );

        setMessage("");


        try {

            if (!token) {

                handleSessionExpired();

                return;

            }


            const response =
                await fetch(
                    `http://localhost:5000/api/notifications/${id}/read`,
                    {
                        method: "PUT",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            if (
                response.status === 401
            ) {

                handleSessionExpired();

                return;

            }


            if (response.ok) {

                setNotifications(
                    (previousNotifications) =>

                        previousNotifications.map(
                            (notification) =>

                                notification._id === id
                                    ? {
                                        ...notification,
                                        isRead: true
                                    }
                                    : notification
                        )
                );

            } else {

                const data =
                    await response.json();

                setMessage(
                    data.message ||
                    "Unable to mark notification as read"
                );

            }

        } catch (error) {

            console.error(
                "Mark Read Error:",
                error
            );

            setMessage(
                "Unable to update notification"
            );

        } finally {

            setActionLoading("");

        }

    };


    // =========================================
    // MARK ALL AS READ
    // =========================================

    const markAllAsRead = async () => {

        if (unreadCount === 0) {
            return;
        }


        setActionLoading(
            "read-all"
        );

        setMessage("");


        try {

            if (!token) {

                handleSessionExpired();

                return;

            }


            const response =
                await fetch(
                    "http://localhost:5000/api/notifications/read-all",
                    {
                        method: "PUT",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            if (
                response.status === 401
            ) {

                handleSessionExpired();

                return;

            }


            if (response.ok) {

                setNotifications(
                    (previousNotifications) =>

                        previousNotifications.map(
                            (notification) => ({
                                ...notification,
                                isRead: true
                            })
                        )
                );

            } else {

                const data =
                    await response.json();

                setMessage(
                    data.message ||
                    "Unable to mark all notifications as read"
                );

            }

        } catch (error) {

            console.error(
                "Mark All Read Error:",
                error
            );

            setMessage(
                "Unable to update notifications"
            );

        } finally {

            setActionLoading("");

        }

    };


    // =========================================
    // DELETE NOTIFICATION
    // =========================================

    const deleteNotification =
        async (id) => {

            setActionLoading(
                `delete-${id}`
            );

            setMessage("");


            try {

                if (!token) {

                    handleSessionExpired();

                    return;

                }


                const response =
                    await fetch(
                        `http://localhost:5000/api/notifications/${id}`,
                        {
                            method: "DELETE",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                if (
                    response.status === 401
                ) {

                    handleSessionExpired();

                    return;

                }


                if (response.ok) {

                    setNotifications(
                        (previousNotifications) =>

                            previousNotifications.filter(
                                (notification) =>
                                    notification._id !== id
                            )
                    );

                } else {

                    const data =
                        await response.json();

                    setMessage(
                        data.message ||
                        "Unable to delete notification"
                    );

                }

            } catch (error) {

                console.error(
                    "Delete Notification Error:",
                    error
                );

                setMessage(
                    "Unable to delete notification"
                );

            } finally {

                setActionLoading("");

            }

        };


    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {

        if (!date) {
            return "Date unavailable";
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


    // =========================================
    // NOTIFICATION ICON
    // =========================================

    const getNotificationIcon = (type) => {

        switch (type) {

            case "deposit":
                return "💰";

            case "withdraw":
                return "💸";

            case "transfer":
                return "↗";

            case "bill":
                return "🧾";

            case "security":
                return "🔐";

            case "transaction":
                return "💳";

            case "general":
                return "📢";

            default:
                return "🔔";

        }

    };


    // =========================================
    // NOTIFICATION LABEL
    // =========================================

    const getNotificationLabel =
        (type) => {

            switch (type) {

                case "deposit":
                    return "Deposit";

                case "withdraw":
                    return "Withdrawal";

                case "transfer":
                    return "Transfer";

                case "bill":
                    return "Bill Payment";

                case "security":
                    return "Security";

                case "transaction":
                    return "Transaction";

                case "general":
                    return "General";

                default:
                    return "Notification";

            }

        };


    // =========================================
    // COUNTS
    // =========================================

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.isRead
        ).length;


    const readCount =
        notifications.length -
        unreadCount;


    // =========================================
    // LOADING SCREEN
    // =========================================

    if (loading) {

        return (

            <div className="notifications-page">

                <div className="notifications-wrapper">

                    <div className="notifications-loading-card">

                        <div className="notifications-loading-spinner">
                        </div>

                        <h2>
                            Loading Notifications
                        </h2>

                        <p>
                            Please wait while we fetch
                            your latest updates.
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // =========================================
    // MAIN UI
    // =========================================

    return (

        <div className="notifications-page">

            <div className="notifications-wrapper">


                {/* =====================================
                    TOP BAR
                ===================================== */}

                <div className="notifications-topbar">

                    <button
                        className="notifications-back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>


                    <div className="notifications-page-label">
                        ACCOUNT NOTIFICATIONS
                    </div>

                </div>


                {/* =====================================
                    PAGE HEADER
                ===================================== */}

                <div className="notifications-page-header">

                    <div>

                        <p className="notifications-eyebrow">
                            UPDATES & ALERTS
                        </p>

                        <h1>
                            Notifications
                        </h1>

                        <p>
                            Stay informed about your
                            BankEase account activity.
                        </p>

                    </div>


                    <div className="notifications-header-badge">

                        <span>
                            {unreadCount}
                        </span>

                        Unread

                    </div>

                </div>


                {/* =====================================
                    SUMMARY
                ===================================== */}

                <div className="notifications-summary">

                    <div className="notification-summary-card">

                        <div className="notification-summary-icon total">
                            🔔
                        </div>

                        <div>

                            <span>
                                Total
                            </span>

                            <strong>
                                {notifications.length}
                            </strong>

                        </div>

                    </div>


                    <div className="notification-summary-card">

                        <div className="notification-summary-icon unread">
                            ●
                        </div>

                        <div>

                            <span>
                                Unread
                            </span>

                            <strong>
                                {unreadCount}
                            </strong>

                        </div>

                    </div>


                    <div className="notification-summary-card">

                        <div className="notification-summary-icon read">
                            ✓
                        </div>

                        <div>

                            <span>
                                Read
                            </span>

                            <strong>
                                {readCount}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    ACTION BAR
                ===================================== */}

                <div className="notifications-action-bar">

                    <div>

                        <h2>
                            Recent Notifications
                        </h2>

                        <p>
                            Your latest account updates
                            and alerts.
                        </p>

                    </div>


                    <div className="notifications-actions">

                        <button
                            type="button"
                            className="notifications-mark-all-button"
                            onClick={
                                markAllAsRead
                            }
                            disabled={
                                unreadCount === 0 ||
                                actionLoading === "read-all"
                            }
                        >

                            {actionLoading === "read-all"
                                ? "Updating..."
                                : "Mark All as Read"}

                        </button>


                        <button
                            type="button"
                            className="notifications-refresh-button"
                            onClick={
                                fetchNotifications
                            }
                        >
                            ↻ Refresh
                        </button>

                    </div>

                </div>


                {/* =====================================
                    MESSAGE
                ===================================== */}

                {message && (

                    <div className="notifications-message">

                        <span>
                            !
                        </span>

                        <p>
                            {message}
                        </p>

                    </div>

                )}


                {/* =====================================
                    EMPTY STATE
                ===================================== */}

                {notifications.length === 0 ? (

                    <div className="notifications-empty-card">

                        <div className="notifications-empty-icon">
                            🔔
                        </div>

                        <h2>
                            No Notifications Yet
                        </h2>

                        <p>
                            You don't have any notifications
                            at the moment.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            Back to Dashboard
                        </button>

                    </div>

                ) : (

                    /* =================================
                       NOTIFICATION LIST
                    ================================= */

                    <div className="notifications-list">

                        {notifications.map(
                            (notification) => {

                                const read =
                                    notification.isRead;

                                const currentReadAction =
                                    actionLoading ===
                                    `read-${notification._id}`;

                                const currentDeleteAction =
                                    actionLoading ===
                                    `delete-${notification._id}`;


                                return (

                                    <div
                                        key={
                                            notification._id
                                        }
                                        className={
                                            read
                                                ? "notification-item read"
                                                : "notification-item unread"
                                        }
                                    >

                                        {/* ICON */}

                                        <div className="notification-icon">

                                            {
                                                getNotificationIcon(
                                                    notification.type
                                                )
                                            }

                                        </div>


                                        {/* CONTENT */}

                                        <div className="notification-content">

                                            <div className="notification-title-row">

                                                <div>

                                                    <h3>
                                                        {
                                                            notification.title
                                                        }
                                                    </h3>

                                                    <span className="notification-type">

                                                        {
                                                            getNotificationLabel(
                                                                notification.type
                                                            )
                                                        }

                                                    </span>

                                                </div>


                                                {!read && (

                                                    <span className="notification-new-badge">
                                                        New
                                                    </span>

                                                )}

                                            </div>


                                            <p className="notification-message-text">
                                                {
                                                    notification.message
                                                }
                                            </p>


                                            <span className="notification-date">

                                                {
                                                    formatDate(
                                                        notification.createdAt
                                                    )
                                                }

                                            </span>

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="notification-item-actions">

                                            {!read && (

                                                <button
                                                    type="button"
                                                    className="notification-read-button"
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification._id
                                                        )
                                                    }
                                                    disabled={
                                                        currentReadAction ||
                                                        currentDeleteAction
                                                    }
                                                >

                                                    {currentReadAction
                                                        ? "Updating..."
                                                        : "Mark Read"}

                                                </button>

                                            )}


                                            <button
                                                type="button"
                                                className="notification-delete-button"
                                                onClick={() =>
                                                    deleteNotification(
                                                        notification._id
                                                    )
                                                }
                                                disabled={
                                                    currentReadAction ||
                                                    currentDeleteAction
                                                }
                                            >

                                                {currentDeleteAction
                                                    ? "Deleting..."
                                                    : "Delete"}

                                            </button>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}


                {/* =====================================
                    SECURITY NOTE
                ===================================== */}

                <div className="notifications-security-note">

                    <div className="notifications-security-icon">
                        🔒
                    </div>

                    <div>

                        <strong>
                            Stay secure
                        </strong>

                        <p>
                            Never share your password,
                            OTP or confidential banking
                            information with anyone.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Notifications;