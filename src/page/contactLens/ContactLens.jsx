import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import API, { IMAGE_URL } from "../../API/Api";

const ContactLens = () => {
    const [showModal, setShowModal] = useState(false);
    const [keptImages, setKeptImages] = useState([]);
    const [images, setImages] = useState([]);
    const [editId, setEditId] = useState(null);
    const [lens, setLens] = useState([]);

    // ✅ set default category + subcategory here
    const [formData, setFormData] = useState({
        lens_name: "",
        brand_name: "",
        total_price: "",
        sale_price: "",
        lens_type: "",
        manufacturer: "",
        water_content: "",
        material: "",
        description: "",
        cat_sec: "Lense", // fixed
        subCategoryName: "Contact Lense", // fixed
    });

    // Fetch Lens
    const fetchLens = async () => {
        try {
            const res = await API.get("/getAllLens");
            setLens(res.data.lenses || []);
        } catch (err) {
            Swal.fire("Error", "Failed to fetch lens", "error");
        }
    };

    useEffect(() => {
        fetchLens();
    }, []);

    // handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    //  Delete lens
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
                    await API.delete(`/deleteLens/${id}`);
                    Swal.fire("Deleted!", "Lens deleted successfully!", "success");
                    fetchLens();
                } catch (err) {
                    Swal.fire("Error", "Failed to delete lens", "error");
                }
            }
        });
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

    // Remove existing kept image
    const removeExistingImage = (idx) => {
        setKeptImages((prev) => prev.filter((_, i) => i !== idx));
    };

    // Open Add Modal
    const openAddModal = () => {
        setFormData({
            lens_name: "",
            brand_name: "",
            total_price: "",
            sale_price: "",
            lens_type: "",
            manufacturer: "",
            material: "",
            description: "",
            water_content: "",
            cat_sec: "Lense", // ✅ default fixed
            subCategoryName: "Contact Lense", // ✅ default fixed
        });
        setImages([]);
        setKeptImages([]);
        setEditId(null);
        setShowModal(true);
    };

    // Open Edit Modal
    const handleUpdateClick = (lens) => {
        setFormData({
            ...lens,
            cat_sec: "Lense", // ✅ always fixed
            subCategoryName: "Contact Lense", // ✅ always fixed
        });
        setImages([]);
        setKeptImages(
            lens.lens_image_collection?.map((img) =>
                img.startsWith("http") ? img : IMAGE_URL + img
            ) || []
        );
        setEditId(lens._id);
        setShowModal(true);
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
            payload.append(
                "existingImages",
                JSON.stringify(keptImages.map((img) => img.replace(IMAGE_URL, "")))
            );

            // send new images
            images.forEach((file) => {
                payload.append("lens_image_collection", file);
            });

            if (editId) {
                await API.put(`/updateLens/${editId}`, payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                Swal.fire("Success", "Lens updated successfully!", "success");
            } else {
                await API.post("/addLens", payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                Swal.fire("Success", "Lens added successfully!", "success");
            }

            fetchLens();
            setShowModal(false);
        } catch (err) {
            Swal.fire(
                "Error",
                err.response?.data?.message || "Operation failed",
                "error"
            );
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-end mb-4">
                <button
                    onClick={openAddModal}
                    className="bg-green-500 text-white px-3 py-1 text-xl font-semibold rounded-lg hover:cursor-pointer flex items-center gap-2"
                >
                    <FaPlus /> ADD CONTACT LENS
                </button>
            </div>

            <div className="overflow-x-auto w-full">
                <div className="grid grid-cols-11 bg-black text-white py-2 px-4 font-semibold">
                    <div className="text-lg">Lens Name</div>
                    <div className="text-lg">Brand Name</div>
                    <div className="text-lg">Total Price</div>
                    <div className="text-lg">Sale Price</div>
                    <div className="text-lg">Lens Type</div>
                    <div className="text-lg">Manufacturer</div>
                    <div className="text-lg pl-5">Material</div>
                    <div className="text-lg">Description</div>
                    <div className="text-lg">Water% of Content</div>
                    <div className="text-lg">Images</div>
                    <div className="text-lg">Action</div>
                </div>

                {lens.map((data) => (
                    <div
                        key={data._id}
                        className="grid grid-cols-11 items-start border-b border-gray-300 py-2 px-4"
                    >
                        <p>{data.lens_name}</p>
                        <p>{data.brand_name}</p>
                        <p>{data.total_price}</p>
                        <p>{data.sale_price}</p>
                        <p>{data.lens_type}</p>
                        <p>{data.manufacturer}</p>
                        <p className="pl-6">{data.material}</p>
                        <p>{data.description}</p>
                        <p>{data.water_content}</p>
                        {data.lens_image_collection?.length ? (
                            <div className="grid grid-cols-3">
                                {data.lens_image_collection.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img.startsWith("http") ? img : IMAGE_URL + img}
                                        alt="lens"
                                        className="w-20 h-12 object-cover rounded"
                                    />
                                ))}
                            </div>
                        ) : (
                            "No Images"
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleUpdateClick(data)}
                                className="bg-blue-500 px-3 py-1 rounded-xl text-white hover:cursor-pointer"
                            >
                                <RiEdit2Fill className="text-2xl" />
                            </button>
                            <button
                                onClick={() => handleDelete(data._id)}
                                className="bg-red-500 px-3 py-1 rounded-xl text-white hover:cursor-pointer"
                            >
                                <MdDelete className="text-2xl" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ================== Modal ================== */}
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editId ? "Update Contact Lens" : "Add Contact Lens"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Category Dropdown (fixed) */}
                            <div>
                                <label className="block text-gray-700 mb-1">Category</label>
                                <select
                                    name="cat_sec"
                                    value="Lense"
                                    disabled
                                    className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                                >
                                    <option value="Lense">Lense</option>
                                </select>
                            </div>

                            {/* Subcategory Dropdown (fixed) */}
                            <div>
                                <label className="block text-gray-700 mb-1">Subcategory</label>
                                <select
                                    name="subCategoryName"
                                    value="Contact Lense"
                                    disabled
                                    className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                                >
                                    <option value="Contact Lense">Contact Lense</option>
                                </select>
                            </div>

                            <input
                                type="text"
                                name="lens_name"
                                value={formData.lens_name}
                                onChange={handleChange}
                                placeholder="Lens Name"
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="brand_name"
                                value={formData.brand_name}
                                onChange={handleChange}
                                placeholder="Brand Name"
                                className="w-full border p-2 rounded"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    name="total_price"
                                    value={formData.total_price || ""}
                                    onChange={handleChange}
                                    placeholder="Total Price"
                                    className="w-full border p-2 rounded"
                                />
                                <input
                                    type="number"
                                    name="sale_price"
                                    value={formData.sale_price || ""}
                                    onChange={handleChange}
                                    placeholder="Sale Price"
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            {/* Lens Type */}
                            <input
                                type="text"
                                name="lens_type"
                                value={formData.lens_type}
                                onChange={handleChange}
                                placeholder="Lens Type"
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
                                name="material"
                                value={formData.material}
                                onChange={handleChange}
                                placeholder="Material"
                                className="w-full border p-2 rounded"
                            />
                            <textarea type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Lens Description"
                                className="w-full border p-2 rounded">
                            </textarea>

                            <input
                                type="text"
                                name="water_content"
                                value={formData.water_content}
                                onChange={handleChange}
                                placeholder="Water% of Content"
                                className="w-full border p-2 rounded"
                            />

                            {/* Multiple Images */}
                            <label htmlFor="lens_image" className="block text-gray-700">
                                Lens Image
                            </label>
                            <input
                                id="lens_image"
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

                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    {editId ? "Update" : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactLens;
