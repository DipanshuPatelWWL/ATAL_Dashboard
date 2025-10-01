import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API from "../../API/Api";

const UpdateAdminProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: null,
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch admin profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const adminData = JSON.parse(localStorage.getItem("user"));
        const adminId = adminData?._id;

        if (!adminId) {
          Swal.fire("Error", "Admin ID not found in localStorage", "error");
          return;
        }

        const res = await API.get(`/getAdminById/${adminId}`, {
          withCredentials: true,
        });

        const data = res.data.admin || {};
        setFormData({
          name: data.name || "",
          email: data.email || "",
          password: "", // keep empty, only update if changed
          photo: data.photo || null, // existing photo URL from server
        });
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to load admin profile",
          "error"
        );
      }
    };

    fetchProfile();
  }, []);

  //  Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire(
        "Validation Error",
        "Please fix the errors in the form",
        "warning"
      );
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (formData.password) data.append("password", formData.password);
      if (formData.photo && formData.photo instanceof File) {
        data.append("photo", formData.photo);
      }

      const res = await API.put(`/profile`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", res.data.message, "success");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-8"
    >
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>

      {/* Admin Info */}
      <section>
        <h3 className="text-lg font-semibold border-b pb-1 mb-3">Admin Info</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={`input ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              className={`input ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="photo" className="block font-medium text-gray-700">
              Profile Photo
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, photo: e.target.files[0] })
              }
              className="input"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
      </section>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full font-semibold p-3 rounded-lg ${
          loading
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700 text-white"
        }`}
      >
        {loading ? "Submitting..." : "Update Profile"}
      </button>
    </form>
  );
};

export default UpdateAdminProfile;
