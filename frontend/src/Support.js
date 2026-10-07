import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "./Support.css";


function Support() {

    const navigate = useNavigate();


    // =========================================
    // FORM STATES
    // =========================================

    const [category, setCategory] =
        useState("");

    const [subject, setSubject] =
        useState("");

    const [description, setDescription] =
        useState("");


    // =========================================
    // TICKETS
    // =========================================

    const [tickets, setTickets] =
        useState([]);


    // =========================================
    // UI STATES
    // =========================================

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [message, setMessage] =
        useState("");

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
    // FETCH SUPPORT TICKETS
    // =========================================

    const fetchTickets =
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
                            "http://localhost:5000/api/support",
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

                        setError(
                            data.message ||
                            "Unable to load support requests"
                        );

                        return;

                    }


                    // ---------------------------------
                    // SUCCESS
                    // ---------------------------------

                    setTickets(
                        data.tickets || []
                    );

                } catch (error) {

                    console.error(
                        "Fetch Support Tickets Error:",
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
    // LOAD TICKETS
    // =========================================

    useEffect(() => {

        fetchTickets();

    }, [fetchTickets]);


    // =========================================
    // SUBMIT SUPPORT REQUEST
    // =========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");


        // -----------------------------------------
        // VALIDATION
        // -----------------------------------------

        if (!category) {

            setError(
                "Please select an issue category."
            );

            return;
        }


        if (!subject.trim()) {

            setError(
                "Please enter a subject."
            );

            return;
        }


        if (subject.trim().length < 3) {

            setError(
                "Subject must contain at least 3 characters."
            );

            return;
        }


        if (!description.trim()) {

            setError(
                "Please describe your issue."
            );

            return;
        }


        if (description.trim().length < 10) {

            setError(
                "Description must contain at least 10 characters."
            );

            return;
        }


        const token =
            localStorage.getItem("token");


        if (!token) {

            handleSessionExpired();

            return;
        }


        setSubmitting(true);


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/support",
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify({

                                category,

                                subject:
                                    subject.trim(),

                                description:
                                    description.trim()

                            })
                    }
                );


            const data =
                await response.json();


            // -----------------------------------------
            // SESSION EXPIRED
            // -----------------------------------------

            if (
                response.status === 401
            ) {

                handleSessionExpired();

                return;

            }


            // -----------------------------------------
            // ERROR
            // -----------------------------------------

            if (!response.ok) {

                setError(
                    data.message ||
                    "Unable to submit support request"
                );

                return;

            }


            // -----------------------------------------
            // SUCCESS
            // -----------------------------------------

            if (data.ticket) {

                setTickets(
                    (previousTickets) => [

                        data.ticket,

                        ...previousTickets

                    ]
                );

            }


            setMessage(
                data.ticket?.ticketId
                    ? `Support request ${data.ticket.ticketId} submitted successfully.`
                    : "Support request submitted successfully."
            );


            // Clear form

            setCategory("");
            setSubject("");
            setDescription("");


        } catch (error) {

            console.error(
                "Submit Support Error:",
                error
            );

            setError(
                "Unable to connect to server. Please try again."
            );

        } finally {

            setSubmitting(false);

        }

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
    // STATUS CLASS
    // =========================================

    const getStatusClass = (status) => {

        switch (status) {

            case "Resolved":
                return "status-resolved";

            case "In Progress":
                return "status-progress";

            default:
                return "status-open";

        }

    };


    // =========================================
    // STATUS ICON
    // =========================================

    const getStatusIcon = (status) => {

        switch (status) {

            case "Resolved":
                return "✓";

            case "In Progress":
                return "◷";

            default:
                return "●";

        }

    };


    // =========================================
    // TICKET COUNTS
    // =========================================

    const openTickets =
        tickets.filter(
            (ticket) =>
                ticket.status === "Open"
        ).length;


    const progressTickets =
        tickets.filter(
            (ticket) =>
                ticket.status === "In Progress"
        ).length;


    const resolvedTickets =
        tickets.filter(
            (ticket) =>
                ticket.status === "Resolved"
        ).length;


    // =========================================
    // LOADING SCREEN
    // =========================================

    if (loading) {

        return (

            <div className="support-page">

                <div className="support-wrapper">

                    <div className="support-loading-card">

                        <div className="support-loading-spinner">
                        </div>

                        <h2>
                            Loading Support
                        </h2>

                        <p>
                            Please wait while we fetch
                            your support requests.
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="support-page">

            <div className="support-wrapper">


                {/* =====================================
                    TOP BAR
                ===================================== */}

                <div className="support-topbar">

                    <button
                        type="button"
                        className="support-back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>


                    <div className="support-page-label">
                        CUSTOMER SUPPORT
                    </div>

                </div>


                {/* =====================================
                    PAGE HEADER
                ===================================== */}

                <div className="support-page-header">

                    <div>

                        <p className="support-eyebrow">
                            HELP & ASSISTANCE
                        </p>

                        <h1>
                            Customer Support
                        </h1>

                        <p>
                            We're here to help with your
                            BankEase account and banking needs.
                        </p>

                    </div>


                    <div className="support-header-badge">

                        <span>
                            ●
                        </span>

                        Support Available

                    </div>

                </div>


                {/* =====================================
                    SUPPORT OVERVIEW
                ===================================== */}

                <div className="support-overview">

                    <div className="support-overview-icon">
                        🆘
                    </div>


                    <div className="support-overview-content">

                        <h2>
                            Need help with your account?
                        </h2>

                        <p>
                            Submit a support request and
                            track its progress directly from
                            your BankEase account.
                        </p>

                    </div>


                    <div className="support-overview-status">

                        <div>

                            <strong>
                                {tickets.length}
                            </strong>

                            <span>
                                Total Requests
                            </span>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    TICKET SUMMARY
                ===================================== */}

                <div className="support-summary">

                    <div className="support-summary-card">

                        <div className="support-summary-icon total">
                            🎫
                        </div>

                        <div>

                            <span>
                                Total
                            </span>

                            <strong>
                                {tickets.length}
                            </strong>

                        </div>

                    </div>


                    <div className="support-summary-card">

                        <div className="support-summary-icon open">
                            ●
                        </div>

                        <div>

                            <span>
                                Open
                            </span>

                            <strong>
                                {openTickets}
                            </strong>

                        </div>

                    </div>


                    <div className="support-summary-card">

                        <div className="support-summary-icon progress">
                            ◷
                        </div>

                        <div>

                            <span>
                                In Progress
                            </span>

                            <strong>
                                {progressTickets}
                            </strong>

                        </div>

                    </div>


                    <div className="support-summary-card">

                        <div className="support-summary-icon resolved">
                            ✓
                        </div>

                        <div>

                            <span>
                                Resolved
                            </span>

                            <strong>
                                {resolvedTickets}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    MESSAGE
                ===================================== */}

                {message && (

                    <div className="support-message success">

                        <span>
                            ✓
                        </span>

                        <p>
                            {message}
                        </p>

                    </div>

                )}


                {error && (

                    <div className="support-message error">

                        <span>
                            !
                        </span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* =====================================
                    MAIN GRID
                ===================================== */}

                <div className="support-main-grid">


                    {/* =================================
                        SUPPORT FORM
                    ================================= */}

                    <div className="support-card">

                        <div className="support-card-header">

                            <div className="support-card-icon">
                                ✉
                            </div>

                            <div>

                                <h2>
                                    Submit a Support Request
                                </h2>

                                <p>
                                    Tell us about the issue you're
                                    experiencing.
                                </p>

                            </div>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="support-form"
                        >


                            {/* CATEGORY */}

                            <div className="support-form-group">

                                <label htmlFor="category">
                                    Issue Category
                                </label>


                                <div className="support-select-wrapper">

                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(event) => {

                                            setCategory(
                                                event.target.value
                                            );

                                            setError("");
                                            setMessage("");

                                        }}
                                    >

                                        <option value="">
                                            Select an issue category
                                        </option>

                                        <option value="Account">
                                            Account
                                        </option>

                                        <option value="Transaction">
                                            Transaction
                                        </option>

                                        <option value="Money Transfer">
                                            Money Transfer
                                        </option>

                                        <option value="Bill Payment">
                                            Bill Payment
                                        </option>

                                        <option value="Deposit">
                                            Deposit
                                        </option>

                                        <option value="Withdrawal">
                                            Withdrawal
                                        </option>

                                        <option value="Login & Security">
                                            Login & Security
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* SUBJECT */}

                            <div className="support-form-group">

                                <label htmlFor="subject">
                                    Subject
                                </label>

                                <input
                                    id="subject"
                                    type="text"
                                    placeholder="Enter a short description of your issue"
                                    value={subject}
                                    onChange={(event) => {

                                        setSubject(
                                            event.target.value
                                        );

                                        setError("");
                                        setMessage("");

                                    }}
                                    maxLength={100}
                                />

                                <span className="support-field-hint">
                                    Keep the subject clear and specific.
                                </span>

                            </div>


                            {/* DESCRIPTION */}

                            <div className="support-form-group">

                                <div className="support-label-row">

                                    <label htmlFor="description">
                                        Description
                                    </label>

                                    <span>
                                        {description.length}/1000
                                    </span>

                                </div>


                                <textarea
                                    id="description"
                                    placeholder="Please describe your issue in detail..."
                                    value={description}
                                    onChange={(event) => {

                                        setDescription(
                                            event.target.value
                                        );

                                        setError("");
                                        setMessage("");

                                    }}
                                    rows="7"
                                    maxLength={1000}
                                />

                            </div>


                            {/* SECURITY NOTE */}

                            <div className="support-form-note">

                                <span>
                                    🔒
                                </span>

                                <p>
                                    Never include your password,
                                    OTP or confidential credentials
                                    in the support request.
                                </p>

                            </div>


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                className="support-submit-button"
                                disabled={submitting}
                            >

                                {submitting ? (

                                    <>
                                        <span className="support-spinner"></span>
                                        Submitting...
                                    </>

                                ) : (

                                    <>
                                        Submit Support Request
                                        <span>→</span>
                                    </>

                                )}

                            </button>

                        </form>

                    </div>


                    {/* =================================
                        SUPPORT INFORMATION
                    ================================= */}

                    <div className="support-side-panel">


                        <div className="support-info-card">

                            <div className="support-card-header">

                                <div className="support-card-icon blue">
                                    💬
                                </div>

                                <div>

                                    <h2>
                                        How Support Works
                                    </h2>

                                    <p>
                                        Track your request from
                                        submission to resolution.
                                    </p>

                                </div>

                            </div>


                            <div className="support-step">

                                <div className="support-step-number">
                                    01
                                </div>

                                <div>

                                    <strong>
                                        Submit your request
                                    </strong>

                                    <p>
                                        Select a category and
                                        describe the issue.
                                    </p>

                                </div>

                            </div>


                            <div className="support-step">

                                <div className="support-step-number">
                                    02
                                </div>

                                <div>

                                    <strong>
                                        Our team reviews it
                                    </strong>

                                    <p>
                                        Your request is reviewed
                                        by the support team.
                                    </p>

                                </div>

                            </div>


                            <div className="support-step">

                                <div className="support-step-number">
                                    03
                                </div>

                                <div>

                                    <strong>
                                        Track the status
                                    </strong>

                                    <p>
                                        Follow progress directly
                                        from this page.
                                    </p>

                                </div>

                            </div>


                            <div className="support-step">

                                <div className="support-step-number">
                                    04
                                </div>

                                <div>

                                    <strong>
                                        Get a response
                                    </strong>

                                    <p>
                                        Admin responses appear
                                        with your ticket.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="support-contact-card">

                            <div className="support-contact-icon">
                                🛡️
                            </div>

                            <h3>
                                Secure Support
                            </h3>

                            <p>
                                BankEase support requests are
                                connected to your authenticated
                                customer account.
                            </p>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    MY SUPPORT REQUESTS
                ===================================== */}

                <div className="support-tickets-card">

                    <div className="support-card-header">

                        <div className="support-card-icon">
                            🎫
                        </div>

                        <div>

                            <h2>
                                My Support Requests
                            </h2>

                            <p>
                                Track the status of your
                                submitted support requests.
                            </p>

                        </div>

                    </div>


                    {tickets.length === 0 ? (

                        <div className="support-empty">

                            <div className="support-empty-icon">
                                📝
                            </div>

                            <h3>
                                No Support Requests
                            </h3>

                            <p>
                                Your submitted support requests
                                will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="support-ticket-list">

                            {tickets.map(
                                (ticket) => (

                                    <div
                                        key={
                                            ticket._id
                                        }
                                        className="support-ticket"
                                    >

                                        <div className="support-ticket-main">


                                            {/* TITLE */}

                                            <div className="support-ticket-title-row">

                                                <div>

                                                    <h3>
                                                        {
                                                            ticket.subject
                                                        }
                                                    </h3>

                                                    <span className="support-ticket-category">
                                                        {
                                                            ticket.category
                                                        }
                                                    </span>

                                                </div>


                                                <span
                                                    className={
                                                        `support-status ${getStatusClass(
                                                            ticket.status
                                                        )}`
                                                    }
                                                >

                                                    <span>
                                                        {
                                                            getStatusIcon(
                                                                ticket.status
                                                            )
                                                        }
                                                    </span>

                                                    {
                                                        ticket.status
                                                    }

                                                </span>

                                            </div>


                                            {/* TICKET ID */}

                                            <div className="support-ticket-meta">

                                                <span>
                                                    Ticket ID
                                                </span>

                                                <strong>
                                                    {
                                                        ticket.ticketId
                                                    }
                                                </strong>

                                            </div>


                                            {/* DESCRIPTION */}

                                            <p className="support-ticket-description">
                                                {
                                                    ticket.description
                                                }
                                            </p>


                                            {/* DATE */}

                                            <div className="support-ticket-date">

                                                Submitted:

                                                {" "}

                                                {
                                                    formatDate(
                                                        ticket.createdAt
                                                    )
                                                }

                                            </div>


                                            {/* ADMIN RESPONSE */}

                                            {ticket.adminResponse && (

                                                <div className="support-admin-response">

                                                    <div className="support-admin-response-heading">

                                                        <span>
                                                            ✓
                                                        </span>

                                                        Admin Response

                                                    </div>

                                                    <p>
                                                        {
                                                            ticket.adminResponse
                                                        }
                                                    </p>

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =====================================
                    SECURITY NOTE
                ===================================== */}

                <div className="support-security-note">

                    <div className="support-security-icon">
                        🔐
                    </div>

                    <div>

                        <strong>
                            Keep your banking information private
                        </strong>

                        <p>
                            Never share passwords, OTPs, PINs or
                            confidential banking information with
                            support or anyone else.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Support;