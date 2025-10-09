import React, { useEffect, useRef, useState } from "react";
import API from "../../API/Api";
import Swal from "sweetalert2";

const Inquiry = () => {
    const [inquiry, setInquiry] = useState([]);
    const [filteredInquiries, setFilteredInquiries] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [showResponse, setShowResponse] = useState(false);
    const [formData, setFormData] = useState({ message: "" });

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("All Inquiries");
    const dropdownRef = useRef(null);

    const options = ["All Inquiries", "Vendor", "Company", "Open", "Close"];

    const getAllInquiry = async () => {
        try {
            const res = await API.get("/getAllInquiry");
            setInquiry(res.data.inquiry);
            setFilteredInquiries(res.data.inquiry); // default show all
        } catch (error) {
            console.error("Error fetching inquiries", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // filter logic
    const handleFilter = (option) => {
        setSelected(option);
        setOpen(false);

        if (option === "All Inquiries") {
            setFilteredInquiries(inquiry);
        } else if (option === "Vendor" || option === "Company") {
            setFilteredInquiries(
                inquiry.filter(
                    (i) => i.userType?.toLowerCase() === option.toLowerCase()
                )
            );
        } else if (option === "Open" || option === "Close") {
            setFilteredInquiries(
                inquiry.filter(
                    (i) => i.inquiryStatus?.toLowerCase() === option.toLowerCase()
                )
            );
        }
    };

    // Send Response Only
    const handleSend = async () => {
        setLoading(true); // show loader
        try {
            await API.post("/sendResponse", {
                inquiryId: selectedInquiry._id,
                message: formData.message,
            });

            Swal.fire({
                title: "Success!",
                text: "Response sent successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });
            setFormData({ message: "" });
            setShowResponse(false);
            getAllInquiry();
        } catch (error) {
            console.error("Error sending response", error);
        } finally {
            setLoading(false); // hide loader
        }
    };

    // Send Response + Register
    const handleSendNReg = async () => {
        setLoading(true); // show loader
        try {
            await API.post("/sendResponseAndRegister", {
                inquiryId: selectedInquiry._id,
                message: formData.message,
            });
            Swal.fire({
                title: "Success!",
                text: "Response sent & user registered successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });
            setFormData({ message: "" });
            setShowResponse(false);
            getAllInquiry();
        } catch (error) {
            console.error("Error in Send & Register", error);
        } finally {
            setLoading(false); // hide loader
        }
    };

    useEffect(() => {
        getAllInquiry();
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6 mt-10 mb-10 bg-white shadow-md rounded-lg">
            <h2 className="text-3xl font-bold text-left mb-6 text-red-600">
                Inquiry List
            </h2>
            <hr className="w-42 border-t-2 border-red-600" />

            {/* Dropdown + Total count */}
            <div className="flex items-center justify-between mt-4">
                <div className="relative w-60" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex w-full items-center justify-between rounded-lg border border-red-600 bg-white px-3 py-2 text-sm text-black hover:cursor-pointer"
                    >
                        <span className="truncate">{selected}</span>
                        <svg
                            className={`h-4 w-4 text-red-600 transition-transform ${open ? "rotate-180" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {open && (
                        <div className="absolute z-10 mt-1 w-full rounded-lg border border-red-600 bg-white shadow-lg">
                            <ul className="max-h-48 overflow-auto rounded-lg">
                                {options.map((option) => (
                                    <li
                                        key={option}
                                        onClick={() => handleFilter(option)}
                                        className="cursor-pointer px-3 py-2 text-sm text-black hover:bg-red-100 hover:text-red-600"
                                    >
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <h2 className="text-lg font-semibold text-red-600">
                    Total Inquiries: {filteredInquiries.length}
                </h2>
            </div>

            {/* Table */}
            <div className="overflow-y-auto mt-6">
                <table className="table-auto border-collapse border border-gray-500 w-full text-center">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">Inquiry Number</th>
                            <th className="border px-4 py-2">User Type</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Business/Reg No.</th>
                            <th className="border px-4 py-2">Inquiry Status</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInquiries.map((data, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{data.inquiryNumber}</td>
                                <td className="border px-4 py-2">{data.userType}</td>
                                <td className="border px-4 py-2">{data.name}</td>
                                <td className="border px-4 py-2">{data.email}</td>
                                <td className="border px-4 py-2">
                                    {data.userType === "company"
                                        ? data.registrationNumber
                                        : data.businessNumber}
                                </td>
                                <td className="border px-4 py-2">{data.inquiryStatus}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => {
                                            setSelectedInquiry(data);
                                            setShowResponse(true);
                                        }}
                                        disabled={data.inquiryStatus === "close"}
                                        className={`text-white p-2 rounded transition ${data.inquiryStatus === "close"
                                            ? "bg-red-400 cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-700 cursor-pointer"
                                            }`}
                                    >
                                        Send Response
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Response Modal */}
            {showResponse && selectedInquiry && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                            Response to {selectedInquiry.name}
                        </h2>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="Type your response..."
                        ></textarea>

                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                onClick={handleSend}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 hover:cursor-pointer"
                            >
                                Send
                            </button>
                            <button
                                type="button"
                                onClick={handleSendNReg}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 hover:cursor-pointer"
                            >
                                Send & Register
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowResponse(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 hover:cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>

                        {/* Loader Overlay */}
                        {loading && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inquiry;
