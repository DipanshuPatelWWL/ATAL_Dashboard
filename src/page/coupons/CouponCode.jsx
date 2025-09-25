import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import API from "../../API/Api";
import Swal from "sweetalert2";

function CouponCode() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [couponData, setCouponData] = useState([{}]);
  const [formData, setFormData] = useState({
    coupon: "",
    applicableFor: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //handle update
  const handleUpdateClick = (couponCode) => {
    setModalType("update");
    setShowModal(true);
    setFormData({
      id: couponCode._id,
      coupon: couponCode.coupon,
      applicableFor: couponCode.applicableFor,
    });
  };

  //Delete API
  const handleDelete = async (id) => {
    try {
      await API.delete(`/deleteCouponCode/${id}`);
      fetchCouponCode();
      Swal.fire({
        toast: true,
        icon: "error",
        title: "Coupon Deleted successfully!",
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  //Get API

  const fetchCouponCode = async () => {
    try {
      const response = await API.get("/getCouponCode");
      setCouponData(response.data.couponCode);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCouponCode();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //create API
    try {
      if (modalType === "add") {
        await API.post("/addCouponCode", formData);
        Swal.fire({
        toast: true,
        icon: "success",
        title: "Coupon Created successfully!",
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      }
      //update Api
      else {
        await API.put(`/updateCouponCode/${formData.id}`, {
          coupon: formData.coupon,
          applicableFor: formData.applicableFor,
        });
        Swal.fire({
          toast: true,
          icon: "success",
          title: "Coupon Updated successfully!",
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
      setShowModal(false);
      setFormData({ coupon: "", applicableFor: "" });
      fetchCouponCode();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setShowModal(true), setModalType("add");
          }}
          className="bg-green-500 text-white px-3 py-1 text-xl font-semibold rounded-lg mb-4 hover:cursor-pointer flex items-center gap-2"
        >
          <FaPlus />
          ADD COUPON
        </button>
      </div>

      {/*Table bar*/}
      <div className="overflow-x-auto w-full">
        <div className="grid grid-cols-4 gap-x-10 bg-black text-white py-2 px-4 font-semibold">
          <div className=" text-lg">S.NO.</div>
          <div className=" text-lg">Coupon Name</div>
          <div className=" text-lg">Coupon Code</div>
          <div className=" text-lg">ACTION</div>
        </div>
      </div>

      {couponData.map((data, idx) => (
        <div
          key={idx}
          className="grid grid-cols-4 gap-x-10 items-start border-b border-gray-300 py-2 px-4"
        >
          <h1>{idx + 1}</h1>
          <h1>{data.applicableFor}</h1>
          <h1>{data.coupon}</h1>

          <div className="flex gap-2">
            <div>
              <button
                onClick={() => handleUpdateClick(data)}
                className="bg-blue-500 px-3 py-1 rounded-xl text-white hover:cursor-pointer"
              >
                <RiEdit2Fill className="text-2xl" />
              </button>
            </div>
            <div>
              <button
                className="bg-red-500 px-3 py-1 rounded-xl text-white hover:cursor-pointer"
                onClick={() => handleDelete(data._id)}
              >
                <MdDelete className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/*Modal*/}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <h2 className="text-xl font-bold mb-4">Add Coupon</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div></div>
              <div>
                <label className="block text-gray-700">Coupon Name</label>
                <input
                  type="text"
                  name="applicableFor"
                  onChange={handleChange}
                  value={formData.applicableFor}
                  placeholder="Coupon Name"
                  className="border p-2 w-full rounded"
                />
              </div>
              <label className="block text-gray-700">Coupon Code</label>
              <input
                type="text"
                name="coupon"
                value={formData.coupon}
                placeholder="Coupon Code"
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  type="button"
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
}

export default CouponCode;
      