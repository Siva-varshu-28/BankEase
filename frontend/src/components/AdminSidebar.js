import React from "react";

import {
    useNavigate
} from "react-router-dom";

import "./AdminSidebar.css";


function AdminSidebar({ activePage }) {

    const navigate = useNavigate();


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/admin/login");

    };


    // =====================================================
    // NAVIGATION
    // =====================================================

    const goTo = (path) => {

        navigate(path);

    };


    // =====================================================
    // NAVIGATION ITEMS
    // =====================================================

    const navigationItems = [

        {
            id: "dashboard",
            label: "Dashboard",
            icon: "📊",
            path: "/admin/dashboard"
        },

        {
            id: "customers",
            label: "Customers",
            icon: "👥",
            path: "/admin/customers"
        },

        {
            id: "transactions",
            label: "Transactions",
            icon: "💳",
            path: "/admin/transactions"
        },

        {
            id: "support",
            label: "Support",
            icon: "🆘",
            path: "/admin/support"
        }

    ];


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <aside className="common-admin-sidebar">


            {/* =================================================
                BRAND
            ================================================= */}

            <div className="common-admin-logo">


                <div className="common-admin-logo-icon">

                    <div className="common-bank-roof">
                    </div>


                    <div className="common-bank-building">

                        <span></span>
                        <span></span>
                        <span></span>

                    </div>

                </div>


                <div className="common-admin-logo-text">

                    <h2>
                        BankEase
                    </h2>

                    <span>
                        Administration
                    </span>

                </div>


            </div>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav
                className="common-admin-nav"
                aria-label="Admin navigation"
            >

                <div className="common-admin-nav-label">
                    Management
                </div>


                {navigationItems.map(
                    (item) => (

                        <button
                            key={item.id}
                            type="button"
                            className={
                                activePage === item.id
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                goTo(item.path)
                            }
                            aria-current={
                                activePage === item.id
                                    ? "page"
                                    : undefined
                            }
                        >

                            <span className="common-nav-icon">
                                {item.icon}
                            </span>

                            <span className="common-nav-label">
                                {item.label}
                            </span>

                        </button>

                    )
                )}

            </nav>


            {/* =================================================
                SIDEBAR BOTTOM
            ================================================= */}

            <div className="common-admin-sidebar-bottom">


                <div className="common-admin-security-badge">

                    <div className="common-admin-security-icon">
                        🔐
                    </div>


                    <div>

                        <strong>
                            Secure Admin
                        </strong>

                        <span>
                            Authorized access only
                        </span>

                    </div>

                </div>


                {/* LOGOUT */}

                <button
                    type="button"
                    className="common-admin-logout"
                    onClick={handleLogout}
                >

                    <span className="common-nav-icon">
                        🚪
                    </span>

                    <span className="common-nav-label">
                        Logout
                    </span>

                </button>


            </div>


        </aside>

    );

}


export default AdminSidebar;