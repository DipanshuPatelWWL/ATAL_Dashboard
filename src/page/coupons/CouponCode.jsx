import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import API from "../../API/Api";

const CouponCode = () => {
  const [couponData, setCouponData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    applicableFor: "",
    coupon: "",
    discountType: "percentage",
    discountValue: "",
    minPurchase: "",
    startDate: "",
    expiryDate: "",
    isActive: true,
  });
  const [editId, setEditId] = useState(null);

  // Fetch coupons
  const fetchCoupons = async () => {
    try {
      const res = await API.get("/getCouponCode");
      if (res.data.success) {
        setCouponData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Submit add / update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/updateCouponCode/${editId}`, formData);
        Swal.fire("Updated!", "Coupon updated successfully", "success");
      } else {
        await API.post("/addCouponCode", formData);
        Swal.fire("Added!", "Coupon added successfully", "success");
      }

      setShowModal(false);
      setFormData({
        applicableFor: "",
        coupon: "",
        discountType: "percentage",
        discountValue: "",
        minPurchase: "",
        startDate: "",
        expiryDate: "",
        isActive: true,
      });
      setEditId(null);
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete coupon
  const handleDelete = async (id) => {
    try {
      await API.delete(`/deleteCouponCode/${id}`);
      Swal.fire("Deleted!", "Coupon deleted", "success");
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit coupon
  const handleUpdateClick = (coupon) => {
    setFormData(coupon);
    setEditId(coupon._id);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Coupon Codes</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setEditId(null);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Add Coupon
        </button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 gap-x-4 bg-black text-white py-2 px-4 font-semibold">
          <div>S.NO</div>
          <div>Name</div>
          <div>Code</div>
          <div>Discount</div>
          <div>Min Purchase</div>
          <div>Validity</div>
          <div>Action</div>
        </div>
        {couponData.map((c, i) => (
          <div
            key={c._id}
            className="grid grid-cols-8 gap-x-4 items-center border-b py-2 px-4"
          >
            <div>{i + 1}</div>
            <div>{c.applicableFor}</div>
            <div>{c.coupon}</div>
            <div>
              {c.discountType === "percentage"
                ? `${c.discountValue}%`
                : `$${c.discountValue}`}
            </div>
            <div>${c.minPurchase}</div>
            <div>
              {new Date(c.startDate).toLocaleDateString()} -{" "}
              {new Date(c.expiryDate).toLocaleDateString()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateClick(c)}
                className="bg-blue-500 px-3 py-1 rounded-xl text-white"
              >
                <RiEdit2Fill />
              </button>
              <button
                onClick={() => handleDelete(c._id)}
                className="bg-red-500 px-3 py-1 rounded-xl text-white"
              >
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 my-20 relative">
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit Coupon" : "Add Coupon"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="applicableFor"
                value={formData.applicableFor}
                onChange={handleChange}
                placeholder="Coupon Name"
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                name="coupon"
                value={formData.coupon}
                onChange={handleChange}
                placeholder="Coupon Code"
                className="border p-2 w-full rounded"
              />
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                placeholder="Discount Value"
                className="border p-2 w-full rounded"
              />
              <input
                type="number"
                name="minPurchase"
                value={formData.minPurchase}
                onChange={handleChange}
                placeholder="Min Purchase Amount"
                className="border p-2 w-full rounded"
              />
              <label className="block text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate?.split("T")[0] || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
              <label className="block text-gray-700">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate?.split("T")[0] || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />{" "}
                Active
              </label>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponCode;

