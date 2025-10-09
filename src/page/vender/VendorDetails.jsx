import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../../API/Api";

const VendorDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [vendor, setVendor] = React.useState(location.state?.vendor || null);

    // Fetch vendor if not passed via state
    React.useEffect(() => {
        const fetchVendor = async () => {
            if (!vendor) {
                try {
                    const res = await API.get(`/vendor/${id}`);
                    setVendor(res.data);
                } catch (error) {
                    console.error("Error fetching vendor:", error);
                }
            }
        };
        fetchVendor();
    }, [id, vendor]);

    if (!vendor) {
        return <div className="p-6 text-center">Loading vendor details...</div>;
    }

    // Categorize fields
    const basicFields = [
        "contactName",
        "contactEmail",
        "contactPhone",
        "vendorType",
        "country",
        "state",
        "city",
    ];

    const companyFields = [
        "companyName",
        "operatingName",
        "businessNumber",
        "address1",
        "address2",
        "postalCode",
        "website",
        "brands",
    ];

    // Exclude known fields from “other”
    const knownFields = [...basicFields, ...companyFields];
    const otherFields = Object.keys(vendor).filter(
        (key) => !knownFields.includes(key)
    );

    return (
        <div className="p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mb-4"
            >
                ← Back
            </button>

            {/* Page Title */}
            <h2 className="text-2xl font-bold text-black mb-6 text-center">
                {vendor.companyName} — Full Details
            </h2>

            {/* Basic Details */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Basic Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {basicFields.map((field) => (
                        <div
                            key={field}
                            className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-sm"
                        >
                            <p className="font-medium text-gray-700 capitalize whitespace-nowrap">
                                {field.replace(/([A-Z])/g, " $1")}:
                            </p>
                            <p className="text-gray-900 text-right ml-2 break-all">
                                {vendor[field] || "—"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Company Details */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Company Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {companyFields.map((field) => (
                        <div
                            key={field}
                            className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-sm"
                        >
                            <p className="font-medium text-gray-700 capitalize whitespace-nowrap">
                                {field.replace(/([A-Z])/g, " $1")}:
                            </p>
                            <p className="text-gray-900 text-right ml-2 break-all">
                                {vendor[field] || "—"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Other Details */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Other Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {otherFields.map((field) => (
                        <div
                            key={field}
                            className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-sm"
                        >
                            <p className="font-medium text-gray-700 capitalize whitespace-nowrap">
                                {field.replace(/([A-Z])/g, " $1")}:
                            </p>
                            <p className="text-gray-900 text-right ml-2 break-all">
                                {vendor[field] || "—"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VendorDetails;
