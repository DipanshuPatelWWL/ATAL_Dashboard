import React from "react";
import { useAuth } from "../authContext/AuthContext";
import logo from "../assets/image/logo.png";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed left-0 w-full z-50 bg-white shadow-md px-6 py-4">
            {user && (
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div>
                        <img src={logo} alt="Logo" className="w-36 ml-4" />
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-6">
                        <span className="text-gray-600 text-lg">Hello, {user.name}</span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-lg hover:bg-red-600 transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
