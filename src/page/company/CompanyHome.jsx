import React from "react";
import { useAuth } from "../../authContext/AuthContext";
import {
    Building2,
    Mail,
    Hash,
    ShieldCheck,
    Landmark,
    FileText,
    FileBadge,
    Users,
} from "lucide-react";

export default function CompanyHome() {
    const { user } = useAuth();

    // Mock company data (replace with props or API data later)
    const company = {
        companyName: "HealthCare Solutions Inc.",
        companyEmail: "info@healthcare.com",
        registrationNumber: "REG-987654321",
        legalEntity: "Incorporated",
        networkPayerId: "NP-12345",
        efRemittance: "Enabled",
        providerName: "Dr. John Smith",
        providerNumber: "PROV-001122",
        providerEmail: "john.smith@healthcare.com",
        claim: ["EDI", "Portal"],
        signedAgreement: "Signed on 2023-09-10",
        licenseProof: "Uploaded",
        voidCheque: "Uploaded",
        serviceStandards: "ISO Certified",
        agreementAccepted: true,
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome, {user?.name || "Company Admin"}
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage your company profile, agreements, and compliance information.
                </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Company Name */}
                <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                        <Building2 className="text-blue-500" size={28} />
                        <h2 className="text-lg font-semibold">Company</h2>
                    </div>
                    <p className="text-xl font-bold mt-4">{company.companyName}</p>
                    <p className="text-gray-600 mt-1">Reg: {company.registrationNumber}</p>
                </div>

                {/* Contact Email */}
                <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                        <Mail className="text-green-500" size={28} />
                        <h2 className="text-lg font-semibold">Email</h2>
                    </div>
                    <p className="text-xl font-bold mt-4">{company.companyEmail}</p>
                    <p className="text-gray-600 mt-1">{company.providerEmail}</p>
                </div>

                {/* Legal Entity */}
                <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                        <Hash className="text-purple-500" size={28} />
                        <h2 className="text-lg font-semibold">Legal Entity</h2>
                    </div>
                    <p className="text-xl font-bold mt-4">{company.legalEntity}</p>
                </div>

                {/* Provider Info */}
                <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                        <Users className="text-pink-500" size={28} />
                        <h2 className="text-lg font-semibold">Provider</h2>
                    </div>
                    <p className="text-xl font-bold mt-4">{company.providerName}</p>
                    <p className="text-gray-600">#{company.providerNumber}</p>
                </div>

                {/* Network Payer */}
                <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                        <Landmark className="text-yellow-500" size={28} />
                        <h2 className="text-lg font-semibold">Network Payer</h2>
                    </div>
                    <p className="text-xl font-bold mt-4">{company.networkPayerId}</p>
                    <p className="text-gray-600">{company.efRemittance}</p>
                </div>

                {/* Claims */}
                <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                        <FileText className="text-indigo-500" size={28} />
                        <h2 className="text-lg font-semibold">Claims</h2>
                    </div>
                    <p className="text-xl font-bold mt-4">{company.claim.join(", ")}</p>
                </div>

                {/* Agreement */}
                <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-teal-500" size={28} />
                        <h2 className="text-lg font-semibold">Agreement</h2>
                    </div>
                    <p className="text-xl font-bold mt-4">
                        {company.agreementAccepted ? "Accepted" : "Pending"}
                    </p>
                    <p className="text-gray-600 mt-1">{company.signedAgreement}</p>
                </div>

                {/* Compliance / Standards */}
                <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-3">
                        <FileBadge className="text-red-500" size={28} />
                        <h2 className="text-lg font-semibold">Standards</h2>
                    </div>
                    <p className="text-xl font-bold mt-4">{company.serviceStandards}</p>
                    <p className="text-gray-600 mt-1">License: {company.licenseProof}</p>
                </div>
            </div>
        </div>
    );
}
