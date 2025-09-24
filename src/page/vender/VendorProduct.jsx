import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API, { IMAGE_URL } from "../../API/Api";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

const VendorProducts = () => {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [keptImages, setKeptImages] = useState([]);
    const [lensImage1, setLensImage1] = useState(null);
    const [lensImage2, setLensImage2] = useState(null);
    const [products, setProducts] = useState([]);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        cat_id: "",
        subCat_id: "",
        product_name: "",
        product_sku: "",
        product_price: "",
        product_sale_price: "",
        product_description: "",
        gender: "",
        frame_material: "",
        frame_shape: "",
        frame_color: "",
        frame_fit: "",
        product_lens_title1: "",
        product_lens_description1: "",
        product_lens_title2: "",
        product_lens_description2: "",
        type: "",
        material: "",
        manufacturer: "",
        water_content: "",
    });

    // Fetch all vendor products
    const fetchProducts = async () => {
        try {
            const res = await API.get("/vendor/products"); // your vendor products API
            setProducts(res.data.products || []);
        } catch (err) {
            Swal.fire("Error", "Failed to fetch products", "error");
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await API.get("/getcategories");
            setCategories(res.data.categories || []);
        } catch (err) {
            Swal.fire("Error", "Failed to fetch categories", "error");
        }
    };

    // Fetch subcategories when category changes
    const fetchSubCategories = async (catId) => {
        try {
            if (!catId) {
                setSubCategories([]);
                return;
            }
            const res = await API.get(`/getSubCategories/${catId}`);
            setSubCategories(res.data.subCategories || []);
        } catch (err) {
            Swal.fire("Error", "Failed to fetch subcategories", "error");
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchSubCategories(formData.cat_id);
    }, [formData.cat_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prev) => [...prev, ...files]);
    };

    const removeNewImage = (idx) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const removeExistingImage = (idx) => {
        setKeptImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const openAddModal = () => {
        setFormData({
            cat_id: "",
            subCat_id: "",
            product_name: "",
            product_sku: "",
            product_price: "",
            product_sale_price: "",
            product_description: "",
            gender: "",
            frame_material: "",
            frame_shape: "",
            frame_color: "",
            frame_fit: "",
            product_lens_title1: "",
            product_lens_description1: "",
            product_lens_title2: "",
            product_lens_description2: "",
            type: "",
            material: "",
            manufacturer: "",
            water_content: "",
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
            cat_id: product.cat_id || "",
            subCat_id: product.subCat_id || "",
            product_name: product.product_name || "",
            product_sku: product.product_sku || "",
            product_price: product.product_price || "",
            product_sale_price: product.product_sale_price || "",
            product_description: product.product_description || "",
            gender: product.gender || "",
            frame_material: product.frame_material || "",
            frame_shape: product.frame_shape || "",
            frame_color: product.frame_color || "",
            frame_fit: product.frame_fit || "",
            product_lens_title1: product.product_lens_title1 || "",
            product_lens_description1: product.product_lens_description1 || "",
            product_lens_title2: product.product_lens_title2 || "",
            product_lens_description2: product.product_lens_description2 || "",
            type: product.contact_type || "",
            material: product.material || "",
            manufacturer: product.manufacturer || "",
            water_content: product.water_content || "",
        });

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
                    await API.delete(`/vendor/deleteProduct/${id}`);
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

        if (!formData.cat_id || !formData.subCat_id) {
            Swal.fire("Error", "Please select category and subcategory", "error");
            return;
        }
        if (!formData.product_name || !formData.product_sku || !formData.product_price) {
            Swal.fire("Error", "Product name, SKU and price are required", "error");
            return;
        }

        try {
            const payload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                payload.append(key, value);
            });

            // Add existing images
            payload.append("existingImages", JSON.stringify(keptImages.map((img) => img.replace(IMAGE_URL, ""))));

            // Add new images
            images.forEach((file) => payload.append("product_image_collection", file));

            if (lensImage1 && typeof lensImage1 !== "string") payload.append("product_lens_image1", lensImage1);
            if (lensImage2 && typeof lensImage2 !== "string") payload.append("product_lens_image2", lensImage2);

            // For new vendor products, status should default to "pending"
            if (!editId) payload.append("status", "pending");

            if (editId) {
                await API.put(`/vendor/updateProduct/${editId}`, payload, { headers: { "Content-Type": "multipart/form-data" } });
                Swal.fire("Success", "Product updated successfully!", "success");
            } else {
                await API.post("/vendor/addProduct", payload, { headers: { "Content-Type": "multipart/form-data" } });
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
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Products</h2>
                <button onClick={openAddModal} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    <FaPlus className="inline mr-2" /> Add Product
                </button>
            </div>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2 border-black">Name</th>
                        <th className="border px-4 py-2 border-black">SKU</th>
                        <th className="border px-4 py-2 border-black">Price</th>
                        <th className="border px-4 py-2 border-black">Sale Price</th>
                        <th className="border px-4 py-2 border-black">Category</th>
                        <th className="border px-4 py-2 border-black">Subcategory</th>
                        <th className="border px-4 py-2 border-black">Status</th>
                        <th className="border px-4 py-2 border-black">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((pro) => (
                        <tr key={pro._id}>
                            <td className="border px-4 py-2 border-black text-center">{pro.product_name}</td>
                            <td className="border px-4 py-2 border-black text-center">{pro.product_sku}</td>
                            <td className="border px-4 py-2 border-black text-center">{pro.product_price}</td>
                            <td className="border px-4 py-2 border-black text-center">{pro.product_sale_price}</td>
                            <td className="border px-4 py-2 border-black text-center">{pro.cat_id?.categoryName}</td>
                            <td className="border px-4 py-2 border-black text-center">{pro.subCat_id?.subCategoryName}</td>
                            <td className="border px-4 py-2 border-black text-center capitalize">{pro.status}</td>
                            <td className="border px-4 py-2 border-black space-x-1">
                                <button onClick={() => openEditModal(pro)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(pro._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
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
                        <h3 className="text-lg font-semibold mb-4">{editId ? "Edit Product" : "Add Product"}</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Category dropdown */}
                            <div>
                                <label className="block text-gray-700 mb-1">Category</label>
                                <select
                                    value={formData.cat_id}
                                    onChange={(e) => setFormData({ ...formData, cat_id: e.target.value, subCat_id: "" })}
                                    className="w-full border rounded p-2"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
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
                                        onChange={(e) => setFormData({ ...formData, subCat_id: e.target.value })}
                                        className="w-full border rounded p-2"
                                    >
                                        <option value="">Select Subcategory</option>
                                        {subCategories.map((sub) => (
                                            <option key={sub._id} value={sub._id}>
                                                {sub.subCategoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Product Name, SKU, Price */}
                            <input type="text" name="product_name" value={formData.product_name} onChange={handleChange} placeholder="Product Name" className="w-full border p-2 rounded" />
                            <input type="text" name="product_sku" value={formData.product_sku} onChange={handleChange} placeholder="Product SKU" className="w-full border p-2 rounded" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" name="product_price" value={formData.product_price} onChange={handleChange} placeholder="Price" className="w-full border p-2 rounded" />
                                <input type="number" name="product_sale_price" value={formData.product_sale_price} onChange={handleChange} placeholder="Sale Price" className="w-full border p-2 rounded" />
                            </div>

                            <textarea name="product_description" value={formData.product_description} onChange={handleChange} placeholder="Product Description" className="w-full border p-2 rounded" />

                            {/* Images */}
                            <label htmlFor="product_image" className="block text-gray-700">Product Image</label>
                            <input id="product_image" type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded" />
                            <div className="flex gap-2 flex-wrap mt-2">
                                {keptImages.map((img, idx) => (
                                    <div key={idx} className="relative">
                                        <img src={img} alt="kept" className="w-16 h-16 object-cover rounded" />
                                        <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 hover:cursor-pointer">X</button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 flex-wrap mt-2">
                                {images.map((file, idx) => (
                                    <div key={idx} className="relative">
                                        <img src={URL.createObjectURL(file)} alt="new" className="w-16 h-16 object-cover rounded" />
                                        <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 hover:cursor-pointer">X</button>
                                    </div>
                                ))}
                            </div>

                            {/* Gender */}
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded mt-2">
                                <option value="">Select Gender</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Unisex">Unisex</option>
                            </select>

                            {/* Sunglasses Fields */}
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <input type="text" name="frame_material" value={formData.frame_material} onChange={handleChange} placeholder="Frame Material" className="w-full border p-2 rounded" />
                                <input type="text" name="frame_shape" value={formData.frame_shape} onChange={handleChange} placeholder="Frame Shape" className="w-full border p-2 rounded" />
                                <input type="text" name="frame_color" value={formData.frame_color} onChange={handleChange} placeholder="Frame Color" className="w-full border p-2 rounded" />
                                <input type="text" name="frame_fit" value={formData.frame_fit} onChange={handleChange} placeholder="Frame Fit" className="w-full border p-2 rounded" />
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                <button type="button" onClick={() => setOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">{editId ? "Update" : "Submit"}</button>
                            </div>
                        </form>

                        <button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-2xl"><IoIosCloseCircle /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorProducts;
