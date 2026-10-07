import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");

        if (!email.trim()) {
            setMessage("Please enter your email address.");
            return;
        }

        if (!password) {
            setMessage("Please enter your password.");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setMessage(
                    data.message ||
                    "Invalid email or password."
                );

                return;
            }

            if (!data.token || !data.user) {

                setMessage(
                    "Invalid server response."
                );

                return;
            }

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setMessage(
                "Login successful!"
            );

            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login Error:",
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

        <div className="login-page">

            {/* =========================================
                LEFT BRANDING SECTION
            ========================================= */}

            <section className="login-brand-section">

                <div className="brand-content">

                    <div className="brand-logo">

                        <div className="brand-logo-icon">

                            <div className="bank-roof">
                            </div>

                            <div className="bank-building">

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


                    <div className="brand-message">

                        <span className="brand-tag">
                            SECURE DIGITAL BANKING
                        </span>

                        <h2>
                            Banking made
                            <br />
                            <span>simple and secure.</span>
                        </h2>

                        <p>
                            Manage your accounts, transfer money,
                            track transactions and take control
                            of your finances from one secure place.
                        </p>

                    </div>


                    <div className="security-points">

                        <div className="security-item">

                            <span className="security-icon">
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Secure Access
                                </strong>

                                <small>
                                    Protected banking environment
                                </small>

                            </div>

                        </div>


                        <div className="security-item">

                            <span className="security-icon">
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Easy Management
                                </strong>

                                <small>
                                    Manage your finances with ease
                                </small>

                            </div>

                        </div>


                        <div className="security-item">

                            <span className="security-icon">
                                ✓
                            </span>

                            <div>

                                <strong>
                                    24/7 Access
                                </strong>

                                <small>
                                    Your banking, anytime
                                </small>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="brand-footer">

                    <span>
                        © 2026 BankEase
                    </span>

                    <span>
                        Secure Digital Banking Platform
                    </span>

                </div>

            </section>


            {/* =========================================
                RIGHT LOGIN SECTION
            ========================================= */}

            <section className="login-form-section">

                <div className="login-card">

                    <div className="mobile-brand">

                        <div className="mobile-logo-icon">

                            <div className="bank-roof">
                            </div>

                            <div className="bank-building">

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


                    <div className="login-heading">

                        <span className="welcome-label">
                            WELCOME BACK
                        </span>

                        <h2>
                            Sign in to your account
                        </h2>

                        <p>
                            Enter your credentials to access
                            your BankEase account.
                        </p>

                    </div>


                    <form
                        onSubmit={handleLogin}
                        className="login-form"
                    >

                        {/* Email */}

                        <div className="input-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    @
                                </span>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    autoComplete="email"
                                    required
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div className="input-group">

                            <div className="password-label-row">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="forgot-password"
                                >
                                    Forgot password?
                                </Link>

                            </div>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    id="password"
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
                                    className="password-toggle"
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


                        {/* Login Button */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="button-spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <span className="button-arrow">
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
                                message === "Login successful!"
                                    ? "login-message success"
                                    : "login-message error"
                            }
                        >

                            <span>
                                {message === "Login successful!"
                                    ? "✓"
                                    : "!"}
                            </span>

                            <p>
                                {message}
                            </p>

                        </div>

                    )}


                    {/* Register */}

                    <div className="register-section">

                        <span>
                            Don't have a BankEase account?
                        </span>

                        <Link to="/register">
                            Create an account
                        </Link>

                    </div>


                    {/* Admin */}

                    <div className="admin-section">

                        <Link to="/admin/login">
                            <span>
                                Administration Portal
                            </span>

                            <span className="admin-arrow">
                                →
                            </span>
                        </Link>

                    </div>


                    <div className="login-security-note">

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

export default Login;