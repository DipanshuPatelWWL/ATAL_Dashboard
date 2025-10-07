import React, { useEffect, useState } from "react";
import API from "../../../API/Api"; // your axios instance
import Swal from "sweetalert2";

const CustomerClaims = () => {
    const [claims, setClaims] = useState([]);

    // Fetch all claims
    const fetchClaims = async () => {
        try {
            const res = await API.get("/claims");
            setClaims(res.data);
        } catch (err) {
            console.error("Failed to fetch claims", err);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    // Approve or Reject Claim
    const handleStatusChange = async (claimId, status) => {
        const result = await Swal.fire({
            title: `Are you sure you want to ${status.toLowerCase()} this claim?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Yes, ${status}`,
        });

        if (!result.isConfirmed) return;

        try {
            await API.put(`/claims/${claimId}`, { status });
            Swal.fire("Success", `Claim ${status}`, "success");
            fetchClaims(); // refresh list
        } catch (err) {
            Swal.fire("Error", "Failed to update claim", "error");
        }
    };


    console.log(claims);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Customer Claim Requests</h2>

            {claims.length === 0 ? (
                <p>No claim requests found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 shadow-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3 text-left">Customer</th>
                                <th className="p-3 text-left">Order ID</th>
                                <th className="p-3 text-left">Incident Date</th>
                                <th className="p-3 text-left">Description</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claims.map((claim) => (
                                <tr key={claim._id} className="border-t">
                                    <td className="p-3">{claim.orderId?.billingAddress?.fullName || "N/A"}</td>
                                    <td className="p-3">{claim.orderId?._id}</td>
                                    <td className="p-3">
                                        {claim.incidentDate
                                            ? new Date(claim.incidentDate).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td className="p-3">{claim.description}</td>
                                    <td
                                        className={`p-3 font-semibold ${claim.status === "Pending"
                                            ? "text-yellow-600"
                                            : claim.status === "Approved"
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {claim.status}
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => handleStatusChange(claim._id, "Approved")}
                                            disabled={claim.status !== "Pending"}
                                            className="bg-green-500 text-white px-3 py-1 rounded mr-2 disabled:opacity-50"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(claim._id, "Rejected")}
                                            disabled={claim.status !== "Pending"}
                                            className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CustomerClaims;
