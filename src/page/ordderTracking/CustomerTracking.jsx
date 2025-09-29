import React, { useState } from "react";
import API from '../../API/Api';

const CustomerTracking = () => {
    const [orderId, setOrderId] = useState("");
    const [tracking, setTracking] = useState(null);

    const getTracking = async () => {
        try {
            const { data } = await API.get(`/getOrderTracking/${orderId}/tracking`);
            setTracking(data);
        } catch (err) {
            alert("Error: " + err.response.data.message);
        }
    };

    return (
        <div>
            <h3 className="pb-2">Track Order</h3>
            <div className="flex gap-5">
                <input
                    className="border p-2 w-80 rounded"
                    placeholder="Enter Order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)} />
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:cursor-pointer"
                    onClick={getTracking}>
                    Track
                </button>
            </div>
            {tracking && (
                <div>
                    <h4>Status: {tracking.status}</h4>
                    <p>Tracking Number: {tracking.trackingNumber || "N/A"}</p>
                    <p>Estimated Delivery: {tracking.deliveryDate ? new Date(tracking.deliveryDate).toDateString() : "TBA"}</p>
                    <h5>History:</h5>
                    <ul>
                        {tracking.trackingHistory.map((t, i) => (
                            <li key={i}>
                                {t.status} - {t.message} ({new Date(t.updatedAt).toLocaleString()})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomerTracking;
