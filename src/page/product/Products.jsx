import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API, { IMAGE_URL } from "../../API/Api";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

const Products = () => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [images, setImages] = useState([]);
  // const [imagePreviews, setImagePreviews] = useState([]);
  const [keptImages, setKeptImages] = useState([]);
  const [lensImage1, setLensImage1] = useState(null);
  const [lensImage2, setLensImage2] = useState(null);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    cat_sec: "",
    subCategoryName: "",
    product_name: "",
    product_sku: "",
    product_price: "",
    product_sale_price: "",
    product_description: "",
    product_frame_material: "",
    product_frame_shape: "",
    product_frame_color: "",
    product_frame_fit: "",
    gender: "",
    product_lens_title1: "",
    product_lens_description1: "",
    product_lens_title2: "",
    product_lens_description2: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/getAllProduct");
      setProducts(res.data.products || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch products", "error");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await API.get("/getcategories");
      setCategory(res.data.categories || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch categories", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image change handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  // Remove new image before upload
  const removeNewImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      cat_sec: "",
      subCategoryName: "",
      product_name: "",
      product_sku: "",
      product_price: "",
      product_sale_price: "",
      product_description: "",
      product_frame_material: "",
      product_frame_shape: "",
      product_frame_color: "",
      product_frame_fit: "",
      gender: "",
      product_lens_title1: "",
      product_lens_description1: "",
      product_lens_title2: "",
      product_lens_description2: "",
    });
    setImages([]);
    setKeptImages([]);
    setLensImage1(null);
    setLensImage2(null);
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
    setImages([]);
    setKeptImages(
      product.product_image_collection?.map((img) =>
        img.startsWith("http") ? img : IMAGE_URL + img
      ) || []
    );
    setLensImage1(
      product.product_lens_image1
        ? product.product_lens_image1.startsWith("http")
          ? product.product_lens_image1
          : IMAGE_URL + product.product_lens_image1
        : null
    );
    setLensImage2(
      product.product_lens_image2
        ? product.product_lens_image2.startsWith("http")
          ? product.product_lens_image2
          : IMAGE_URL + product.product_lens_image2
        : null
    );
    setEditId(product._id);
    setOpen(true);
  };


  // Remove existing image
  const removeExistingImage = (idx) => {
    setKeptImages((prev) => prev.filter((_, i) => i !== idx));
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
          await API.delete(`/deleteProduct/${id}`);
          Swal.fire("Deleted!", "Product deleted successfully!", "success");
          fetchProducts();
        } catch (err) {
          Swal.fire("Error", "Failed to delete product", "error");
        }
      }
    });
  };

  //  Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });

      // send kept existing images
      payload.append("existingImages", JSON.stringify(keptImages.map(img => img.replace(IMAGE_URL, ""))));


      images.forEach((file) => {
        payload.append("product_image_collection", file);
      });

      if (lensImage1 && typeof lensImage1 !== "string") {
        payload.append("product_lens_image1", lensImage1);
      }
      if (lensImage2 && typeof lensImage2 !== "string") {
        payload.append("product_lens_image2", lensImage2);
      }

      if (editId) {
        await API.put(`/updateProduct/${editId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success", "Product updated successfully!", "success");
      } else {
        await API.post("/addProduct", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success", "Product added successfully!", "success");
      }

      fetchProducts();
      setOpen(false);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Operation failed",
        "error"
      );
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <button
          onClick={openAddModal}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          <FaPlus className="inline mr-2" /> Add Product
        </button>
      </div>

      {/* Product Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 border-black">Name</th>
            <th className="border px-4 py-2 border-black">SKU</th>
            <th className="border px-4 py-2 border-black">Price</th>
            <th className="border px-4 py-2 border-black">Sale Price</th>
            <th className="border px-4 py-2 border-black">Category</th>
            <th className="border px-4 py-2 border-black">Subcategory</th>
            <th className="border px-4 py-2 border-black">Image(s)</th>
            <th className="border px-4 py-2 border-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((pro) => (
            <tr key={pro._id} className="">
              <td className="border px-4 py-2 border-black text-center capitalize">{pro.product_name}</td>
              <td className="border px-4 py-2 border-black text-center">{pro.product_sku}</td>
              <td className="border px-4 py-2 border-black text-center">{pro.product_price}</td>
              <td className="border px-4 py-2 border-black text-center">{pro.product_sale_price}</td>
              <td className="border px-4 py-2 border-black text-center">{pro.cat_sec}</td>
              <td className="border px-4 py-2 border-black text-center">{pro.subCategoryName}</td>
              <td className="border px-4 py-2 border-black">
                {pro.product_image_collection?.length ? (
                  <div className="grid grid-cols-3 scroll-my-0 ">
                    {pro.product_image_collection.map((img, i) => (
                      <img
                        key={i}
                        src={img.startsWith("http") ? img : IMAGE_URL + img}
                        alt="product"
                        className="w-20 h-12 object-cover rounded "
                      />
                    ))}
                  </div>
                ) : (
                  "No Images"
                )}
              </td>
              <td className="border space-x-1 border-black mx-1">
                <button
                  onClick={() => openEditModal(pro)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 hover:cursor-pointer text-center"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(pro._id)}
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
                    {category
                      .find((c) => c.categoryName === formData.cat_sec)
                      ?.subCategoryNames.map((sub, idx) => (
                        <option key={idx} value={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <input
                type="text"
                name="product_name"
                value={formData.product_name.toUpperCase()}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="product_sku"
                value={formData.product_sku}
                onChange={handleChange}
                placeholder="Product SKU"
                className="w-full border p-2 rounded"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="product_price"
                  value={formData.product_price || ""}
                  onChange={handleChange}
                  placeholder="Price"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  name="product_sale_price"
                  value={formData.product_sale_price || ""}
                  onChange={handleChange}
                  placeholder="Sale Price"
                  className="w-full border p-2 rounded"
                />
              </div>

              <textarea
                name="product_description"
                value={formData.product_description}
                onChange={handleChange}
                placeholder="Product Description"
                className="w-full border p-2 rounded"
              />

              {/* Multiple Images */}
              <label htmlFor="product_image" className="block text-gray-700">
                Product Image
              </label>
              <input
                id="product_image"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border p-2 rounded"
              />
              {/* Show kept old images */}
              <div className="flex gap-2 flex-wrap mt-2">
                {keptImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt="kept"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              {/* Show new uploaded previews */}
              <div className="flex gap-2 flex-wrap mt-2">
                {images.map((file, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="new"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              {/* Frame Details */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="product_frame_material"
                  value={formData.product_frame_material}
                  onChange={handleChange}
                  placeholder="Frame Material"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="product_frame_shape"
                  value={formData.product_frame_shape}
                  onChange={handleChange}
                  placeholder="Frame Shape"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="product_frame_color"
                  value={formData.product_frame_color}
                  onChange={handleChange}
                  placeholder="Frame Color"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="product_frame_fit"
                  value={formData.product_frame_fit}
                  onChange={handleChange}
                  placeholder="Frame Fit"
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Gender */}
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>

              {/* Lens Fields */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="product_lens_title1"
                  value={formData.product_lens_title1}
                  onChange={handleChange}
                  placeholder="Lens Title 1"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="product_lens_description1"
                  value={formData.product_lens_description1}
                  onChange={handleChange}
                  placeholder="Lens Description 1"
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Lens Image 1 */}
              <div>
                <label className="block text-gray-700">Lens Image 1</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLensImage1(e.target.files[0])}
                  className="w-full border p-2 rounded"
                />
                {lensImage1 && (
                  <img
                    src={
                      typeof lensImage1 === "string"
                        ? lensImage1
                        : URL.createObjectURL(lensImage1)
                    }
                    alt="lens1"
                    className="w-20 h-20 mt-2 object-cover rounded"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="product_lens_title2"
                  value={formData.product_lens_title2}
                  onChange={handleChange}
                  placeholder="Lens Title 2"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="product_lens_description2"
                  value={formData.product_lens_description2}
                  onChange={handleChange}
                  placeholder="Lens Description 2"
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Lens Image 2 */}
              <div>
                <label className="block text-gray-700">Lens Image 2</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLensImage2(e.target.files[0])}
                  className="w-full border p-2 rounded"
                />
                {lensImage2 && (
                  <img
                    src={
                      typeof lensImage2 === "string"
                        ? lensImage2
                        : URL.createObjectURL(lensImage2)
                    }
                    alt="lens2"
                    className="w-20 h-20 mt-2 object-cover rounded"
                  />
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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

export default Products;