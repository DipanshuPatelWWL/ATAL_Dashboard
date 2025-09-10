import React from 'react'
import { Link, Outlet } from 'react-router-dom';

const CompanyDashboard = () => {

    const menuItems = [
        { name: "Home", path: "/company/home" },
        { name: "Services", path: "/company/services" },
        { name: "Project", path: "/company/project" },
        { name: "Team", path: "/company/team" },
        { name: "Profile", path: "/company/profile" },
        { name: "FAQ", path: "/company/faq" },
    ];

    return (
        <>
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <div className="w-64 bg-white shadow-lg p-5">
                    {/* <h2 className="text-xl font-bold mb-6"></h2> */}
                    <nav className="space-y-2 text-center text-lg font-semibold mt-4">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`border-b-1 block px-4 py-2 rounded hover:bg-red-500 hover:text-white ${location.pathname === item.path
                                    ? "bg-red-500 text-white"
                                    : "text-gray-700"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Page Content */}
                    <main className="flex-1 p-4">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    )
}

export default CompanyDashboard
