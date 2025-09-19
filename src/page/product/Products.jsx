import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API, { IMAGE_URL } from "../../API/Api";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

const Products = () => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [images, setImages] = useState([]);
  const [keptImages, setKeptImages] = useState([]);
  const [lensImage1, setLensImage1] = useState(null);
  const [lensImage2, setLensImage2] = useState(null);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    cat_id: "",
    cat_sec: "",
    subCat_id: "",
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
    cat_id: "",
    subCat_id: ""
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

  const removeNewImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const openAddModal = () => {
    setFormData({
      cat_id: "",
      cat_sec: "",
      subCat_id: "",
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
      cat_id: "",
      subCat_id: ""
    });
    setImages([]);
    setKeptImages([]);
    setLensImage1(null);
    setLensImage2(null);
    setEditId(null);
    setOpen(true);
  };

  const openEditModal = (product) => {
    setFormData({
      ...formData,
      cat_id: product.common?.cat_id || "",
      cat_sec: product.common?.cat_sec || "",
      subCat_id: product.common?.subCat_id || "",
      subCategoryName: product.common?.subCategoryName || "",
      product_name: product.common?.product_name || "",
      product_sku: product.common?.product_sku || "",
      product_price: product.common?.product_price || "",
      product_sale_price: product.common?.product_sale_price || "",
      product_description: product.common?.product_description || "",
      gender: product.common?.gender || "",
      product_frame_material: product.sunglasses?.frame_material || "",
      product_frame_shape: product.sunglasses?.frame_shape || "",
      product_frame_color: product.sunglasses?.frame_color || "",
      product_frame_fit: product.sunglasses?.frame_fit || "",
      product_lens_title1: product.lensDetails?.product_lens_title1 || "",
      product_lens_description1: product.lensDetails?.product_lens_description1 || "",
      product_lens_title2: product.lensDetails?.product_lens_title2 || "",
      product_lens_description2: product.lensDetails?.product_lens_description2 || "",
      contact_type: product.contactLens?.type || "",
      material: product.contactLens?.material || "",
      manufacturer: product.contactLens?.manufacturer || "",
      water_content: product.contactLens?.water_content || "",
    });
    setImages([]);
    setKeptImages(
      product.common?.product_image_collection?.map((img) =>
        img.startsWith("http") ? img : IMAGE_URL + img
      ) || []
    );
    setLensImage1(
      product.lensDetails?.product_lens_image1
        ? product.lensDetails.product_lens_image1.startsWith("http")
          ? product.lensDetails.product_lens_image1
          : IMAGE_URL + product.lensDetails.product_lens_image1
        : null
    );
    setLensImage2(
      product.lensDetails?.product_lens_image2
        ? product.lensDetails.product_lens_image2.startsWith("http")
          ? product.lensDetails.product_lens_image2
          : IMAGE_URL + product.lensDetails.product_lens_image2
        : null
    );
    setEditId(product._id);
    setOpen(true);
  };

  const removeExistingImage = (idx) => {
    setKeptImages((prev) => prev.filter((_, i) => i !== idx));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();

      // 🔹 Basic product fields
      payload.append("cat_id", formData.cat_id);
      payload.append("cat_sec", formData.cat_sec);
      payload.append("subCat_id", formData.subCat_id);
      payload.append("subCategoryName", formData.subCategoryName);
      payload.append("product_name", formData.product_name);
      payload.append("product_sku", formData.product_sku);
      payload.append("product_price", formData.product_price);
      payload.append("product_sale_price", formData.product_sale_price);
      payload.append("product_description", formData.product_description);
      payload.append("gender", formData.gender);

      // 🔹 Sunglasses fields
      if (formData.cat_sec === "Sunglasses") {
        payload.append("frame_material", formData.product_frame_material);
        payload.append("frame_shape", formData.product_frame_shape);
        payload.append("frame_color", formData.product_frame_color);
        payload.append("frame_fit", formData.product_frame_fit);
      }

      // 🔹 Contact Lens fields
      if (formData.cat_sec === "Contact Lens") {
        payload.append("type", formData.contact_type);
        payload.append("material", formData.material);
        payload.append("manufacturer", formData.manufacturer);
        payload.append("water_content", formData.water_content);
      }

      // 🔹 Lens details
      payload.append("product_lens_title1", formData.product_lens_title1);
      payload.append("product_lens_description1", formData.product_lens_description1);
      payload.append("product_lens_title2", formData.product_lens_title2);
      payload.append("product_lens_description2", formData.product_lens_description2);

      // 🔹 Existing images (keep old ones)
      payload.append(
        "existingImages",
        JSON.stringify(keptImages.map((img) => img.replace(IMAGE_URL, "")))
      );

      // 🔹 New uploaded images
      images.forEach((file) => payload.append("product_image_collection", file));

      if (lensImage1 && typeof lensImage1 !== "string") {
        payload.append("product_lens_image1", lensImage1);
      }
      if (lensImage2 && typeof lensImage2 !== "string") {
        payload.append("product_lens_image2", lensImage2);
      }

      // 🔹 Send to backend
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
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
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
              <td className="border px-4 py-2 border-black text-center capitalize">
                {pro.product_name}
              </td>
              <td className="border px-4 py-2 border-black text-center">
                {pro.product_sku}
              </td>
              <td className="border px-4 py-2 border-black text-center">
                {pro.product_price}
              </td>
              <td className="border px-4 py-2 border-black text-center">
                {pro.product_sale_price}
              </td>
              <td className="border px-4 py-2 border-black text-center">
                {pro.cat_sec}
              </td>
              <td className="border px-4 py-2 border-black text-center">
                {pro.subCategoryName}
              </td>
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
              {/* Category dropdown */}
              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  value={formData.cat_id}
                  onChange={(e) => {
                    const selectedCat = category.find((c) => c._id === e.target.value);
                    setFormData({
                      ...formData,
                      cat_id: selectedCat?._id || "",
                      cat_sec: selectedCat?.categoryName || "",
                      subCat_id: "",
                      subCategoryName: "",
                    });
                  }}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select Category</option>
                  {category.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory dropdown */}
              {formData.cat_id && (
                <div>
                  <label className="block text-gray-700">Subcategory</label>
                  <select
                    value={formData.subCat_id}
                    onChange={(e) => {
                      const selectedCat = category.find((c) => c._id === formData.cat_id);

                      // Case 1: if subCategories is array of objects
                      const selectedSub =
                        selectedCat?.subCategories?.find((s) => s._id === e.target.value) || null;

                      // Case 2: if subCategoryNames is array of strings
                      const selectedName =
                        selectedCat?.subCategoryNames?.find((s) => s === e.target.value) || "";

                      setFormData({
                        ...formData,
                        subCat_id: selectedSub?._id || selectedName || "",
                        subCategoryName: selectedSub?.name || selectedName || "",
                      });
                    }}
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select Subcategory</option>

                    {/* Render subCategories (objects) */}
                    {category.find((c) => c._id === formData.cat_id)?.subCategories?.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}

                    {/* Render subCategoryNames (strings) */}
                    {category.find((c) => c._id === formData.cat_id)?.subCategoryNames?.map((name, idx) => (
                      <option key={idx} value={name}>
                        {name}
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
              <input
                type="text"
                name="cat_id"
                value={formData.cat_id}
                onChange={handleChange}
                placeholder="Category Id"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="subCat_id"
                value={formData.subCat_id}
                onChange={handleChange}
                placeholder="SubCategory Id"
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

              {/* Contact Lens Fields */}
              {formData.subCategoryName === "Contact Lenses" && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="contact_type"
                    value={formData.contact_type}
                    onChange={handleChange}
                    placeholder="Lens Type (Daily/Monthly)"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    placeholder="Material"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="Manufacturer"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="water_content"
                    value={formData.water_content}
                    onChange={handleChange}
                    placeholder="Water Content"
                    className="w-full border p-2 rounded"
                  />
                </div>
              )}

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
                    className="w-20 h-20 object-cover mt-2 rounded"
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
                    className="w-20 h-20 object-cover mt-2 rounded"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {editId ? "Update" : "Submit"}
                </button>
              </div>
            </form>

            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-2xl"
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
