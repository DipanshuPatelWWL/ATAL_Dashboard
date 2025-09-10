import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext/AuthContext";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Banknote,
  Globe,
  FileBadge,
  ShieldCheck,
} from "lucide-react";

export default function VendorHome() {
  const { user } = useAuth();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.name || "Vendor"}
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your Canadian business profile and services here.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Company Info */}
        <div className="bg-white p-3 rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <Building2 className="text-blue-500" size={28} />
            <h2 className="text-lg font-semibold">Company</h2>
          </div>
          <p className="text-xl font-bold mt-4">Optical Suppliers Canada Ltd</p>
          <p className="text-gray-600 mt-1">Business No: 123456789</p>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-3 rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <Phone className="text-green-500" size={28} />
            <h2 className="text-lg font-semibold">Contact</h2>
          </div>
          <p className="text-xl font-bold mt-4">+1 (416) 555-1234</p>
          <p className="text-gray-600 mt-1">Toronto Office</p>
        </div>

        {/* Email */}
        <div className="bg-white p-3 rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <Mail className="text-yellow-500" size={28} />
            <h2 className="text-lg font-semibold">Email</h2>
          </div>
          <p className="text-xl font-bold mt-4">canada.vendor@email.com</p>
          <p className="text-gray-600 mt-1">Support & Inquiries</p>
        </div>

        {/* Address */}
        <div className="bg-white p-3 rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <MapPin className="text-purple-500" size={28} />
            <h2 className="text-lg font-semibold">Address</h2>
          </div>
          <p className="text-xl font-bold mt-4">123 Bay Street</p>
          <p className="text-gray-600">Toronto, ON, M5J 2N8</p>
          <p className="text-gray-600">Canada</p>
        </div>

        {/* Banking */}
        <div className="bg-white p-3 rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <Banknote className="text-red-500" size={28} />
            <h2 className="text-lg font-semibold">Bank</h2>
          </div>
          <p className="text-xl font-bold mt-4">RBC Royal Bank</p>
          <p className="text-gray-600 mt-1">Transit: 00123 | Inst: 003</p>
          <p className="text-gray-600">Acct: ****5678</p>
        </div>

        {/* Website */}
        <div className="bg-white p-3 rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <Globe className="text-indigo-500" size={28} />
            <h2 className="text-lg font-semibold">Website</h2>
          </div>
          <p className="text-xl font-bold mt-4">www.opticalcanada.ca</p>
        </div>

        {/* Certifications */}
        <div className="bg-white p-3 rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <FileBadge className="text-teal-500" size={28} />
            <h2 className="text-lg font-semibold">Certifications</h2>
          </div>
          <p className="text-xl font-bold mt-4">ISO 9001</p>
          <p className="text-gray-600 mt-1">Health Canada Approved</p>
        </div>

        {/* Compliance */}
        <div className="bg-white p-3 rounded-2xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-pink-500" size={28} />
            <h2 className="text-lg font-semibold">Compliance</h2>
          </div>
          <p className="text-xl font-bold mt-4">GDPR, PIPEDA</p>
          <p className="text-gray-600 mt-1">Privacy & Security Standards</p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <Link
            to="/vendor"
            className="bg-blue-500 text-white text-center py-4 px-6 rounded-xl shadow hover:bg-blue-600 transition"
          >
            Manage Profile
          </Link>
          <Link
            to="/vendor"
            className="bg-green-500 text-white text-center py-4 px-6 rounded-xl shadow hover:bg-green-600 transition"
          >
            Manage Services
          </Link>
          <Link
            to="/vendor"
            className="bg-yellow-500 text-white text-center py-4 px-6 rounded-xl shadow hover:bg-yellow-600 transition"
          >
            Manage Products
          </Link>
          <Link
            to="/vendor/orders"
            className="bg-red-500 text-white text-center py-4 px-6 rounded-xl shadow hover:bg-red-600 transition"
          >
            Manage Orders
          </Link>
          <Link
            to="/vendor"
            className="bg-purple-500 text-white text-center py-4 px-6 rounded-xl shadow hover:bg-purple-600 transition"
          >
            Manage Payments
          </Link>
        </div>
      </div>
    </div>
  );
}
