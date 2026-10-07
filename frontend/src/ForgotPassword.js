import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        if (!email.trim()) {

            setMessage(
                "Please enter your registered email address."
            );

            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email.trim()
                    })
                }
            );

            const data = await response.json();


            if (!response.ok) {

                setMessage(
                    data.message ||
                    "Unable to process your request."
                );

                return;
            }


            /*
             * Demo project:
             * Backend returns resetToken.
             * In a real banking system,
             * the token would normally be
             * delivered through email.
             */

            if (data.resetToken) {

                navigate(
                    "/reset-password",
                    {
                        state: {
                            resetToken:
                                data.resetToken
                        }
                    }
                );

                return;
            }


            setMessage(
                data.message ||
                "If the email is registered, password reset instructions have been generated."
            );

        } catch (error) {

            console.error(
                "Forgot Password Error:",
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

        <div className="forgot-password-page">

            {/* =========================================
                LEFT BRAND SECTION
            ========================================= */}

            <section className="forgot-brand-section">

                <div className="forgot-brand-content">

                    <div className="forgot-brand-logo">

                        <div className="forgot-logo-icon">

                            <div className="forgot-bank-roof">
                            </div>

                            <div className="forgot-bank-building">

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


                    <div className="forgot-brand-message">

                        <span className="forgot-brand-tag">
                            ACCOUNT SECURITY
                        </span>

                        <h2>
                            Stay secure,
                            <br />
                            <span>stay in control.</span>
                        </h2>

                        <p>
                            Recover your BankEase account
                            securely and get back to managing
                            your banking with confidence.
                        </p>

                    </div>


                    <div className="forgot-security-points">

                        <div className="forgot-security-item">

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Secure Recovery
                                </strong>

                                <small>
                                    Protected password recovery process
                                </small>

                            </div>

                        </div>


                        <div className="forgot-security-item">

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Account Protection
                                </strong>

                                <small>
                                    Your account remains protected
                                </small>

                            </div>

                        </div>


                        <div className="forgot-security-item">

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Easy Access
                                </strong>

                                <small>
                                    Quickly return to your banking
                                </small>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="forgot-brand-footer">

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

            <section className="forgot-form-section">

                <div className="forgot-password-card">

                    {/* Mobile Branding */}

                    <div className="forgot-mobile-brand">

                        <div className="forgot-mobile-logo">

                            <div className="forgot-bank-roof">
                            </div>

                            <div className="forgot-bank-building">

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

                    <div className="forgot-heading">

                        <span className="forgot-welcome-label">
                            ACCOUNT RECOVERY
                        </span>

                        <div className="forgot-heading-icon">
                            🔐
                        </div>

                        <h2>
                            Forgot your password?
                        </h2>

                        <p>
                            Enter your registered email address
                            and we'll help you reset your password.
                        </p>

                    </div>


                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="forgot-password-form"
                    >

                        <div className="forgot-input-group">

                            <label htmlFor="forgot-email">
                                Registered Email
                            </label>

                            <div className="forgot-input-wrapper">

                                <span className="forgot-input-icon">
                                    @
                                </span>

                                <input
                                    id="forgot-email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="email"
                                    required
                                />

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="forgot-submit-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="forgot-spinner">
                                    </span>

                                    Processing...
                                </>
                            ) : (
                                <>
                                    Continue

                                    <span>
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </form>


                    {/* Message */}

                    {message && (

                        <div className="forgot-password-message">

                            <span>
                                !
                            </span>

                            <p>
                                {message}
                            </p>

                        </div>

                    )}


                    {/* Back to login */}

                    <div className="forgot-back-section">

                        <Link to="/">
                            ← Back to Login
                        </Link>

                    </div>


                    {/* Register */}

                    <div className="forgot-register-section">

                        <span>
                            Don't have a BankEase account?
                        </span>

                        <Link to="/register">
                            Create an account
                        </Link>

                    </div>


                    {/* Admin */}

                    <div className="forgot-admin-section">

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

                    <div className="forgot-security-note">

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

export default ForgotPassword;