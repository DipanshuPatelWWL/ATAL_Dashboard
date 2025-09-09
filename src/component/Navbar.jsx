import React from "react";
import { useAuth } from "../authContext/AuthContext";
import logo from '../assets/image/logo.png'
const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md px-6 py-5 items-center">
            {user && (
                <div className="d-flex align-items-center flex justify-between">
                    <div>
                        <img src={logo} className="w-36 ml-10" />
                    </div>
                    <div className="items-center space-x-6 mt-4">
                        <span className="text-gray-600 text-xl">Hello, {user.name}</span>
                        <button onClick={logout}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xl hover:cursor-pointer">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
