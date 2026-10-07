import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./AdminLogin.css";


function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [showPassword, setShowPassword] =
        useState(false);


    // =====================================================
    // ADMIN LOGIN
    // =====================================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");


        if (!email.trim()) {

            setMessage(
                "Please enter your admin email address."
            );

            return;

        }


        if (!password) {

            setMessage(
                "Please enter your password."
            );

            return;

        }


        setLoading(true);


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email:
                                email.trim(),

                            password:
                                password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                setMessage(
                    data.message ||
                    "Invalid email or password."
                );

                return;

            }


            if (
                !data.token ||
                !data.user
            ) {

                setMessage(
                    "Invalid server response."
                );

                return;

            }


            // =================================================
            // ADMIN ROLE CHECK
            // =================================================

            if (
                data.user.role !==
                "admin"
            ) {

                setMessage(
                    "This account does not have administrator access."
                );

                return;

            }


            localStorage.setItem(
                "token",
                data.token
            );


            localStorage.setItem(
                "user",
                JSON.stringify(
                    data.user
                )
            );


            setMessage(
                "Admin login successful!"
            );


            navigate(
                "/admin/dashboard"
            );


        } catch (error) {

            console.error(
                "Admin Login Error:",
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

        <div className="admin-login-page">


            {/* =================================================
                LEFT BRANDING SECTION
            ================================================= */}

            <section className="admin-login-brand-section">

                <div className="admin-brand-content">


                    {/* =================================================
                        BRAND LOGO
                    ================================================= */}

                    <div className="admin-brand-logo">


                        <div className="admin-brand-logo-icon">

                            <div className="admin-bank-roof">
                            </div>


                            <div className="admin-bank-building">

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
                                Administration
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        BRAND MESSAGE
                    ================================================= */}

                    <div className="admin-brand-message">

                        <span className="admin-brand-tag">
                            SECURE ADMINISTRATION
                        </span>


                        <h2>

                            Manage BankEase
                            <br />

                            <span>
                                with confidence.
                            </span>

                        </h2>


                        <p>
                            Monitor customers, review transactions,
                            manage support requests and oversee the
                            BankEase digital banking platform from
                            one secure administration portal.
                        </p>

                    </div>


                    {/* =================================================
                        SECURITY POINTS
                    ================================================= */}

                    <div className="admin-security-points">


                        <div className="admin-security-item">

                            <span className="admin-security-icon">
                                ✓
                            </span>


                            <div>

                                <strong>
                                    Secure Administration
                                </strong>

                                <small>
                                    Protected administrative environment
                                </small>

                            </div>

                        </div>


                        <div className="admin-security-item">

                            <span className="admin-security-icon">
                                ✓
                            </span>


                            <div>

                                <strong>
                                    Customer Management
                                </strong>

                                <small>
                                    Review and manage customer accounts
                                </small>

                            </div>

                        </div>


                        <div className="admin-security-item">

                            <span className="admin-security-icon">
                                ✓
                            </span>


                            <div>

                                <strong>
                                    Transaction Monitoring
                                </strong>

                                <small>
                                    Monitor banking activity securely
                                </small>

                            </div>

                        </div>

                    </div>


                </div>


                {/* =================================================
                    BRAND FOOTER
                ================================================= */}

                <div className="admin-brand-footer">

                    <span>
                        © 2026 BankEase
                    </span>

                    <span>
                        Secure Administration Portal
                    </span>

                </div>


            </section>


            {/* =================================================
                RIGHT LOGIN SECTION
            ================================================= */}

            <section className="admin-login-form-section">


                <div className="admin-login-card">


                    {/* =================================================
                        MOBILE BRAND
                    ================================================= */}

                    <div className="admin-mobile-brand">


                        <div className="admin-mobile-logo-icon">

                            <div className="admin-bank-roof">
                            </div>


                            <div className="admin-bank-building">

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
                                Administration
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        LOGIN HEADING
                    ================================================= */}

                    <div className="admin-login-heading">

                        <span className="admin-welcome-label">
                            ADMINISTRATION PORTAL
                        </span>


                        <h2>
                            Sign in to administration
                        </h2>


                        <p>
                            Enter your administrator credentials
                            to access the BankEase control panel.
                        </p>

                    </div>


                    {/* =================================================
                        LOGIN FORM
                    ================================================= */}

                    <form
                        onSubmit={handleLogin}
                        className="admin-login-form"
                    >


                        {/* EMAIL */}

                        <div className="admin-input-group">

                            <label htmlFor="admin-email">
                                Email Address
                            </label>


                            <div className="admin-input-wrapper">

                                <span className="admin-input-icon">
                                    @
                                </span>


                                <input
                                    id="admin-email"
                                    type="email"
                                    placeholder="Enter your admin email address"
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


                        {/* PASSWORD */}

                        <div className="admin-input-group">


                            <div className="admin-password-label-row">

                                <label htmlFor="admin-password">
                                    Password
                                </label>


                                <Link
                                    to="/forgot-password"
                                    className="admin-forgot-password"
                                >
                                    Forgot password?
                                </Link>

                            </div>


                            <div className="admin-input-wrapper">

                                <span className="admin-input-icon">
                                    🔒
                                </span>


                                <input
                                    id="admin-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="current-password"
                                    required
                                />


                                <button
                                    type="button"
                                    className="admin-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"
                                    }
                                </button>

                            </div>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="admin-login-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>

                                    <span className="admin-button-spinner">
                                    </span>

                                    Signing in...

                                </>

                            ) : (

                                <>

                                    Sign In

                                    <span className="admin-button-arrow">
                                        →
                                    </span>

                                </>

                            )}

                        </button>


                    </form>


                    {/* =================================================
                        MESSAGE
                    ================================================= */}

                    {message && (

                        <div
                            className={
                                message ===
                                "Admin login successful!"
                                    ? "admin-login-message success"
                                    : "admin-login-message error"
                            }
                        >

                            <span>
                                {
                                    message ===
                                    "Admin login successful!"
                                        ? "✓"
                                        : "!"
                                }
                            </span>


                            <p>
                                {message}
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        CUSTOMER LOGIN
                    ================================================= */}

                    <div className="admin-customer-login-section">

                        <span>
                            Looking for customer banking?
                        </span>


                        <Link to="/">
                            Customer Login
                        </Link>

                    </div>


                    {/* =================================================
                        SECURITY NOTE
                    ================================================= */}

                    <div className="admin-login-security-note">

                        <span>
                            🔐
                        </span>


                        <p>
                            Administrator access is restricted
                            to authorized BankEase personnel.
                        </p>

                    </div>


                </div>

            </section>

        </div>

    );

}


export default AdminLogin;