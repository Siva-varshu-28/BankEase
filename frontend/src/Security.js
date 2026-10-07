import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Security.css";

function Security() {

    const navigate = useNavigate();


    // =========================================
    // PASSWORD STATES
    // =========================================

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");


    // =========================================
    // PASSWORD VISIBILITY
    // =========================================

    const [showCurrent, setShowCurrent] =
        useState(false);

    const [showNew, setShowNew] =
        useState(false);

    const [showConfirm, setShowConfirm] =
        useState(false);


    // =========================================
    // UI STATES
    // =========================================

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    // =========================================
    // RESET FORM
    // =========================================

    const resetForm = () => {

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);

        setMessage("");
        setError("");

    };


    // =========================================
    // CHANGE PASSWORD
    // =========================================

    const handleChangePassword = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        // -----------------------------------------
        // VALIDATION
        // -----------------------------------------

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            setError(
                "All password fields are required."
            );

            return;
        }


        if (newPassword.length < 6) {

            setError(
                "New password must contain at least 6 characters."
            );

            return;
        }


        if (
            newPassword !==
            confirmPassword
        ) {

            setError(
                "New password and confirm password do not match."
            );

            return;
        }


        if (
            currentPassword ===
            newPassword
        ) {

            setError(
                "New password must be different from your current password."
            );

            return;
        }


        // -----------------------------------------
        // TOKEN
        // -----------------------------------------

        const token =
            localStorage.getItem("token");


        if (!token) {

            localStorage.removeItem("user");

            navigate("/");

            return;
        }


        setLoading(true);


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/change-password",
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

                                currentPassword:
                                    currentPassword,

                                newPassword:
                                    newPassword

                            })
                    }
                );


            const data =
                await response.json();


            // -----------------------------------------
            // SESSION EXPIRED
            // -----------------------------------------

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


            // -----------------------------------------
            // SUCCESS
            // -----------------------------------------

            if (response.ok) {

                setMessage(
                    data.message ||
                    "Password changed successfully."
                );

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                setShowCurrent(false);
                setShowNew(false);
                setShowConfirm(false);

            } else {

                setError(
                    data.message ||
                    "Unable to change password."
                );

            }


        } catch (error) {

            console.error(
                "Security Password Error:",
                error
            );

            setError(
                "Unable to connect to server. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="security-page">

            <div className="security-wrapper">


                {/* =====================================
                    TOP BAR
                ===================================== */}

                <div className="security-topbar">

                    <button
                        className="security-back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>


                    <div className="security-page-label">
                        ACCOUNT SECURITY
                    </div>

                </div>


                {/* =====================================
                    PAGE HEADER
                ===================================== */}

                <div className="security-page-header">

                    <div>

                        <p className="security-eyebrow">
                            SECURITY SETTINGS
                        </p>

                        <h1>
                            Account Security
                        </h1>

                        <p>
                            Protect your BankEase account
                            with a strong and secure password.
                        </p>

                    </div>


                    <div className="security-status-badge">

                        <span>
                            ●
                        </span>

                        Secure Account

                    </div>

                </div>


                {/* =====================================
                    SECURITY HERO
                ===================================== */}

                <div className="security-hero-card">

                    <div className="security-hero-icon">
                        🔒
                    </div>


                    <div className="security-hero-content">

                        <h2>
                            Your account security matters
                        </h2>

                        <p>
                            Keep your password private and
                            update it regularly to protect
                            your banking account.
                        </p>

                    </div>


                    <div className="security-hero-status">

                        <span>
                            ✓
                        </span>

                        <div>

                            <strong>
                                Protection Active
                            </strong>

                            <small>
                                Password authentication enabled
                            </small>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    MAIN CONTENT
                ===================================== */}

                <div className="security-main-grid">


                    {/* =================================
                        CHANGE PASSWORD
                    ================================= */}

                    <div className="security-card">

                        <div className="security-card-header">

                            <div className="security-card-icon">
                                🔑
                            </div>

                            <div>

                                <h2>
                                    Change Password
                                </h2>

                                <p>
                                    Update your password securely
                                    using your current credentials.
                                </p>

                            </div>

                        </div>


                        {/* SUCCESS */}

                        {message && (

                            <div className="security-message success">

                                <span>
                                    ✓
                                </span>

                                <p>
                                    {message}
                                </p>

                            </div>

                        )}


                        {/* ERROR */}

                        {error && (

                            <div className="security-message error">

                                <span>
                                    !
                                </span>

                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        <form
                            className="security-form"
                            onSubmit={
                                handleChangePassword
                            }
                        >


                            {/* CURRENT PASSWORD */}

                            <div className="security-field">

                                <label>
                                    Current Password
                                </label>

                                <div className="security-password-input">

                                    <input
                                        type={
                                            showCurrent
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            currentPassword
                                        }
                                        onChange={(e) => {

                                            setCurrentPassword(
                                                e.target.value
                                            );

                                            setError("");
                                            setMessage("");

                                        }}
                                        placeholder="Enter current password"
                                        autoComplete="current-password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCurrent(
                                                !showCurrent
                                            )
                                        }
                                    >
                                        {showCurrent
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>


                            {/* NEW PASSWORD */}

                            <div className="security-field">

                                <label>
                                    New Password
                                </label>

                                <div className="security-password-input">

                                    <input
                                        type={
                                            showNew
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            newPassword
                                        }
                                        onChange={(e) => {

                                            setNewPassword(
                                                e.target.value
                                            );

                                            setError("");
                                            setMessage("");

                                        }}
                                        placeholder="Enter new password"
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNew(
                                                !showNew
                                            )
                                        }
                                    >
                                        {showNew
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                                <small>
                                    Minimum 6 characters
                                </small>

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div className="security-field">

                                <label>
                                    Confirm New Password
                                </label>

                                <div className="security-password-input">

                                    <input
                                        type={
                                            showConfirm
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(e) => {

                                            setConfirmPassword(
                                                e.target.value
                                            );

                                            setError("");
                                            setMessage("");

                                        }}
                                        placeholder="Confirm new password"
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirm(
                                                !showConfirm
                                            )
                                        }
                                    >
                                        {showConfirm
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>


                            {/* =================================
                                PASSWORD REQUIREMENTS
                            ================================= */}

                            <div className="security-requirements">

                                <div className="security-requirements-title">

                                    <span>
                                        ✓
                                    </span>

                                    Password Requirements

                                </div>


                                <div className="security-requirement">

                                    <span>
                                        ✓
                                    </span>

                                    At least 6 characters

                                </div>


                                <div className="security-requirement">

                                    <span>
                                        ✓
                                    </span>

                                    Use a combination of
                                    letters and numbers

                                </div>


                                <div className="security-requirement">

                                    <span>
                                        ✓
                                    </span>

                                    Avoid easily guessed
                                    personal information

                                </div>

                            </div>


                            {/* =================================
                                ACTIONS
                            ================================= */}

                            <div className="security-form-actions">

                                <button
                                    type="submit"
                                    className="security-update-button"
                                    disabled={loading}
                                >

                                    {loading ? (

                                        <>
                                            <span className="security-spinner"></span>
                                            Updating...
                                        </>

                                    ) : (

                                        <>
                                            Update Password
                                            <span>→</span>
                                        </>

                                    )}

                                </button>


                                <button
                                    type="button"
                                    className="security-reset-button"
                                    onClick={
                                        resetForm
                                    }
                                    disabled={loading}
                                >
                                    Clear
                                </button>

                            </div>


                        </form>

                    </div>


                    {/* =================================
                        SECURITY TIPS
                    ================================= */}

                    <div className="security-tips-card">

                        <div className="security-card-header">

                            <div className="security-card-icon tips">
                                🛡️
                            </div>

                            <div>

                                <h2>
                                    Security Tips
                                </h2>

                                <p>
                                    Simple practices to keep
                                    your banking account safe.
                                </p>

                            </div>

                        </div>


                        <div className="security-tips">


                            <div className="security-tip">

                                <div className="security-tip-number">
                                    01
                                </div>

                                <div>

                                    <strong>
                                        Keep your password private
                                    </strong>

                                    <p>
                                        Never share your BankEase
                                        password with anyone.
                                    </p>

                                </div>

                            </div>


                            <div className="security-tip">

                                <div className="security-tip-number">
                                    02
                                </div>

                                <div>

                                    <strong>
                                        Use a strong password
                                    </strong>

                                    <p>
                                        Avoid common or easily
                                        guessed passwords.
                                    </p>

                                </div>

                            </div>


                            <div className="security-tip">

                                <div className="security-tip-number">
                                    03
                                </div>

                                <div>

                                    <strong>
                                        Log out on shared devices
                                    </strong>

                                    <p>
                                        Always sign out when using
                                        a public or shared computer.
                                    </p>

                                </div>

                            </div>


                            <div className="security-tip">

                                <div className="security-tip-number">
                                    04
                                </div>

                                <div>

                                    <strong>
                                        Change passwords regularly
                                    </strong>

                                    <p>
                                        Updating your password
                                        periodically adds protection.
                                    </p>

                                </div>

                            </div>


                        </div>

                    </div>


                </div>


                {/* =====================================
                    SECURITY NOTE
                ===================================== */}

                <div className="security-note">

                    <div className="security-note-icon">
                        🔐
                    </div>

                    <div>

                        <strong>
                            BankEase Security Reminder
                        </strong>

                        <p>
                            BankEase will never ask you to
                            share your password, OTP or
                            confidential banking credentials.
                        </p>

                    </div>

                </div>


                {/* =====================================
                    QUICK ACTIONS
                ===================================== */}

                <div className="security-quick-actions">

                    <button
                        onClick={() =>
                            navigate("/profile")
                        }
                    >

                        <span>
                            👤
                        </span>

                        Profile

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
                            🏦
                        </span>

                        Account Details

                        <b>
                            →
                        </b>

                    </button>


                    <button
                        onClick={() =>
                            navigate("/notifications")
                        }
                    >

                        <span>
                            🔔
                        </span>

                        Notifications

                        <b>
                            →
                        </b>

                    </button>


                </div>

            </div>

        </div>

    );
}

export default Security;