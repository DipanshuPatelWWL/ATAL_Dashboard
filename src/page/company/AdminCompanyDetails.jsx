import React, { useEffect, useState } from "react";
import API, { IMAGE_URL } from "../../API/Api";

function AdminCompanyDetails() {
  const [company, setCompany] = useState([]);

  const getAllCompanies = async () => {
    try {
      const res = await API.get("/getAllCompany");
      setCompany(res.data.companies);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllCompanies();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-6">Company Details</h2>
      </div>

      {company.map((data, index) => (
        <div
          key={index}
          className="bg-white shadow rounded-2xl p-4 border hover:shadow-md transition mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex">
              <p className="font-medium mr-2">Company Name:</p>
              <p>{data.companyName}</p>
            </div>

            <div className="flex">
              <p className="font-medium mr-2">Company Email:</p>
              <p>{data.companyEmail}</p>
            </div>

            <div className="flex">
              <p className="font-medium mr-2">Agreement Accepted:</p>
              <p>{data.agreementAccepted ? "Yes" : "No"}</p>
            </div>

            <div className="flex">
              <p className="font-medium mr-2">Claims:</p>
              <p>{data.claim?.join(", ")}</p>
            </div>

            <div className="flex">
              <p className="font-medium mr-2">EF Remittance:</p>
              <p>{data.efRemittance}</p>
            </div>

            <div className="flex">
              <p className="font-medium mr-2">Legal Entity:</p>
              <p>{data.legalEntity}</p>
            </div>

            <div className="flex">
              <p className="font-medium mr-2">License Proof:</p>
              {data.licenseProof ? (() => {
                const fileName = data.licenseProof.includes("http")
                  ? data.licenseProof
                  : data.licenseProof.split(/[/\\]/).pop();

                const fileUrl = fileName.startsWith("http://") || fileName.startsWith("https://")
                  ? fileName
                  : `${IMAGE_URL}${fileName}`;

                return (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" inline-block px-2 py-1 w-27 font-bold text-[12px] text-red-600 border  rounded hover:border-black transition-colors duration-200">
                    View Document
                  </a>
                );
              })() : (
                <p className="text-gray-500">Not Uploaded</p>
              )}
            </div>


            <div className="flex">
              <p className="font-medium mr-2">Network Payer ID:</p>
              <p>{data.networkPayerId}</p>
            </div>

            <div className="flex">
              <p className="font-medium mr-2">Provider Name:</p>
              <p>{data.providerName}</p>
            </div>

            <div className="flex">
              <p className="font-medium mr-2">Provider Email:</p>
              <p>{data.providerEmail}</p>
            </div>

            <div className="flex">
              <p className="font-medium mr-2">Provider Number:</p>
              <p>{data.providerNumber}</p>
            </div>

            <div className="flex">
              <p className="font-medium mr-2">Registration Number:</p>
              <p>{data.registrationNumber}</p>
            </div>

            <div className="flex">
              <p className="font-medium mr-2">Service Standards:</p>
              <p>{data.serviceStandards}</p>
            </div>

            <div className="flex">
              <p className="font-medium mr-2">Signed Agreement:</p>
              {data.signedAgreement ? (() => {
                // Helper: get just the file name
                const fileName = data.signedAgreement.includes("http")
                  ? data.signedAgreement
                  : data.signedAgreement.split(/[/\\]/).pop();

                const fileUrl = fileName.startsWith("http://") || fileName.startsWith("https://")
                  ? fileName
                  : `${IMAGE_URL}${fileName}`;

                return (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" inline-block px-2 py-1 w-27 font-bold text-[12px] text-red-600 border  rounded hover:border-black transition-colors duration-200">
                    View Document
                  </a>
                );
              })() : (
                <p className="text-gray-500">Not Uploaded</p>
              )}
            </div>

            <div className="flex">
              <p className="font-medium mr-2">Void Cheque:</p>
              {data.voidCheque ? (() => {
                const fileName = data.voidCheque.includes("http")
                  ? data.voidCheque
                  : data.voidCheque.split(/[/\\]/).pop();

                const fileUrl = fileName.startsWith("http://") || fileName.startsWith("https://")
                  ? fileName
                  : `${IMAGE_URL}${fileName}`;

                return (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" inline-block px-2 py-1 w-27 font-bold text-[12px] text-red-600 rounded border hover:border-black transition-colors duration-200">
                    View Document
                  </a>
                );
              })() : (
                <p className="text-gray-500">Not Uploaded</p>
              )}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminCompanyDetails;
