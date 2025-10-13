import React, { useEffect, useState } from "react";
import API from "../../API/Api";
import { useNavigate } from "react-router-dom";

function AdminCompanyDetails() {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  const getAllCompanies = async () => {
    try {
      const res = await API.get("/getAllCompany");
      setCompanies(res.data.companies);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllCompanies();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Company Details</h2>

      <div className="overflow-x-auto bg-white shadow rounded-2xl border">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border-b text-left font-semibold text-gray-700">#</th>
              <th className="px-4 py-3 border-b text-left font-semibold text-gray-700">Company Name</th>
              <th className="px-4 py-3 border-b text-left font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 border-b text-left font-semibold text-gray-700">Legal Entity</th>
              <th className="px-4 py-3 border-b text-left font-semibold text-gray-700">Provider Name</th>
              <th className="px-4 py-3 border-b text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {companies.length > 0 ? (
              companies.map((company, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border-b">{index + 1}</td>
                  <td className="px-4 py-3 border-b">{company.companyName}</td>
                  <td className="px-4 py-3 border-b">{company.companyEmail}</td>
                  <td className="px-4 py-3 border-b">{company.legalEntity}</td>
                  <td className="px-4 py-3 border-b">{company.providerName}</td>
                  <td className="px-4 py-3 border-b text-center">
                    <button
                      onClick={() =>
                        navigate(`${company._id}`, { state: { company } })
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition hover:cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4 border-b">
                  No company data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCompanyDetails;

