import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import AdminSidebar from "./components/AdminSidebar";

import "./AdminSupport.css";


function AdminSupport() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [tickets, setTickets] =
        useState([]);

    const [summary, setSummary] =
        useState({
            totalTickets: 0,
            openTickets: 0,
            inProgressTickets: 0,
            resolvedTickets: 0
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [categoryFilter, setCategoryFilter] =
        useState("All");


    // =====================================================
    // MODAL STATE
    // =====================================================

    const [selectedTicket, setSelectedTicket] =
        useState(null);

    const [updateStatus, setUpdateStatus] =
        useState("Open");

    const [adminResponse, setAdminResponse] =
        useState("");

    const [updating, setUpdating] =
        useState(false);


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
    // FETCH SUPPORT TICKETS
    // =====================================================

    const fetchTickets =
        useCallback(async () => {

            try {

                setError("");


                const token =
                    localStorage.getItem("token");

                const userString =
                    localStorage.getItem("user");


                if (!token || !userString) {

                    handleAdminSessionExpired();

                    return;

                }


                let user;

                try {

                    user =
                        JSON.parse(userString);

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
                        "http://localhost:5000/api/admin/support",
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
                        "Failed to fetch support tickets"
                    );

                }


                setTickets(
                    data.tickets || []
                );


            } catch (fetchError) {

                console.error(
                    "Support Tickets Error:",
                    fetchError
                );

                setError(
                    fetchError.message ||
                    "Failed to load support tickets"
                );

            }

        }, [handleAdminSessionExpired]);


    // =====================================================
    // FETCH SUPPORT SUMMARY
    // =====================================================

    const fetchSummary =
        useCallback(async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const userString =
                    localStorage.getItem("user");


                if (!token || !userString) {

                    handleAdminSessionExpired();

                    return;

                }


                const response =
                    await fetch(
                        "http://localhost:5000/api/admin/support-summary",
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
                        "Failed to fetch support summary"
                    );

                }


                setSummary({
                    totalTickets:
                        data.totalTickets || 0,

                    openTickets:
                        data.openTickets || 0,

                    inProgressTickets:
                        data.inProgressTickets || 0,

                    resolvedTickets:
                        data.resolvedTickets || 0
                });


            } catch (fetchError) {

                console.error(
                    "Support Summary Error:",
                    fetchError
                );

                setError(
                    fetchError.message ||
                    "Failed to load support summary"
                );

            }

        }, [handleAdminSessionExpired]);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        const loadSupportData =
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    await Promise.all([
                        fetchTickets(),
                        fetchSummary()
                    ]);

                } finally {

                    setLoading(false);

                }

            };


        loadSupportData();

    }, [
        fetchTickets,
        fetchSummary
    ]);


    // =====================================================
    // OPEN TICKET MODAL
    // =====================================================

    const openTicket =
        (ticket) => {

            setSelectedTicket(
                ticket
            );

            setUpdateStatus(
                ticket.status || "Open"
            );

            setAdminResponse(
                ticket.adminResponse || ""
            );

            setError("");
            setSuccess("");

        };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        if (updating) {
            return;
        }

        setSelectedTicket(null);
        setUpdateStatus("Open");
        setAdminResponse("");

    };


    // =====================================================
    // UPDATE SUPPORT TICKET
    // =====================================================

    const handleUpdateTicket =
        async (event) => {

            event.preventDefault();


            if (!selectedTicket) {
                return;
            }


            try {

                setUpdating(true);
                setError("");
                setSuccess("");


                const token =
                    localStorage.getItem("token");


                if (!token) {

                    handleAdminSessionExpired();

                    return;

                }


                const response =
                    await fetch(
                        `http://localhost:5000/api/admin/support/${selectedTicket._id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                status:
                                    updateStatus,

                                adminResponse:
                                    adminResponse.trim()
                            })
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
                        "Failed to update ticket"
                    );

                }


                setSuccess(
                    "Support ticket updated successfully."
                );


                await Promise.all([
                    fetchTickets(),
                    fetchSummary()
                ]);


                setTimeout(() => {

                    setSelectedTicket(null);
                    setUpdateStatus("Open");
                    setAdminResponse("");
                    setSuccess("");

                }, 800);


            } catch (updateError) {

                console.error(
                    "Update Ticket Error:",
                    updateError
                );

                setError(
                    updateError.message ||
                    "Failed to update support ticket"
                );

            } finally {

                setUpdating(false);

            }

        };


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
    // FILTERED TICKETS
    // =====================================================

    const filteredTickets =
        useMemo(() => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            return tickets.filter(
                (ticket) => {

                    const customer =
                        ticket.userId || {};


                    const ticketId =
                        ticket.ticketId
                            ?.toLowerCase() || "";

                    const subject =
                        ticket.subject
                            ?.toLowerCase() || "";

                    const description =
                        ticket.description
                            ?.toLowerCase() || "";

                    const customerName =
                        customer.name
                            ?.toLowerCase() || "";

                    const customerEmail =
                        customer.email
                            ?.toLowerCase() || "";

                    const customerPhone =
                        customer.phone
                            ?.toString()
                            .toLowerCase() || "";

                    const accountNumber =
                        customer.accountNumber
                            ?.toString()
                            .toLowerCase() || "";


                    const matchesSearch =
                        !searchText ||
                        ticketId.includes(searchText) ||
                        subject.includes(searchText) ||
                        description.includes(searchText) ||
                        customerName.includes(searchText) ||
                        customerEmail.includes(searchText) ||
                        customerPhone.includes(searchText) ||
                        accountNumber.includes(searchText);


                    const matchesStatus =
                        statusFilter === "All" ||
                        ticket.status === statusFilter;


                    const matchesCategory =
                        categoryFilter === "All" ||
                        ticket.category === categoryFilter;


                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesCategory
                    );

                }
            );

        }, [
            tickets,
            search,
            statusFilter,
            categoryFilter
        ]);


    // =====================================================
    // UNIQUE CATEGORIES
    // =====================================================

    const categories =
        useMemo(() => {

            return [
                ...new Set(
                    tickets
                        .map(
                            (ticket) =>
                                ticket.category
                        )
                        .filter(Boolean)
                )
            ];

        }, [tickets]);


    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {

        setSearch("");
        setStatusFilter("All");
        setCategoryFilter("All");

    };


    const hasActiveFilters =
        search ||
        statusFilter !== "All" ||
        categoryFilter !== "All";


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
    // RENDER
    // =====================================================

    return (

        <div className="admin-support-page">


            {/* =================================================
                COMMON ADMIN SIDEBAR
            ================================================= */}

            <AdminSidebar
                activePage="support"
            />


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="admin-support-main">


                {/* =================================================
                    TOP BAR
                ================================================= */}

                <header className="admin-support-topbar">

                    <div>

                        <p className="admin-support-eyebrow">
                            Support Administration
                        </p>

                        <h1>
                            Customer Support
                        </h1>

                        <p>
                            Manage customer support requests and service tickets.
                        </p>

                    </div>


                    <div className="admin-support-topbar-actions">

                        <button
                            type="button"
                            className="admin-support-refresh-button"
                            onClick={async () => {

                                setError("");

                                setSuccess("");

                                setLoading(true);

                                try {

                                    await Promise.all([
                                        fetchTickets(),
                                        fetchSummary()
                                    ]);

                                } finally {

                                    setLoading(false);

                                }

                            }}
                            disabled={loading}
                        >
                            ↻ Refresh
                        </button>


                        <div className="admin-support-profile">

                            <div className="admin-support-avatar">
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
                    ALERTS
                ================================================= */}

                {error && (

                    <div className="admin-support-alert error">
                        {error}
                    </div>

                )}


                {success && (

                    <div className="admin-support-alert success">
                        {success}
                    </div>

                )}


                {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

                <section className="admin-support-stats">


                    {/* TOTAL */}

                    <div className="support-stat-card">

                        <div className="support-stat-icon total">
                            🎫
                        </div>

                        <div>

                            <span>
                                Total Tickets
                            </span>

                            <h2>
                                {summary.totalTickets}
                            </h2>

                        </div>

                    </div>


                    {/* OPEN */}

                    <div className="support-stat-card">

                        <div className="support-stat-icon open">
                            🟠
                        </div>

                        <div>

                            <span>
                                Open
                            </span>

                            <h2>
                                {summary.openTickets}
                            </h2>

                        </div>

                    </div>


                    {/* IN PROGRESS */}

                    <div className="support-stat-card">

                        <div className="support-stat-icon progress">
                            🔵
                        </div>

                        <div>

                            <span>
                                In Progress
                            </span>

                            <h2>
                                {summary.inProgressTickets}
                            </h2>

                        </div>

                    </div>


                    {/* RESOLVED */}

                    <div className="support-stat-card">

                        <div className="support-stat-icon resolved">
                            🟢
                        </div>

                        <div>

                            <span>
                                Resolved
                            </span>

                            <h2>
                                {summary.resolvedTickets}
                            </h2>

                        </div>

                    </div>


                </section>


                {/* =================================================
                    FILTER SECTION
                ================================================= */}

                <section className="admin-support-filter-section">

                    <div className="admin-support-section-header">

                        <div>

                            <p className="admin-support-section-eyebrow">
                                Support Directory
                            </p>

                            <h2>
                                Search Support Tickets
                            </h2>

                            <p>
                                Search and filter customer support requests.
                            </p>

                        </div>


                        <div className="admin-support-result-badge">
                            {filteredTickets.length} Records
                        </div>

                    </div>


                    <div className="support-filters">


                        {/* SEARCH */}

                        <div className="support-search">

                            <span>
                                🔎
                            </span>


                            <input
                                type="text"
                                placeholder="Search ticket, customer, email or account..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                aria-label="Search support tickets"
                            />


                            {search && (

                                <button
                                    type="button"
                                    className="support-search-clear"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>

                            )}

                        </div>


                        {/* STATUS */}

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            aria-label="Filter by ticket status"
                        >

                            <option value="All">
                                All Status
                            </option>

                            <option value="Open">
                                Open
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Resolved">
                                Resolved
                            </option>

                        </select>


                        {/* CATEGORY */}

                        <select
                            value={categoryFilter}
                            onChange={(event) =>
                                setCategoryFilter(
                                    event.target.value
                                )
                            }
                            aria-label="Filter by ticket category"
                        >

                            <option value="All">
                                All Categories
                            </option>


                            {categories.map(
                                (category) => (

                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>

                                )
                            )}

                        </select>


                        {/* CLEAR */}

                        {hasActiveFilters && (

                            <button
                                type="button"
                                className="support-clear-filters"
                                onClick={
                                    clearFilters
                                }
                            >
                                Clear Filters
                            </button>

                        )}

                    </div>

                </section>


                {/* =================================================
                    SUPPORT TICKETS
                ================================================= */}

                <section className="admin-support-ticket-section">


                    <div className="admin-support-section-header">

                        <div>

                            <p className="admin-support-section-eyebrow">
                                Ticket Management
                            </p>

                            <h2>
                                Support Tickets
                            </h2>

                            <p>
                                Review customer requests and update ticket status.
                            </p>

                        </div>


                        <div className="admin-support-result-badge">
                            {filteredTickets.length} Ticket
                            {filteredTickets.length !== 1
                                ? "s"
                                : ""
                            }
                        </div>

                    </div>


                    {loading ? (

                        <div className="support-loading-card">

                            <div className="support-loading-spinner">
                            </div>

                            <strong>
                                Loading Support Tickets
                            </strong>

                            <p>
                                Retrieving the latest customer support records.
                            </p>

                        </div>

                    ) : filteredTickets.length === 0 ? (

                        <div className="support-empty">

                            <div className="support-empty-icon">
                                🎫
                            </div>

                            <h3>
                                No support tickets found
                            </h3>

                            <p>
                                Try changing your search or filter options.
                            </p>


                            {hasActiveFilters && (

                                <button
                                    type="button"
                                    className="support-empty-button"
                                    onClick={
                                        clearFilters
                                    }
                                >
                                    Clear Filters
                                </button>

                            )}

                        </div>

                    ) : (

                        <div className="admin-support-table-wrapper">

                            <table className="admin-support-table">

                                <thead>

                                    <tr>

                                        <th>
                                            TICKET ID
                                        </th>

                                        <th>
                                            CUSTOMER
                                        </th>

                                        <th>
                                            CATEGORY
                                        </th>

                                        <th>
                                            SUBJECT
                                        </th>

                                        <th>
                                            DATE
                                        </th>

                                        <th>
                                            STATUS
                                        </th>

                                        <th>
                                            ACTION
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredTickets.map(
                                        (ticket) => {

                                            const customer =
                                                ticket.userId || {};


                                            const statusClass =
                                                ticket.status
                                                    ?.toLowerCase()
                                                    .replace(
                                                        /\s+/g,
                                                        "-"
                                                    ) ||
                                                "";


                                            return (

                                                <tr
                                                    key={
                                                        ticket._id
                                                    }
                                                >

                                                    {/* TICKET ID */}

                                                    <td>

                                                        <strong className="support-ticket-id">
                                                            {
                                                                ticket.ticketId ||
                                                                "-"
                                                            }
                                                        </strong>

                                                    </td>


                                                    {/* CUSTOMER */}

                                                    <td>

                                                        <div className="support-customer">

                                                            <div className="support-customer-avatar">

                                                                {
                                                                    customer.name
                                                                        ?.charAt(0)
                                                                        ?.toUpperCase() ||
                                                                    "U"
                                                                }

                                                            </div>


                                                            <div>

                                                                <strong>
                                                                    {
                                                                        customer.name ||
                                                                        "Unknown"
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        customer.email ||
                                                                        "-"
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* CATEGORY */}

                                                    <td>

                                                        <span className="support-category">
                                                            {
                                                                ticket.category ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* SUBJECT */}

                                                    <td>

                                                        <div className="support-subject">
                                                            {
                                                                ticket.subject ||
                                                                "-"
                                                            }
                                                        </div>

                                                    </td>


                                                    {/* DATE */}

                                                    <td>

                                                        <span className="support-date">
                                                            {
                                                                formatDate(
                                                                    ticket.createdAt
                                                                )
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td>

                                                        <span
                                                            className={
                                                                `support-status ${statusClass}`
                                                            }
                                                        >
                                                            {
                                                                ticket.status ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* ACTION */}

                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="support-view-btn"
                                                            onClick={() =>
                                                                openTicket(
                                                                    ticket
                                                                )
                                                            }
                                                        >
                                                            View & Manage
                                                        </button>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


                {/* =================================================
                    SECURITY NOTE
                ================================================= */}

                <div className="admin-support-security-note">

                    <div className="admin-support-security-icon">
                        🔐
                    </div>


                    <div>

                        <strong>
                            Support data protection
                        </strong>

                        <p>
                            Customer support records and responses are
                            restricted to authorized BankEase administrators.
                        </p>

                    </div>

                </div>


            </main>


            {/* =================================================
                TICKET DETAILS MODAL
            ================================================= */}

            {selectedTicket && (

                <div
                    className="support-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="support-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="support-modal-header">

                            <div>

                                <p className="modal-support-eyebrow">
                                    Support Ticket
                                </p>

                                <span className="modal-ticket-id">
                                    {
                                        selectedTicket.ticketId
                                    }
                                </span>

                                <h2>
                                    {
                                        selectedTicket.subject ||
                                        "Support Request"
                                    }
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeModal}
                                disabled={updating}
                                aria-label="Close ticket"
                            >
                                ×
                            </button>

                        </div>


                        {/* TICKET INFO */}

                        <div className="ticket-info-grid">


                            <div className="ticket-info-item">

                                <span>
                                    Customer
                                </span>

                                <strong>
                                    {
                                        selectedTicket.userId?.name ||
                                        "Unknown"
                                    }
                                </strong>

                            </div>


                            <div className="ticket-info-item">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {
                                        selectedTicket.userId?.email ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="ticket-info-item">

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {
                                        selectedTicket.userId?.phone ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="ticket-info-item">

                                <span>
                                    Account Number
                                </span>

                                <strong>
                                    {
                                        selectedTicket.userId?.accountNumber ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="ticket-info-item">

                                <span>
                                    Category
                                </span>

                                <strong>
                                    {
                                        selectedTicket.category ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="ticket-info-item">

                                <span>
                                    Created
                                </span>

                                <strong>
                                    {
                                        formatDate(
                                            selectedTicket.createdAt
                                        )
                                    }
                                </strong>

                            </div>


                        </div>


                        {/* CUSTOMER MESSAGE */}

                        <div className="ticket-description">

                            <label>
                                Customer Message
                            </label>

                            <div>
                                {
                                    selectedTicket.description ||
                                    "No customer message provided."
                                }
                            </div>

                        </div>


                        {/* CURRENT ADMIN RESPONSE */}

                        {selectedTicket.adminResponse && (

                            <div className="ticket-existing-response">

                                <label>
                                    Existing Admin Response
                                </label>

                                <div>
                                    {
                                        selectedTicket.adminResponse
                                    }
                                </div>

                            </div>

                        )}


                        {/* UPDATE FORM */}

                        <form
                            className="ticket-update-form"
                            onSubmit={
                                handleUpdateTicket
                            }
                        >


                            <div className="form-group">

                                <label>
                                    Ticket Status
                                </label>

                                <select
                                    value={
                                        updateStatus
                                    }
                                    onChange={(event) =>
                                        setUpdateStatus(
                                            event.target.value
                                        )
                                    }
                                    disabled={updating}
                                >

                                    <option value="Open">
                                        Open
                                    </option>

                                    <option value="In Progress">
                                        In Progress
                                    </option>

                                    <option value="Resolved">
                                        Resolved
                                    </option>

                                </select>

                            </div>


                            <div className="form-group">

                                <label>
                                    Admin Response
                                </label>

                                <textarea
                                    rows="5"
                                    placeholder="Write a response to the customer..."
                                    value={
                                        adminResponse
                                    }
                                    onChange={(event) =>
                                        setAdminResponse(
                                            event.target.value
                                        )
                                    }
                                    disabled={updating}
                                />

                            </div>


                            <div className="support-modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel-btn"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={updating}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="modal-save-btn"
                                    disabled={updating}
                                >

                                    {updating
                                        ? "Updating..."
                                        : "Update Ticket"
                                    }

                                </button>

                            </div>


                        </form>


                    </div>

                </div>

            )}


        </div>

    );

}


export default AdminSupport;