import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API, { IMAGE_URL } from "../../API/Api";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

const Subcategory = () => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [subcategory, setsubCategory] = useState([]);
  const [Image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    cat_sec: "",
    subCategoryName: "",
    description: ""
  });
  const [editId, setEditId] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await API.get("/getcategories");
      setCategory(res.data.categories || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch categories", "error");
    }
  };

  const fetchsubCategories = async () => {
    try {
      const res = await API.get("/getallsubcategory");
      setsubCategory(res.data.subcategory || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch categories", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchsubCategories();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      cat_sec: "",
      subCategoryName: "",
      description: "",
    });
    setImage(""),
      setEditId(null);
    setOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setFormData({
      ...product,
      cat_sec: product.cat_sec || "",
      subCategoryName: product.subCategoryName || "",
    });
    setEditId(product._id);
    setOpen(true);
  };

  //  Delete Product
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/deletesubcategory/${id}`);
          Swal.fire("Deleted!", "Product deleted successfully!", "success");
          fetchsubCategories()
        } catch (err) {
          Swal.fire("Error", "Failed to delete product", "error");
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("cat_sec", formData.cat_sec);
      payload.append("subCategoryName", formData.subCategoryName);
      payload.append("description", formData.description);

      if (Image) {
        payload.append("image", Image);
      }

      if (editId) {
        // Update existing subcategory
        await API.put(`/updatesubcategory/${editId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success", "Subcategory updated successfully!", "success");
      } else {
        // Add new subcategory
        await API.post("/addsubcategory", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success", "Subcategory added successfully!", "success");
      }

      fetchsubCategories(); // refresh list
      setOpen(false); // close modal
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to save subcategory",
        "error"
      );
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sub Category</h2>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:cursor-pointer"
        >
          <FaPlus className="inline mr-2" /> Add Sub-Category
        </button>
      </div>

      {/* Product Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 border-black">Category Name</th>
            <th className="border px-4 py-2 border-black">SubCategory Name</th>
            <th className="border px-4 py-2 border-black">Description</th>
            <th className="border px-4 py-2 border-black">Image</th>
            <th className="border px-4 py-2 border-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategory.map((data, index) => (
            <tr key={index}>
              <td className="border px-4 py-2 border-black text-center capitalize">{data.cat_sec}</td>
              <td className="border px-4 py-2 border-black text-center">{data.subCategoryName}</td>
              <td className="border px-4 py-2 border-black text-center">{data.description}</td>
              <td className="border px-4 py-2 border-black text-center">  {data.image && (
                <img
                  src={`${IMAGE_URL + data.image}`}
                  alt="review"
                  className="w-12 h-12 object-cover rounded"
                />
              )}</td>
              <td className="border space-x-1 border-black mx-1">
                <button
                  onClick={() => openEditModal(data)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 hover:cursor-pointer text-center"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(data._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 hover:cursor-pointer"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}

        </tbody>
      </table>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Product" : "Add Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Category Dropdown */}
              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  name="cat_sec"
                  value={formData.cat_sec}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cat_sec: e.target.value,
                      subCategoryName: "",
                    })
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="">Select Category</option>
                  {category.map((cat) => (
                    <option key={cat._id} value={cat.categoryName}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/*  Subcategory Dropdown */}
              {formData.cat_sec && (
                <div>
                  <label className="block text-gray-700">Subcategory</label>
                  <select
                    name="subCategoryName"
                    value={formData.subCategoryName}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select Subcategory</option>
                    {category.find((c) => c.categoryName === formData.cat_sec)
                      ?.subCategoryNames.map((sub, idx) => (
                        <option key={idx} value={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="SubCategory Description"
                className="w-full border p-2 rounded"
              />

              <div>
                <label className="block text-gray-700">SubCategory Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 hover:cursor-pointer"
              >
                {editId ? "Update Product" : "Save Product"}
              </button>
            </form>

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-4xl hover:text-red-500 hover:cursor-pointer"
            >
              <IoIosCloseCircle />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subcategory;
