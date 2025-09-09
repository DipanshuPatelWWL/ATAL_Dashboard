import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext/AuthContext";
import { BarChart3, List, Package, MessageSquare, Wrench } from "lucide-react";

export default function AdminHome() {
    const { user } = useAuth();

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome back, {user?.name || "Admin"}
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage your platform content and settings here.
                </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                        <List className="text-blue-500" size={28} />
                        <h2 className="text-lg font-semibold">Categories</h2>
                    </div>
                    <p className="text-2xl font-bold mt-4">12</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                        <Package className="text-green-500" size={28} />
                        <h2 className="text-lg font-semibold">Products</h2>
                    </div>
                    <p className="text-2xl font-bold mt-4">45</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="text-yellow-500" size={28} />
                        <h2 className="text-lg font-semibold">Reviews</h2>
                    </div>
                    <p className="text-2xl font-bold mt-4">30</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                        <Wrench className="text-purple-500" size={28} />
                        <h2 className="text-lg font-semibold">Services</h2>
                    </div>
                    <p className="text-2xl font-bold mt-4">8</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="text-red-500" size={28} />
                        <h2 className="text-lg font-semibold">FAQs</h2>
                    </div>
                    <p className="text-2xl font-bold mt-4">20</p>
                </div>
            </div>

            {/* Quick Navigation */}
            <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Navigation</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <Link
                        to="/admin/faq"
                        className="bg-blue-500 text-white text-center py-4 px-6 rounded-xl shadow hover:bg-blue-600 transition"
                    >
                        Manage FAQs
                    </Link>
                    <Link
                        to="/admin/category"
                        className="bg-green-500 text-white text-center py-4 px-6 rounded-xl shadow hover:bg-green-600 transition"
                    >
                        Manage Categories
                    </Link>
                    <Link
                        to="/admin/product"
                        className="bg-yellow-500 text-white text-center py-4 px-6 rounded-xl shadow hover:bg-yellow-600 transition"
                    >
                        Manage Products
                    </Link>
                    <Link
                        to="/admin/review"
                        className="bg-red-500 text-white text-center py-4 px-6 rounded-xl shadow hover:bg-red-600 transition"
                    >
                        Manage Reviews
                    </Link>
                    <Link
                        to="/admin/service"
                        className="bg-purple-500 text-white text-center py-4 px-6 rounded-xl shadow hover:bg-purple-600 transition"
                    >
                        Manage Services
                    </Link>
                </div>
            </div>
        </div>
    );
}
