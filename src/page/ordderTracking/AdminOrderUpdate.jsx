import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../API/Api";


const AdminOrderUpdate = () => {
    const { orderId } = useParams(); // get orderId from URL

    const [status, setStatus] = useState("Processing");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [message, setMessage] = useState("");

    const updateOrder = async () => {
        try {
            const { data } = await API.put(`/updateOrderStatus/${orderId}/status`, {
                status,
                trackingNumber,
                deliveryDate,
                message,
            });
            alert(data.message);
        } catch (err) {
            console.log("Error: " + err.response?.data?.message);
        }
    };


    return (
        <div>
            <h3>Update Order #{orderId}</h3>
            <div className="flex justify-between mt-4">
                <select className="border p-2 w-60 rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option>Placed</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                    <option>Returned</option>
                </select>
                <input
                    className="border p-2 w-60 rounded"
                    placeholder="Tracking Number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                />
                <input
                    className="border p-2 w-60 rounded"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                />
                <input
                    className="border p-2 w-60 rounded"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:cursor-pointer"
                    onClick={updateOrder}
                    disabled={!status && !trackingNumber && !deliveryDate && !message}
                >
                    Update
                </button>

            </div>
        </div>
    );
};

export default AdminOrderUpdate;