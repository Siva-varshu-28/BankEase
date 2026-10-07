import { useState } from "react";
import {
    useNavigate,
    useLocation,
    Link
} from "react-router-dom";

import "./ResetPassword.css";

function ResetPassword() {

    const navigate = useNavigate();
    const location = useLocation();


    // Token received from Forgot Password page
    const tokenFromForgotPassword =
        location.state?.resetToken || "";


    const [resetToken, setResetToken] = useState(
        tokenFromForgotPassword
    );

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [success, setSuccess] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    const handleResetPassword = async (e) => {

        e.preventDefault();

        setMessage("");
        setSuccess(false);


        if (!resetToken.trim()) {

            setMessage(
                "Please enter your reset token."
            );

            return;
        }


        if (!newPassword) {

            setMessage(
                "Please enter your new password."
            );

            return;
        }


        if (newPassword.length < 6) {

            setMessage(
                "Password must contain at least 6 characters."
            );

            return;
        }


        if (!confirmPassword) {

            setMessage(
                "Please confirm your new password."
            );

            return;
        }


        if (newPassword !== confirmPassword) {

            setMessage(
                "Passwords do not match."
            );

            return;
        }


        setLoading(true);


        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/reset-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        resetToken:
                            resetToken.trim(),

                        newPassword:
                            newPassword

                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                setMessage(
                    data.message ||
                    "Unable to reset your password."
                );

                return;
            }


            setSuccess(true);

            setMessage(
                "Password reset successfully!"
            );


            setResetToken("");
            setNewPassword("");
            setConfirmPassword("");


        } catch (error) {

            console.error(
                "Reset Password Error:",
                error
            );

            setMessage(
                "Unable to connect to server."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="reset-password-page">

            {/* =========================================
                LEFT BRAND SECTION
            ========================================= */}

            <section className="reset-brand-section">

                <div className="reset-brand-content">

                    <div className="reset-brand-logo">

                        <div className="reset-logo-icon">

                            <div className="reset-bank-roof">
                            </div>

                            <div className="reset-bank-building">

                                <span></span>
                                <span></span>
                                <span></span>

                            </div>

                        </div>


                        <div>

                            <h1>
                                Bank<span>Ease</span>
                            </h1>

                            <p>
                                Digital Banking
                            </p>

                        </div>

                    </div>


                    <div className="reset-brand-message">

                        <span className="reset-brand-tag">
                            SECURE PASSWORD RECOVERY
                        </span>

                        <h2>
                            Protect your account,
                            <br />
                            <span>every step of the way.</span>
                        </h2>

                        <p>
                            Create a new secure password and
                            continue using your BankEase account
                            with confidence.
                        </p>

                    </div>


                    <div className="reset-security-points">

                        <div className="reset-security-item">

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Secure Reset
                                </strong>

                                <small>
                                    Protected password recovery
                                </small>

                            </div>

                        </div>


                        <div className="reset-security-item">

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Strong Password
                                </strong>

                                <small>
                                    Use at least 6 characters
                                </small>

                            </div>

                        </div>


                        <div className="reset-security-item">

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Account Protection
                                </strong>

                                <small>
                                    Keep your banking information safe
                                </small>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="reset-brand-footer">

                    <span>
                        © 2026 BankEase
                    </span>

                    <span>
                        Secure Digital Banking Platform
                    </span>

                </div>

            </section>


            {/* =========================================
                RIGHT FORM SECTION
            ========================================= */}

            <section className="reset-form-section">

                <div className="reset-password-card">

                    {/* Mobile Branding */}

                    <div className="reset-mobile-brand">

                        <div className="reset-mobile-logo">

                            <div className="reset-bank-roof">
                            </div>

                            <div className="reset-bank-building">

                                <span></span>
                                <span></span>
                                <span></span>

                            </div>

                        </div>


                        <div>

                            <h1>
                                Bank<span>Ease</span>
                            </h1>

                            <p>
                                Digital Banking
                            </p>

                        </div>

                    </div>


                    {/* Heading */}

                    <div className="reset-heading">

                        <span className="reset-welcome-label">
                            PASSWORD RECOVERY
                        </span>

                        <div className="reset-heading-icon">
                            🔑
                        </div>

                        <h2>
                            Reset your password
                        </h2>

                        <p>
                            Create a new password for your
                            BankEase account.
                        </p>

                    </div>


                    {/* Form */}

                    <form
                        onSubmit={handleResetPassword}
                        className="reset-password-form"
                    >

                        {/* Reset Token */}

                        <div className="reset-input-group">

                            <label htmlFor="reset-token">
                                Reset Token
                            </label>

                            <div className="reset-input-wrapper">

                                <span className="reset-input-icon">
                                    🔐
                                </span>

                                <input
                                    id="reset-token"
                                    type="text"
                                    placeholder="Enter your reset token"
                                    value={resetToken}
                                    onChange={(e) =>
                                        setResetToken(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="off"
                                />

                            </div>


                            {tokenFromForgotPassword && (

                                <div className="reset-token-note">

                                    <span>
                                        ✓
                                    </span>

                                    Reset token automatically
                                    received from Forgot Password.

                                </div>

                            )}

                        </div>


                        {/* New Password */}

                        <div className="reset-input-group">

                            <label htmlFor="new-password">
                                New Password
                            </label>

                            <div className="reset-input-wrapper">

                                <span className="reset-input-icon">
                                    🔒
                                </span>

                                <input
                                    id="new-password"
                                    type={
                                        showNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="reset-password-toggle"
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

                        </div>


                        {/* Confirm Password */}

                        <div className="reset-input-group">

                            <label htmlFor="confirm-password">
                                Confirm Password
                            </label>

                            <div className="reset-input-wrapper">

                                <span className="reset-input-icon">
                                    🔒
                                </span>

                                <input
                                    id="confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="reset-password-toggle"
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


                        {/* Reset Button */}

                        <button
                            type="submit"
                            className="reset-submit-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="reset-spinner">
                                    </span>

                                    Resetting...
                                </>
                            ) : (
                                <>
                                    Reset Password

                                    <span>
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </form>


                    {/* Message */}

                    {message && (

                        <div
                            className={
                                success
                                    ? "reset-password-message success"
                                    : "reset-password-message error"
                            }
                        >

                            <span>
                                {success
                                    ? "✓"
                                    : "!"}
                            </span>

                            <p>
                                {message}
                            </p>

                        </div>

                    )}


                    {/* Success Action */}

                    {success && (

                        <button
                            type="button"
                            className="reset-login-button"
                            onClick={() =>
                                navigate("/")
                            }
                        >

                            Go to Login

                            <span>
                                →
                            </span>

                        </button>

                    )}


                    {/* Back Action */}

                    {!success && (

                        <div className="reset-back-section">

                            <Link to="/forgot-password">
                                ← Back to Forgot Password
                            </Link>

                        </div>

                    )}


                    {/* Register */}

                    <div className="reset-register-section">

                        <span>
                            Don't have a BankEase account?
                        </span>

                        <Link to="/register">
                            Create an account
                        </Link>

                    </div>


                    {/* Admin */}

                    <div className="reset-admin-section">

                        <Link to="/admin/login">

                            <span>
                                Administration Portal
                            </span>

                            <span>
                                →
                            </span>

                        </Link>

                    </div>


                    {/* Security Note */}

                    <div className="reset-security-note">

                        <span>
                            🔐
                        </span>

                        <p>
                            Your information is protected
                            with secure authentication.
                        </p>

                    </div>

                </div>

            </section>

        </div>

    );

}

export default ResetPassword;