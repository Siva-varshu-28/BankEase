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

import "./Customers.css";


function Customers() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [customers, setCustomers] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedCustomer, setSelectedCustomer] =
        useState(null);


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
    // FETCH CUSTOMERS
    // =====================================================

    const fetchCustomers =
        useCallback(async () => {

            try {

                setLoading(true);
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
                        "http://localhost:5000/api/admin/customers",
                        {
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
                        "Failed to load customers"
                    );

                }


                setCustomers(
                    data.customers || []
                );


            } catch (fetchError) {

                console.error(
                    "Customers Error:",
                    fetchError
                );

                setError(
                    fetchError.message ||
                    "Unable to load customers"
                );

            } finally {

                setLoading(false);

            }

        }, [handleAdminSessionExpired]);


    useEffect(() => {

        fetchCustomers();

    }, [fetchCustomers]);


    // =====================================================
    // FILTERED CUSTOMERS
    // =====================================================

    const filteredCustomers =
        useMemo(() => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            if (!searchText) {
                return customers;
            }


            return customers.filter(
                (customer) => {

                    const name =
                        customer.name
                            ?.toLowerCase() || "";

                    const email =
                        customer.email
                            ?.toLowerCase() || "";

                    const phone =
                        customer.phone
                            ?.toString()
                            .toLowerCase() || "";

                    const accountNumber =
                        customer.accountNumber
                            ?.toString()
                            .toLowerCase() || "";


                    return (
                        name.includes(searchText) ||
                        email.includes(searchText) ||
                        phone.includes(searchText) ||
                        accountNumber.includes(searchText)
                    );

                }
            );

        }, [customers, search]);


    // =====================================================
    // CURRENCY FORMAT
    // =====================================================

    const formatCurrency = (amount) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2
            }
        ).format(amount || 0);

    };


    // =====================================================
    // VIEW CUSTOMER
    // =====================================================

    const handleViewCustomer =
        (customer) => {

            setSelectedCustomer(
                customer
            );

        };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        setSelectedCustomer(null);

    };


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

        <div className="customers-page">


            {/* =================================================
                COMMON ADMIN SIDEBAR
            ================================================= */}

            <AdminSidebar
                activePage="customers"
            />


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="customers-main">


                {/* =================================================
                    TOP BAR
                ================================================= */}

                <header className="customers-topbar">

                    <div>

                        <p className="customers-eyebrow">
                            Customer Administration
                        </p>

                        <h1>
                            Customer Management
                        </h1>

                        <p>
                            Review customer accounts and account information.
                        </p>

                    </div>


                    <div className="customers-topbar-actions">

                        <button
                            type="button"
                            className="customers-refresh-button"
                            onClick={fetchCustomers}
                            disabled={loading}
                        >
                            {loading
                                ? "Refreshing..."
                                : "↻ Refresh"
                            }
                        </button>


                        <div className="customers-admin-profile">

                            <div className="customers-profile-avatar">
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
                    ERROR
                ================================================= */}

                {error && (

                    <div className="customers-alert error">
                        {error}
                    </div>

                )}


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <section className="customers-stats">


                    {/* TOTAL CUSTOMERS */}

                    <div className="customers-stat-card">

                        <div className="customers-stat-icon total">
                            👥
                        </div>


                        <div>

                            <span>
                                Total Customers
                            </span>

                            <h2>
                                {customers.length}
                            </h2>

                        </div>

                    </div>


                    {/* SEARCH RESULTS */}

                    <div className="customers-stat-card">

                        <div className="customers-stat-icon search">
                            🔎
                        </div>


                        <div>

                            <span>
                                Search Results
                            </span>

                            <h2>
                                {filteredCustomers.length}
                            </h2>

                        </div>

                    </div>


                    {/* ACTIVE VIEW */}

                    <div className="customers-stat-card">

                        <div className="customers-stat-icon accounts">
                            🏦
                        </div>


                        <div>

                            <span>
                                Accounts Listed
                            </span>

                            <h2>
                                {customers.length}
                            </h2>

                        </div>

                    </div>


                </section>


                {/* =================================================
                    SEARCH SECTION
                ================================================= */}

                <section className="customers-search-section">

                    <div className="customers-search-header">

                        <div>

                            <p className="customers-section-eyebrow">
                                Customer Directory
                            </p>

                            <h2>
                                Search Customers
                            </h2>

                            <p>
                                Search using name, email, phone or account number.
                            </p>

                        </div>

                    </div>


                    <div className="customers-search-box">

                        <div className="customers-search-icon">
                            🔎
                        </div>


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search by name, email, phone or account number..."
                            aria-label="Search customers"
                        />


                        {search && (

                            <button
                                type="button"
                                className="customers-clear-search"
                                onClick={() =>
                                    setSearch("")
                                }
                                aria-label="Clear search"
                            >
                                ×
                            </button>

                        )}

                    </div>

                </section>


                {/* =================================================
                    CUSTOMER TABLE
                ================================================= */}

                <section className="customers-table-section">


                    <div className="customers-section-header">

                        <div>

                            <p className="customers-section-eyebrow">
                                Account Directory
                            </p>

                            <h2>
                                Registered Customers
                            </h2>

                            <p>
                                Customer records available in BankEase administration.
                            </p>

                        </div>

                        <div className="customers-result-badge">
                            {filteredCustomers.length} Records
                        </div>

                    </div>


                    {loading ? (

                        <div className="customers-loading-card">

                            <div className="customers-loading-spinner">
                            </div>

                            <strong>
                                Loading customer records
                            </strong>

                            <p>
                                Please wait while the latest account data is retrieved.
                            </p>

                        </div>

                    ) : filteredCustomers.length === 0 ? (

                        <div className="customers-empty">

                            <div className="customers-empty-icon">
                                👥
                            </div>

                            <h3>
                                No customers found
                            </h3>

                            <p>
                                Try a different name, email, phone number or account number.
                            </p>


                            {search && (

                                <button
                                    type="button"
                                    className="customers-empty-button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    Clear Search
                                </button>

                            )}

                        </div>

                    ) : (

                        <div className="customers-table-wrapper">

                            <table className="customers-table">

                                <thead>

                                    <tr>

                                        <th>
                                            CUSTOMER
                                        </th>

                                        <th>
                                            EMAIL
                                        </th>

                                        <th>
                                            PHONE
                                        </th>

                                        <th>
                                            ACCOUNT
                                        </th>

                                        <th>
                                            BALANCE
                                        </th>

                                        <th>
                                            ROLE
                                        </th>

                                        <th>
                                            ACTION
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredCustomers.map(
                                        (customer) => (

                                            <tr
                                                key={
                                                    customer._id
                                                }
                                            >


                                                {/* CUSTOMER */}

                                                <td>

                                                    <div className="customer-name-cell">

                                                        <div className="customer-avatar">

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
                                                                Customer
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* EMAIL */}

                                                <td>

                                                    <span className="customer-email">

                                                        {
                                                            customer.email ||
                                                            "-"
                                                        }

                                                    </span>

                                                </td>


                                                {/* PHONE */}

                                                <td>

                                                    <span className="customer-phone">

                                                        {
                                                            customer.phone ||
                                                            "-"
                                                        }

                                                    </span>

                                                </td>


                                                {/* ACCOUNT */}

                                                <td>

                                                    <span className="customer-account-number">

                                                        {
                                                            customer.accountNumber ||
                                                            "-"
                                                        }

                                                    </span>

                                                </td>


                                                {/* BALANCE */}

                                                <td>

                                                    <strong className="customer-balance">

                                                        {
                                                            formatCurrency(
                                                                customer.balance
                                                            )
                                                        }

                                                    </strong>

                                                </td>


                                                {/* ROLE */}

                                                <td>

                                                    <span className="customer-role">

                                                        {
                                                            (
                                                                customer.role ||
                                                                "user"
                                                            ).toUpperCase()
                                                        }

                                                    </span>

                                                </td>


                                                {/* ACTION */}

                                                <td>

                                                    <button
                                                        type="button"
                                                        className="customer-view-btn"
                                                        onClick={() =>
                                                            handleViewCustomer(
                                                                customer
                                                            )
                                                        }
                                                    >
                                                        View Details
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


                {/* =================================================
                    SECURITY NOTE
                ================================================= */}

                <div className="customers-security-note">

                    <div className="customers-security-icon">
                        🔐
                    </div>

                    <div>

                        <strong>
                            Customer data protection
                        </strong>

                        <p>
                            Customer information displayed here is restricted
                            to authorized BankEase administrators.
                        </p>

                    </div>

                </div>


            </main>


            {/* =================================================
                CUSTOMER DETAILS MODAL
            ================================================= */}

            {selectedCustomer && (

                <div
                    className="customer-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="customer-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="customer-modal-header">

                            <div>

                                <p className="customer-modal-eyebrow">
                                    Customer Profile
                                </p>

                                <h2>
                                    Customer Details
                                </h2>

                                <p>
                                    Complete account information
                                </p>

                            </div>


                            <button
                                type="button"
                                className="customer-modal-close"
                                onClick={closeModal}
                                aria-label="Close customer details"
                            >
                                ×
                            </button>

                        </div>


                        {/* CUSTOMER PROFILE */}

                        <div className="customer-modal-profile">

                            <div className="customer-modal-avatar">

                                {
                                    selectedCustomer.name
                                        ?.charAt(0)
                                        ?.toUpperCase() ||
                                    "U"
                                }

                            </div>


                            <div>

                                <h3>
                                    {
                                        selectedCustomer.name ||
                                        "Unknown Customer"
                                    }
                                </h3>

                                <span>
                                    {
                                        selectedCustomer.email ||
                                        "-"
                                    }
                                </span>

                            </div>

                        </div>


                        {/* CUSTOMER DETAILS */}

                        <div className="customer-details-grid">


                            <div className="customer-detail-item">

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {
                                        selectedCustomer.phone ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="customer-detail-item">

                                <span>
                                    Account Number
                                </span>

                                <strong>
                                    {
                                        selectedCustomer.accountNumber ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="customer-detail-item">

                                <span>
                                    Available Balance
                                </span>

                                <strong className="modal-balance">

                                    {
                                        formatCurrency(
                                            selectedCustomer.balance
                                        )
                                    }

                                </strong>

                            </div>


                            <div className="customer-detail-item">

                                <span>
                                    Account Role
                                </span>

                                <strong className="modal-role">
                                    {
                                        selectedCustomer.role ||
                                        "user"
                                    }
                                </strong>

                            </div>


                            <div className="customer-detail-item customer-detail-wide">

                                <span>
                                    Customer ID
                                </span>

                                <strong className="customer-id-value">
                                    {
                                        selectedCustomer._id ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="customer-detail-item">

                                <span>
                                    Registered
                                </span>

                                <strong>

                                    {
                                        selectedCustomer.createdAt
                                            ? new Date(
                                                selectedCustomer.createdAt
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )
                                            : "-"
                                    }

                                </strong>

                            </div>


                        </div>


                        {/* MODAL FOOTER */}

                        <div className="customer-modal-footer">

                            <button
                                type="button"
                                onClick={closeModal}
                                className="customer-modal-done"
                            >
                                Close
                            </button>

                        </div>


                    </div>

                </div>

            )}


        </div>

    );

}


export default Customers;