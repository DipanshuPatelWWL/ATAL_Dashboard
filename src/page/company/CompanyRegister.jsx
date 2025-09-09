import React, { useState } from "react";
import API from '../../API/Api'
export default function CompanyRegistrationForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    legalEntity: "",
    networkPayerId: "",
    eftRemittance: "",
    providerName: "",
    providerNumber: "",
    providerEmail: "",
    claim: [],
    serviceStandards: "",
    agreementAccepted: false,
  });

  const [files, setFiles] = useState({
    signedAgreement: null,
    licenseProof: null,
    voidCheque: null,
  });

  // handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "agreementAccepted") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // handle claim checkbox
  const handleClaimChange = (method) => {
    setFormData((prev) => {
      if (prev.claim.includes(method)) {
        return { ...prev, claim: prev.claim.filter((c) => c !== method) };
      } else {
        return { ...prev, claim: [...prev.claim, method] };
      }
    });
  };

  // handle file input
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles({ ...files, [name]: selectedFiles[0] });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      // append normal fields
      for (let key in formData) {
        if (key === "claim") {
          formData.claim.forEach((c) => data.append("claim", c));
        } else {
          data.append(key, formData[key]);
        }
      }
      // append files
      for (let key in files) {
        if (files[key]) {
          data.append(key, files[key]);
        }
      }

      const res = await API.post("/createcompany", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Company registered successfully!");
    } catch (error) {
      console.error(error);
      alert("Error registering company");
    }
  };

  return (
    <div className="bg-white shadow-2xl shadow-white m-10 rounded-xl">
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4">
          Insurance Company Registration
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Insurance company name
              </label>
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="ACME Insurance Ltd."
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Legal entity</label>
              <input
                name="legalEntity"
                value={formData.legalEntity}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="ACME Holdings Pvt. Ltd."
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Network / Payer ID or EDI details
              </label>
              <input
                name="networkPayerId"
                value={formData.networkPayerId}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="e.g. 123456789 or EDI: X12-837"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                EFT / Remittance details
              </label>
              <input
                name="eftRemittance"
                value={formData.eftRemittance}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Bank name, account number, routing"
              />
            </div>
          </section>

          {/* Provider Relations */}
          <section>
            <h2 className="font-medium mb-3">
              Provider relations & technical support contacts
            </h2>

            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <input
                  name="providerName"
                  value={formData.providerName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border px-2 py-1"
                />
                <input
                  type="tel"
                  name="providerNumber"
                  max={14}
                  value={formData.providerNumber}
                  onChange={handleChange}
                  placeholder="+1 555 555 5555"
                  className="w-full rounded-lg border px-2 py-1"
                />
                <input
                  name="providerEmail"
                  value={formData.providerEmail}
                  onChange={handleChange}
                  placeholder="support@acme.com"
                  className="w-full rounded-lg border px-2 py-1"
                />
              </div>
            </div>
          </section>

          {/* Claim Submission */}
          <section>
            <h2 className="font-medium mb-3">Claim submission method</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {["EDI", "Portal", "Email", "Fax"].map((method) => (
                <label
                  key={method}
                  className="inline-flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={formData.claim.includes(method)}
                    onChange={() => handleClaimChange(method)}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </section>

          {/* File Uploads */}
          <section className="grid grid-cols-1 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Required provider documents
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Signed agreement (PDF)
                  </label>
                  <input
                    type="file"
                    name="signedAgreement"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Proof of licensure (image/PDF)
                  </label>
                  <input
                    type="file"
                    name="licenseProof"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Void cheque (image/PDF)
                  </label>
                  <input
                    type="file"
                    name="voidCheque"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Service standards</label>
              <textarea
                name="serviceStandards"
                value={formData.serviceStandards}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="e.g. Claims acknowledged within 24 hours"
              />
            </div>
          </section>

          {/* Agreement */}
          <section className="flex gap-3 items-center">
            <input
              type="checkbox"
              name="agreementAccepted"
              checked={formData.agreementAccepted}
              onChange={handleChange}
            />
            <label className="font-medium">
              I accept the terms of the agreement
            </label>
          </section>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-md bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-500 "
            >
              Register insurance company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
