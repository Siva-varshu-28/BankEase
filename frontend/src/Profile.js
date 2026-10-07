import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {

    const navigate = useNavigate();


    // =========================================
    // GET USER
    // =========================================

    const [user] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;

    });


    // =========================================
    // PASSWORD STATES
    // =========================================

    const [showPasswordForm, setShowPasswordForm] =
        useState(false);

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [passwordMessage, setPasswordMessage] =
        useState("");

    const [passwordError, setPasswordError] =
        useState("");

    const [passwordLoading, setPasswordLoading] =
        useState(false);


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
    // PASSWORD FORM RESET
    // =========================================

    const resetPasswordForm = () => {

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setPasswordMessage("");
        setPasswordError("");

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);

    };


    // =========================================
    // CHANGE PASSWORD
    // =========================================

    const handleChangePassword = async (e) => {

        e.preventDefault();

        setPasswordMessage("");
        setPasswordError("");


        // -----------------------------------------
        // VALIDATION
        // -----------------------------------------

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            setPasswordError(
                "All password fields are required"
            );

            return;
        }


        if (newPassword.length < 6) {

            setPasswordError(
                "New password must contain at least 6 characters"
            );

            return;
        }


        if (
            newPassword !==
            confirmPassword
        ) {

            setPasswordError(
                "New password and confirm password do not match"
            );

            return;
        }


        if (
            currentPassword ===
            newPassword
        ) {

            setPasswordError(
                "New password must be different from current password"
            );

            return;
        }


        // -----------------------------------------
        // TOKEN CHECK
        // -----------------------------------------

        const token =
            localStorage.getItem("token");


        if (!token) {

            setPasswordError(
                "Session expired. Please login again."
            );

            return;
        }


        setPasswordLoading(true);


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

                setPasswordMessage(
                    data.message ||
                    "Password changed successfully"
                );

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                setShowCurrentPassword(false);
                setShowNewPassword(false);
                setShowConfirmPassword(false);

            } else {

                setPasswordError(
                    data.message ||
                    "Unable to change password"
                );

            }

        } catch (error) {

            console.error(
                "Change Password Error:",
                error
            );

            setPasswordError(
                "Unable to connect to server"
            );

        } finally {

            setPasswordLoading(false);

        }

    };


    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/");

    };


    // =========================================
    // LOGIN CHECK
    // =========================================

    if (!user) {

        return (

            <div className="profile-page">

                <div className="profile-login-card">

                    <div className="profile-brand">

                        <div className="profile-brand-mark">
                            B
                        </div>

                        <div>

                            <div className="profile-brand-name">
                                BankEase
                            </div>

                            <div className="profile-brand-subtitle">
                                Smart Banking
                            </div>

                        </div>

                    </div>


                    <div className="profile-login-state">

                        <div className="profile-state-icon">
                            🔐
                        </div>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Please login to continue
                            to your profile.
                        </p>

                        <button
                            className="profile-primary-button"
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


    return (

        <div className="profile-page">

            <div className="profile-wrapper">


                {/* =====================================
                    TOP BAR
                ===================================== */}

                <div className="profile-topbar">

                    <button
                        className="profile-back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>


                    <div className="profile-page-label">
                        ACCOUNT PROFILE
                    </div>

                </div>


                {/* =====================================
                    PAGE HEADER
                ===================================== */}

                <div className="profile-page-header">

                    <div>

                        <p className="profile-eyebrow">
                            ACCOUNT SETTINGS
                        </p>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Manage your personal details,
                            account information and security.
                        </p>

                    </div>


                    <div className="profile-status-badge">

                        <span>
                            ●
                        </span>

                        Account Active

                    </div>

                </div>


                {/* =====================================
                    PROFILE HERO
                ===================================== */}

                <div className="profile-hero-card">

                    <div className="profile-avatar-large">

                        {user.name
                            ?.charAt(0)
                            .toUpperCase()}

                    </div>


                    <div className="profile-hero-content">

                        <h2>
                            {user.name}
                        </h2>

                        <p>
                            {user.email}
                        </p>

                        <div className="profile-hero-meta">

                            <span>
                                BankEase Customer
                            </span>

                            <span>
                                •
                            </span>

                            <span>
                                Customer ID:
                                {" "}
                                {user.accountNumber || "N/A"}
                            </span>

                        </div>

                    </div>


                    <div className="profile-hero-balance">

                        <span>
                            Available Balance
                        </span>

                        <strong>
                            ₹
                            {formatMoney(
                                user.balance
                            )}
                        </strong>

                    </div>

                </div>


                {/* =====================================
                    MAIN GRID
                ===================================== */}

                <div className="profile-main-grid">


                    {/* =================================
                        PERSONAL INFORMATION
                    ================================= */}

                    <div className="profile-section-card">

                        <div className="profile-section-header">

                            <div className="profile-section-icon">
                                👤
                            </div>

                            <div>

                                <h2>
                                    Personal Information
                                </h2>

                                <p>
                                    Your registered customer details
                                </p>

                            </div>

                        </div>


                        <div className="profile-info-grid">

                            <div className="profile-info-item">

                                <span>
                                    Full Name
                                </span>

                                <strong>
                                    {user.name}
                                </strong>

                            </div>


                            <div className="profile-info-item">

                                <span>
                                    Email Address
                                </span>

                                <strong>
                                    {user.email}
                                </strong>

                            </div>


                            <div className="profile-info-item">

                                <span>
                                    Phone Number
                                </span>

                                <strong>
                                    {user.phone ||
                                        "Not available"}
                                </strong>

                            </div>


                            <div className="profile-info-item">

                                <span>
                                    Customer Role
                                </span>

                                <strong>
                                    {user.role === "admin"
                                        ? "Administrator"
                                        : "Customer"}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        ACCOUNT INFORMATION
                    ================================= */}

                    <div className="profile-section-card">

                        <div className="profile-section-header">

                            <div className="profile-section-icon">
                                🏦
                            </div>

                            <div>

                                <h2>
                                    Account Information
                                </h2>

                                <p>
                                    Your BankEase account details
                                </p>

                            </div>

                        </div>


                        <div className="profile-info-grid">

                            <div className="profile-info-item">

                                <span>
                                    Account Number
                                </span>

                                <strong>
                                    {user.accountNumber}
                                </strong>

                            </div>


                            <div className="profile-info-item">

                                <span>
                                    Account Type
                                </span>

                                <strong>
                                    Savings Account
                                </strong>

                            </div>


                            <div className="profile-info-item">

                                <span>
                                    Account Status
                                </span>

                                <strong className="profile-success-text">
                                    Active
                                </strong>

                            </div>


                            <div className="profile-info-item">

                                <span>
                                    Current Balance
                                </span>

                                <strong className="profile-balance-text">

                                    ₹
                                    {formatMoney(
                                        user.balance
                                    )}

                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        SECURITY SECTION
                    ================================= */}

                    <div className="profile-section-card profile-security-card">

                        <div className="profile-section-header">

                            <div className="profile-section-icon security">
                                🔒
                            </div>

                            <div>

                                <h2>
                                    Security
                                </h2>

                                <p>
                                    Protect your BankEase account
                                </p>

                            </div>

                        </div>


                        {!showPasswordForm ? (

                            <div className="profile-security-summary">

                                <div className="profile-security-status">

                                    <div className="profile-security-check">
                                        ✓
                                    </div>

                                    <div>

                                        <strong>
                                            Password Protection
                                        </strong>

                                        <p>
                                            Your account password is
                                            securely protected.
                                        </p>

                                    </div>

                                </div>


                                <button
                                    className="profile-outline-button"
                                    onClick={() => {

                                        setShowPasswordForm(
                                            true
                                        );

                                        setPasswordMessage("");
                                        setPasswordError("");

                                    }}
                                >
                                    Change Password
                                </button>

                            </div>

                        ) : (

                            <div className="profile-password-box">

                                <div className="profile-password-header">

                                    <div>

                                        <h3>
                                            Change Password
                                        </h3>

                                        <p>
                                            Update your password
                                            securely below.
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        className="profile-close-button"
                                        onClick={() => {

                                            setShowPasswordForm(
                                                false
                                            );

                                            resetPasswordForm();

                                        }}
                                    >
                                        ✕
                                    </button>

                                </div>


                                {passwordError && (

                                    <div className="profile-password-message error">

                                        <span>
                                            !
                                        </span>

                                        <p>
                                            {passwordError}
                                        </p>

                                    </div>

                                )}


                                {passwordMessage && (

                                    <div className="profile-password-message success">

                                        <span>
                                            ✓
                                        </span>

                                        <p>
                                            {passwordMessage}
                                        </p>

                                    </div>

                                )}


                                <form
                                    onSubmit={
                                        handleChangePassword
                                    }
                                >

                                    {/* CURRENT PASSWORD */}

                                    <div className="profile-password-field">

                                        <label>
                                            Current Password
                                        </label>

                                        <div className="profile-password-input">

                                            <input
                                                type={
                                                    showCurrentPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    currentPassword
                                                }
                                                onChange={(e) =>
                                                    setCurrentPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter current password"
                                                autoComplete="current-password"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowCurrentPassword(
                                                        !showCurrentPassword
                                                    )
                                                }
                                            >
                                                {showCurrentPassword
                                                    ? "Hide"
                                                    : "Show"}
                                            </button>

                                        </div>

                                    </div>


                                    {/* NEW PASSWORD */}

                                    <div className="profile-password-field">

                                        <label>
                                            New Password
                                        </label>

                                        <div className="profile-password-input">

                                            <input
                                                type={
                                                    showNewPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    newPassword
                                                }
                                                onChange={(e) =>
                                                    setNewPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter new password"
                                                autoComplete="new-password"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        !showNewPassword
                                                    )
                                                }
                                            >
                                                {showNewPassword
                                                    ? "Hide"
                                                    : "Show"}
                                            </button>

                                        </div>

                                        <small>
                                            Minimum 6 characters
                                        </small>

                                    </div>


                                    {/* CONFIRM PASSWORD */}

                                    <div className="profile-password-field">

                                        <label>
                                            Confirm New Password
                                        </label>

                                        <div className="profile-password-input">

                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    confirmPassword
                                                }
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Confirm new password"
                                                autoComplete="new-password"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                            >
                                                {showConfirmPassword
                                                    ? "Hide"
                                                    : "Show"}
                                            </button>

                                        </div>

                                    </div>


                                    {/* PASSWORD ACTIONS */}

                                    <div className="profile-password-actions">

                                        <button
                                            type="submit"
                                            className="profile-save-button"
                                            disabled={
                                                passwordLoading
                                            }
                                        >

                                            {passwordLoading ? (

                                                <>
                                                    <span className="profile-spinner"></span>
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
                                            className="profile-cancel-button"
                                            onClick={() => {

                                                setShowPasswordForm(
                                                    false
                                                );

                                                resetPasswordForm();

                                            }}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </form>

                            </div>

                        )}

                    </div>


                    {/* =================================
                        QUICK ACTIONS
                    ================================= */}

                    <div className="profile-section-card profile-actions-card">

                        <div className="profile-section-header">

                            <div className="profile-section-icon">
                                ⚡
                            </div>

                            <div>

                                <h2>
                                    Quick Access
                                </h2>

                                <p>
                                    Frequently used banking services
                                </p>

                            </div>

                        </div>


                        <div className="profile-actions-grid">

                            <button
                                onClick={() =>
                                    navigate("/statement")
                                }
                            >

                                <span>
                                    📄
                                </span>

                                <div>

                                    <strong>
                                        View Statement
                                    </strong>

                                    <small>
                                        Account statement
                                    </small>

                                </div>

                                <b>
                                    →
                                </b>

                            </button>


                            <button
                                onClick={() =>
                                    navigate("/send-money")
                                }
                            >

                                <span>
                                    ↗
                                </span>

                                <div>

                                    <strong>
                                        Send Money
                                    </strong>

                                    <small>
                                        Transfer funds
                                    </small>

                                </div>

                                <b>
                                    →
                                </b>

                            </button>


                            <button
                                onClick={() =>
                                    navigate("/bill-payment")
                                }
                            >

                                <span>
                                    ₹
                                </span>

                                <div>

                                    <strong>
                                        Pay Bills
                                    </strong>

                                    <small>
                                        Manage bill payments
                                    </small>

                                </div>

                                <b>
                                    →
                                </b>

                            </button>


                            <button
                                onClick={() =>
                                    navigate("/transactions")
                                }
                            >

                                <span>
                                    ↔
                                </span>

                                <div>

                                    <strong>
                                        Transactions
                                    </strong>

                                    <small>
                                        View transaction history
                                    </small>

                                </div>

                                <b>
                                    →
                                </b>

                            </button>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    SECURITY NOTE
                ===================================== */}

                <div className="profile-security-note">

                    <div className="profile-security-note-icon">
                        🔒
                    </div>

                    <div>

                        <strong>
                            Keep your account secure
                        </strong>

                        <p>
                            Never share your password or
                            banking credentials with anyone.
                        </p>

                    </div>

                </div>


                {/* =====================================
                    LOGOUT
                ===================================== */}

                <button
                    className="profile-logout-button"
                    onClick={
                        handleLogout
                    }
                >

                    <span>
                        ↪
                    </span>

                    Logout from BankEase

                </button>

            </div>

        </div>

    );
}

export default Profile;