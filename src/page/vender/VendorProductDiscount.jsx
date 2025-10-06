import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import API, { IMAGE_URL } from "../../API/Api";
import Swal from "sweetalert2";

const VendorProductDiscount = () => {
    const [products, setProducts] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [formData, setFormData] = useState({
        discountType: "",
        discountValue: "",
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [calculatedPrice, setCalculatedPrice] = useState(0);

    // Fetch all vendor products
    const fetchAllProduct = async () => {
        try {
            const res = await API.get("/getVendorProduct");
            const productData = res.data.products.map((pro) => {
                // Calculate discountedPrice dynamically
                const basePrice = pro.product_sale_price || pro.product_price;
                let discountedPrice = basePrice;

                if (pro.discountType && pro.discountValue) {
                    const discount = parseFloat(pro.discountValue);
                    if (pro.discountType === "percentage") {
                        discountedPrice -= (discountedPrice * discount) / 100;
                    } else if (pro.discountType === "flat") {
                        discountedPrice -= discount;
                    }
                }

                if (discountedPrice < 0) discountedPrice = 0;

                return { ...pro, discountedPrice };
            });
            setProducts(productData);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        fetchAllProduct();
    }, []);

    // Open modal and prefill form
    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setFormData({
            discountType: product.discountType || "",
            discountValue: product.discountValue || "",
        });

        const basePrice = product.product_sale_price || product.product_price;
        setCalculatedPrice(basePrice.toFixed(2));
        setOpenAddModal(true);
    };

    // Update form state
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Live discounted price calculation
    useEffect(() => {
        if (!selectedProduct) return;

        const basePrice = selectedProduct.product_sale_price || selectedProduct.product_price;
        let finalPrice = basePrice;

        if (formData.discountType && formData.discountValue) {
            const discount = parseFloat(formData.discountValue);
            if (formData.discountType === "percentage") {
                finalPrice -= (finalPrice * discount) / 100;
            } else if (formData.discountType === "flat") {
                finalPrice -= discount;
            }
        }

        if (finalPrice < 0) finalPrice = 0;
        setCalculatedPrice(finalPrice.toFixed(2));
    }, [formData.discountType, formData.discountValue, selectedProduct]);

    // Submit discount
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        try {
            const payload = {
                discountType: formData.discountType,
                discountValue: Number(formData.discountValue),
            };

            const res = await API.put(`/vendor-products/${selectedProduct._id}/discount`, payload);

            if (res.data.success) {
                Swal.fire({
                    title: "Success!",
                    text: "Discount updated successfully!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
                setOpenAddModal(false);
                fetchAllProduct();
            } else {
                Swal.fire({
                    title: "Error!",
                    text: res.data.message || "Failed to update discount.",
                    icon: "error",
                });
            }
        } catch (err) {
            console.error("Error updating discount:", err);
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message || "Failed to update discount.",
                icon: "error",
            });
        }
    };

    // Helper: Get dynamic discounted price
    const getDiscountedPrice = (product) => {
        const basePrice = product.product_sale_price || product.product_price;
        let finalPrice = basePrice;

        if (product.discountType && product.discountValue) {
            const discount = parseFloat(product.discountValue);
            if (product.discountType === "percentage") {
                finalPrice -= (finalPrice * discount) / 100;
            } else if (product.discountType === "flat") {
                finalPrice -= discount;
            }
        }

        return finalPrice < 0 ? 0 : finalPrice.toFixed(2);
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-semibold mb-4">Vendor Products Discount</h2>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Price</th>
                        <th className="border px-4 py-2">Sale Price</th>
                        <th className="border px-4 py-2">Discounted Price</th>
                        <th className="border px-4 py-2">Discount Type</th>
                        <th className="border px-4 py-2">Discount</th>
                        <th className="border px-4 py-2">Image</th>
                        <th className="border px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((pro) => (
                        <tr key={pro._id}>
                            <td className="border px-4 py-2 text-center capitalize">{pro.product_name}</td>
                            <td className="border px-4 py-2 text-center">${pro.product_price}</td>
                            <td className="border px-4 py-2 text-center">${pro.product_sale_price || "-"}</td>
                            <td className="border px-4 py-2 text-center">${getDiscountedPrice(pro)}</td>
                            <td className="border px-4 py-2 text-center">
                                {pro.discountType
                                    ? pro.discountType === "percentage"
                                        ? "Percentage"
                                        : "Flat"
                                    : "No Discount"}
                            </td>
                            <td className="border px-4 py-2 text-center">
                                {pro.discountType
                                    ? pro.discountType === "percentage"
                                        ? `${pro.discountValue}%`
                                        : `$${pro.discountValue}`
                                    : "No Discount"}
                            </td>
                            <td className="border px-4 py-2 text-center">
                                {pro.product_image_collection?.length > 0 ? (
                                    <img
                                        src={
                                            pro.product_image_collection[0].startsWith("http")
                                                ? pro.product_image_collection[0]
                                                : IMAGE_URL + pro.product_image_collection[0]
                                        }
                                        alt="product"
                                        className="w-20 h-12 object-cover rounded"
                                    />
                                ) : (
                                    "No Image"
                                )}
                            </td>
                            <td className="border px-4 py-2 text-center">
                                <button
                                    onClick={() => handleOpenModal(pro)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                                >
                                    <FaPlus /> Add
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {openAddModal && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">
                            Add Discount for {selectedProduct.product_name}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    value={selectedProduct.product_price}
                                    placeholder="Price"
                                    className="w-full border p-2 rounded"
                                    disabled
                                />
                                <input
                                    type="number"
                                    value={calculatedPrice}
                                    placeholder="Discounted Price"
                                    className="w-full border p-2 rounded bg-gray-100"
                                    disabled
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    name="discountType"
                                    value={formData.discountType}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    required
                                >
                                    <option value="">Select Discount Type</option>
                                    <option value="percentage">Percentage</option>
                                    <option value="flat">Flat</option>
                                </select>

                                <input
                                    type="number"
                                    name="discountValue"
                                    value={formData.discountValue}
                                    onChange={handleChange}
                                    placeholder="Discount Value"
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>

                        <button
                            onClick={() => setOpenAddModal(false)}
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

export default VendorProductDiscount;
