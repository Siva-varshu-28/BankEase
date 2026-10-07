import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const [stripeAccountId, setStripeAccountId] =
        useState("");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] =
        useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setStripeAccountId("");
        setLoading(true);

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                formData
                            )
                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                setMessage(
                    `Registration successful! Account No: ${data.accountNumber}`
                );

                setStripeAccountId(
                    data.stripeAccountId || ""
                );

                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    password: ""
                });

            } else {

                setMessage(
                    data.message ||
                    "Registration failed."
                );

            }

        } catch (error) {

            console.error(
                "Registration Error:",
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

        <div className="register-page">

            {/* =========================================
                LEFT BRAND SECTION
            ========================================= */}

            <section className="register-brand-section">

                <div className="register-brand-content">

                    <div className="register-brand-logo">

                        <div className="register-logo-icon">

                            <div className="register-bank-roof">
                            </div>

                            <div className="register-bank-building">

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


                    <div className="register-brand-message">

                        <span className="register-brand-tag">
                            START YOUR BANKING JOURNEY
                        </span>

                        <h2>
                            Your banking,
                            <br />
                            <span>made easier.</span>
                        </h2>

                        <p>
                            Create your BankEase account and
                            securely manage your money, payments
                            and everyday banking from one place.
                        </p>

                    </div>


                    <div className="register-benefits">

                        <div className="register-benefit">

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Simple Account Setup
                                </strong>

                                <small>
                                    Register securely in a few steps
                                </small>

                            </div>

                        </div>


                        <div className="register-benefit">

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Secure Banking
                                </strong>

                                <small>
                                    Your account is protected
                                </small>

                            </div>

                        </div>


                        <div className="register-benefit">

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Complete Control
                                </strong>

                                <small>
                                    Access your banking anytime
                                </small>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="register-brand-footer">

                    <span>
                        © 2026 BankEase
                    </span>

                    <span>
                        Secure Digital Banking Platform
                    </span>

                </div>

            </section>


            {/* =========================================
                RIGHT REGISTER SECTION
            ========================================= */}

            <section className="register-form-section">

                <div className="register-card">

                    {/* Mobile Branding */}

                    <div className="register-mobile-brand">

                        <div className="register-mobile-logo">

                            <div className="register-bank-roof">
                            </div>

                            <div className="register-bank-building">

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

                    <div className="register-heading">

                        <span className="register-welcome-label">
                            CREATE YOUR ACCOUNT
                        </span>

                        <h2>
                            Get started with BankEase
                        </h2>

                        <p>
                            Enter your details to create your
                            secure digital banking account.
                        </p>

                    </div>


                    {/* Registration Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="register-form"
                    >

                        {/* Full Name */}

                        <div className="register-input-group">

                            <label htmlFor="register-name">
                                Full Name
                            </label>

                            <div className="register-input-wrapper">

                                <span className="register-input-icon">
                                    👤
                                </span>

                                <input
                                    id="register-name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    required
                                />

                            </div>

                        </div>


                        {/* Email */}

                        <div className="register-input-group">

                            <label htmlFor="register-email">
                                Email Address
                            </label>

                            <div className="register-input-wrapper">

                                <span className="register-input-icon">
                                    @
                                </span>

                                <input
                                    id="register-email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    required
                                />

                            </div>

                        </div>


                        {/* Phone */}

                        <div className="register-input-group">

                            <label htmlFor="register-phone">
                                Phone Number
                            </label>

                            <div className="register-input-wrapper">

                                <span className="register-input-icon">
                                    ☎
                                </span>

                                <input
                                    id="register-phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                    required
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div className="register-input-group">

                            <label htmlFor="register-password">
                                Password
                            </label>

                            <div className="register-input-wrapper">

                                <span className="register-input-icon">
                                    🔒
                                </span>

                                <input
                                    id="register-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Create a secure password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
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
                                        : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* Create Account */}

                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="register-spinner">
                                    </span>

                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account

                                    <span className="register-button-arrow">
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </form>


                    {/* Success / Error Message */}

                    {message && (

                        <div
                            className={
                                message.startsWith(
                                    "Registration successful!"
                                )
                                    ? "register-message success"
                                    : "register-message error"
                            }
                        >

                            <span>
                                {message.startsWith(
                                    "Registration successful!"
                                )
                                    ? "✓"
                                    : "!"}
                            </span>

                            <p>
                                {message}
                            </p>

                        </div>

                    )}


                    {/* Demo Account Reference */}

                    {stripeAccountId && (

                        <div className="stripe-demo-box">

                            <div className="stripe-demo-title">
                                Demo Account Reference
                            </div>

                            <div className="stripe-demo-label">
                                Demo Stripe Account ID
                            </div>

                            <div className="stripe-demo-value">
                                {stripeAccountId}
                            </div>

                            <small>
                                This reference is used only
                                for the BankEase demo environment.
                            </small>

                        </div>

                    )}


                    {/* Login Link */}

                    <div className="register-login-section">

                        <span>
                            Already have a BankEase account?
                        </span>

                        <Link to="/">
                            Sign in
                        </Link>

                    </div>


                    {/* Admin Portal */}

                    <div className="register-admin-section">

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

                    <div className="register-security-note">

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

export default Register;