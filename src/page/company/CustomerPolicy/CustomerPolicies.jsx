import React, { useEffect, useState } from "react";
import API from "../../../API/Api"; // 👈 adjust the path to your API instance
import { Search } from "lucide-react";

const CustomerPolicies = () => {
    const [policies, setPolicies] = useState([]);
    const [filteredPolicies, setFilteredPolicies] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // replace with actual companyId (e.g. from JWT or context)
    // const companyId = "68c155c9358b3b53b52f92b1";
    const companyData = JSON.parse(localStorage.getItem("user"));
    const companyId = companyData?._id;

    // console.log(companyId);


    useEffect(() => {
        if (companyId) {
            fetchPolicies();
        }
    }, [companyId]);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const res = await API.get(`/companyPolicies/${companyId}`);
            setPolicies(res.data.policies || []);
            setFilteredPolicies(res.data.policies || []);
        } catch (error) {
            console.error("Error fetching policies:", error);
        }
    };

    useEffect(() => {
        let filtered = [...policies];

        // Search by policy name
        if (search.trim() !== "") {
            filtered = filtered.filter((item) =>
                item.policyName?.toLowerCase().includes(search.toLowerCase())
            );
        }

        //  Filter by policy status (as string comparison)
        if (statusFilter !== "All") {
            filtered = filtered.filter(
                (item) => item?.status?.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        setFilteredPolicies(filtered);
    }, [search, statusFilter, policies]);


    return (
        <div className=" min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-red-600">Customer Policies</h1>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by policy name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                </div>

                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="All">All Policies</option>
                        <option value="Active">Active Policies</option>
                        <option value="Inactive">Inactive Policies</option>
                    </select>
                </div>
            </div>

            {/* 📊 Policies Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto">
                    <thead className="bg-red-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">Policy Name</th>
                            <th className="px-4 py-3 text-left">Price</th>
                            <th className="px-4 py-3 text-left">Customer Email</th>
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-left">Coverage</th>
                            <th className="px-4 py-3 text-left">Duration (Days)</th>
                            <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPolicies.length > 0 ? (
                            filteredPolicies.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3">{item?.policyName}</td>
                                    <td className="px-4 py-3">${item?.policyPrice}</td>
                                    <td className="px-4 py-3">{item?.customer.email}</td>
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        {item?.product?.image?.includes('http') ? (
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-10 h-8 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded text-sm font-medium">
                                                {item.product.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        <span>{item.product?.name}</span>
                                    </td>

                                    <td className="px-4 py-3">{item?.coverage}</td>
                                    <td className="px-4 py-3">{item?.durationDays}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${item?.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {item?.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-500 font-medium"
                                >
                                    No policies found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerPolicies;
