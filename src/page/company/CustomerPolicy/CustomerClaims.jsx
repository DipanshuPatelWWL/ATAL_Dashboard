import React, { useEffect, useState } from "react";
import API, { IMAGE_URL } from "../../../API/Api";
import Swal from "sweetalert2";

const CustomerClaims = () => {
    const [claims, setClaims] = useState([]);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState(null);

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

    // Approve / Reject Claim
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
            fetchClaims();
        } catch (err) {
            Swal.fire("Error", "Failed to update claim", "error");
        }
    };

    const openModal = (claim) => {
        setSelectedClaim(claim);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedClaim(null);
        setIsModalOpen(false);
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                Customer Claim Requests
            </h2>

            {claims.length === 0 ? (
                <p className="text-gray-600 text-center">No claim requests found.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow border border-gray-300">
                    <table className="min-w-[1000px] w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Order ID</th>
                                <th className="p-3">Incident Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claims.map((claim) => (
                                <tr key={claim._id} className="border-t hover:bg-gray-50 transition">
                                    <td className="p-3">{claim.orderId?.shippingAddress?.fullName || "N/A"}</td>
                                    <td className="p-3">{claim.orderId?._id || "N/A"}</td>
                                    <td className="p-3">
                                        {claim.incidentDate
                                            ? new Date(claim.incidentDate).toLocaleDateString()
                                            : "-"}
                                    </td>
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
                                        <div className="flex flex-nowrap gap-2 justify-center items-center">
                                            <button
                                                onClick={() => handleStatusChange(claim._id, "Approved")}
                                                disabled={claim.status !== "Pending"}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 transition"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(claim._id, "Rejected")}
                                                disabled={claim.status !== "Pending"}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50 transition"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => openModal(claim)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Claim Details Modal */}
            {isModalOpen && selectedClaim && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-5 text-gray-500 hover:text-black text-3xl"
                        >
                            &times;
                        </button>

                        <h3 className="text-2xl font-semibold mb-4 border-b pb-2 text-center">
                            Claim Details
                        </h3>

                        <div className="space-y-3 text-gray-800">
                            <p>
                                <strong>Customer:</strong>{" "}
                                {selectedClaim.orderId?.billingAddress?.fullName || "N/A"}
                            </p>
                            <p>
                                <strong>Email:</strong> {selectedClaim.orderId?.email || "No Email"}
                            </p>
                            <p>
                                <strong>Order ID:</strong> {selectedClaim.orderId?._id || "N/A"}
                            </p>
                            <p>
                                <strong>Incident Date:</strong>{" "}
                                {new Date(selectedClaim.incidentDate).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Description:</strong> {selectedClaim.description}
                            </p>
                            <p>
                                <strong>Deductible Amount:</strong> ₹{selectedClaim.deductibleAmount}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`font-semibold ${selectedClaim.status === "Pending"
                                        ? "text-yellow-600"
                                        : selectedClaim.status === "Approved"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    {selectedClaim.status}
                                </span>
                            </p>

                            {/* Scrollable Image Gallery */}
                            <div>
                                <strong>Uploaded Photos:</strong>
                                <div className="flex gap-4 overflow-x-auto mt-3 pb-2">
                                    {selectedClaim.photos?.length > 0 ? (
                                        selectedClaim.photos.map((photo, idx) => (
                                            <img
                                                key={idx}
                                                src={`${IMAGE_URL}${photo}`}
                                                alt={`Claim Photo ${idx + 1}`}
                                                className="w-48 h-36 object-cover rounded-lg shadow cursor-pointer hover:scale-105 transition-transform"
                                                onClick={() => setFullscreenImage(`${IMAGE_URL}${photo}`)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No photos uploaded.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={closeModal}
                                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Image Viewer */}
            {fullscreenImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center cursor-zoom-out"
                    onClick={() => setFullscreenImage(null)}
                >
                    <img
                        src={fullscreenImage}
                        alt="Full View"
                        className="max-w-[95%] max-h-[90%] object-contain rounded-lg shadow-2xl transition-all"
                    />
                    <button
                        className="absolute top-6 right-8 text-white text-5xl hover:text-red-500"
                        onClick={() => setFullscreenImage(null)}
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomerClaims;
