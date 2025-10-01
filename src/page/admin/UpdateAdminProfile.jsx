import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API, { IMAGE_URL } from "../../API/Api";

const UpdateAdminProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState(null); // backend filename or URL
  const [profileFile, setProfileFile] = useState(null);   // selected file
  const [profilePreview, setProfilePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔹 Fetch admin profile on mount
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
          password: "",
        });

        //  Set profile image from backend
        if (data.profileImage) {
          setProfileImage(data.profileImage);

          // also update localStorage so image persists on refresh
          localStorage.setItem(
            "user",
            JSON.stringify({ ...adminData, profileImage: data.profileImage })
          );
        }
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

  // 🔹 Handle profile image selection
  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Validation
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

  // 🔹 Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire("Validation Error", "Please fix the errors", "warning");
      return;
    }

    setLoading(true);
    try {
      const adminData = JSON.parse(localStorage.getItem("user"));
      const adminId = adminData?._id;

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (formData.password) data.append("password", formData.password);
      if (profileFile) data.append("profileImage", profileFile);

      const res = await API.put(`/updateAdminProfile/${adminId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data?.admin) {
        const updatedAdmin = res.data.admin;

        //  Update state
        setProfileImage(updatedAdmin.profileImage || null);
        setProfilePreview(null);
        setProfileFile(null);

        // Update localStorage
        const updatedUser = {
          ...adminData,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
          profileImage: updatedAdmin.profileImage,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        //  Notify Navbar (listen for this in Navbar)
        window.dispatchEvent(new Event("profileUpdated"));
      }

      Swal.fire("Success", res.data.message || "Profile updated!", "success");
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

  // ✅ Handle profile image display
  const getProfileImageSrc = () => {
    if (profilePreview) return profilePreview;
    if (profileImage) {
      return profileImage.startsWith("http")
        ? profileImage
        : `${IMAGE_URL}${profileImage}`;
    }
    return null;
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
          {/* Name */}
          <div>
            <label className="block font-medium text-gray-700">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Profile Image
            </label>
            <input
              type="file"
              onChange={handleProfileImage}
              accept="image/*"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 outline-none"
            />

            {getProfileImageSrc() && (
              <div className="mt-3">
                <img
                  src={getProfileImageSrc()}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full border shadow"
                />
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium text-gray-700">Password</label>
            <input
              type="password"
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
        className={`w-full font-semibold p-3 rounded-lg ${loading
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
