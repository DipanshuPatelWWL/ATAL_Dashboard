import React, { useEffect, useState } from "react";
import API from "../../API/Api";

function VendorPage() {
  const [vendor, setvendor] = useState([{}]);
  const getallvendor = async () => {
    try {
      const res = await API.get("/allvendor");
      setvendor(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getallvendor();
  }, []);
  return (
    <>
      <div className="p-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-6">Vendor Details</h2>
        </div>
        <div className="">
          {vendor.map((data, index) => (
            <div
              key={index}
              className="bg-white mb-6 shadow rounded-2xl p-4 border hover:shadow-md transition"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex ">
                  <p className="font-medium mr-2">Account Holder:</p>
                  <p>{data.accountHolder}</p>
                </div>

                <div className="flex ">
                  <p className="font-medium mr-2">Account Number:</p>
                  <p>{data.accountNumber}</p>
                </div>

                <div className="flex ">
                  <p className="font-medium mr-2">Address 1:</p>
                  <p>{data.address1}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Address 2:</p>
                  <p>{data.address2}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Bank Name:</p>
                  <p>{data.bankName}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Brands:</p>
                  <p>{data.brands}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Business Number:</p>
                  <p>{data.businessNumber}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">City:</p>
                  <p>{data.city}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Company Name:</p>
                  <p>{data.companyName}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Contact Email:</p>
                  <p>{data.contactEmail}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Contact Name:</p>
                  <p>{data.contactName}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Contact Phone:</p>
                  <p>{data.contactPhone}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Contact Title:</p>
                  <p>{data.contactTitle}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Country:</p>
                  <p>{data.country}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">IBAN:</p>
                  <p>{data.iban}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Institution Number:</p>
                  <p>{data.institutionNumber}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Lead Times:</p>
                  <p>{data.leadTimes}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">MOQ:</p>
                  <p>{data.moq}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Operating Name:</p>
                  <p>{data.operatingName}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Postal Code:</p>
                  <p>{data.postalCode}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Remittance Email:</p>
                  <p>{data.remittanceEmail}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Return Policy:</p>
                  <p>{data.returnPolicy}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Shipping Terms:</p>
                  <p>{data.shippingTerms}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">State:</p>
                  <p>{data.state}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">SWIFT:</p>
                  <p>{data.swift}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Transit Number:</p>
                  <p>{data.transitNumber}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Vendor Type:</p>
                  <p>{data.vendorType}</p>
                </div>

                <div className="flex">
                  <p className="font-medium mr-2">Website:</p>
                  <p>{data.website}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default VendorPage;
