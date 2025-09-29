import { useEffect, useState } from "react";
import API from "../../API/Api";
import Swal from "sweetalert2";

const AdminOrderUpdate = () => {
    const [orderId, setOrderId] = useState("");
    const [status, setStatus] = useState("Placed");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [allData, setAllData] = useState([]);

    // Fetch all orders
    const fetchOrders = async () => {
        try {
            const { data } = await API.get("/allOrder");
            setAllData(data.orders || []);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load orders",
            });
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Update order status
    const updateOrder = async () => {
        if (!orderId) {
            Swal.fire("Missing Order ID", "Order ID is required.", "warning");
            return;
        }

        try {
            const { data } = await API.put(
                `/order/updateOrderStatus/${orderId}/status`,
                { status, trackingNumber, deliveryDate }
            );

            Swal.fire({
                icon: "success",
                title: "Success",
                text: data.message || "Order updated successfully!",
                timer: 2000,
                showConfirmButton: false,
            });

            // Refresh table data with latest DB values
            await fetchOrders();

            // Close modal
            setShowModal(false);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: err.response?.data?.message || "Failed to update order.",
            });
        }
    };

    return (
        <div>
            {/* Scrollable Table with Sticky Header */}
            <div className="relative overflow-y-auto max-h-[560px] w-full mt-6">
                <div className="grid grid-cols-6 text-center bg-black text-white font-semibold py-3 px-4 sticky top-0 z-10">
                    <div className="text-lg">ORDER ID</div>
                    <div className="text-lg">USER ID</div>
                    <div className="text-lg">ORDER STATUS</div>
                    <div className="text-lg">TRACKING NO.</div>
                    <div className="text-lg">DATE</div>
                    <div className="text-lg">ACTION</div>
                </div>

                {allData.map((data, idx) => (
                    <div
                        key={idx}
                        className={`grid grid-cols-6 text-center items-center px-4 py-3 
                          border-b border-gray-200 text-sm hover:bg-gray-100 
                          ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                        <div>{data._id}</div>
                        <div>{data.userId}</div>
                        <div>{data.orderStatus}</div>
                        <div>{data.trackingNumber}</div>

                        {/* Display updated date in YYYY-MM-DD */}
                        <div>
                            {data.deliveryDate
                                ? new Date(data.deliveryDate).toISOString().split("T")[0]
                                : new Date(data.updatedAt).toISOString().split("T")[0]}
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    setOrderId(data._id);
                                    setStatus(data.orderStatus);
                                    setTrackingNumber(data.trackingNumber || "");

                                    // Current local date & time in YYYY-MM-DDTHH:mm format
                                    const now = new Date();
                                    const pad = (n) => n.toString().padStart(2, "0");

                                    const year = now.getFullYear();
                                    const month = pad(now.getMonth() + 1);
                                    const day = pad(now.getDate());
                                    const hours = pad(now.getHours());
                                    const minutes = pad(now.getMinutes());

                                    const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

                                    setDeliveryDate(
                                        data.deliveryDate
                                            ? new Date(data.deliveryDate).toISOString().slice(0, 16)
                                            : localDateTime
                                    );

                                    setShowModal(true);
                                }}


                                className="bg-blue-500 px-3 py-1 h-10 rounded-xl text-white hover:cursor-pointer"
                            >
                                Change Status
                            </button>

                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 relative">
                        <h3 className="text-lg font-bold mb-2">
                            Update Order {orderId ? `#${orderId}` : "(Loading...)"}
                        </h3>

                        <div className="flex flex-wrap gap-4 mt-4">
                            <select
                                className="border p-2 w-full rounded"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option>Placed</option>
                                <option>Processing</option>
                                <option>Shipped</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                                <option>Returned</option>
                            </select>

                            <input
                                className="border p-2 w-full rounded"
                                placeholder="Tracking Number"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                disabled
                            />

                            <input
                                className="border p-2 w-full rounded"
                                type="datetime-local"
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                disabled
                            />


                            <div className="flex justify-between mt-4 gap-6 w-full">
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:cursor-pointer"
                                    onClick={updateOrder}
                                    disabled={!status || !trackingNumber || !deliveryDate}
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrderUpdate;
