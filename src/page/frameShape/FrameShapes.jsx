import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import API, { IMAGE_URL } from "../../API/Api";

const FrameShapes = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("add");

    const [formData, setFormData] = useState({
        frameName: "",
        image: null,
        id: null,
    });

    const [frameShapeData, setFrameShapeData] = useState([]);

    // fetch API data
    const fetchFrameShapes = async () => {
        try {
            const response = await API.get("/getFrameShapes");
            setFrameShapeData(response.data.frameShapesData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchFrameShapes();
    }, []);

    // handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // handle file change
    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            image: e.target.files[0],
        }));
    };

    // delete API
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await API.delete(`/deleteFrameShapes/${id}`);
                    fetchFrameShapes();
                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: "Frame shape deleted successfully.",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Failed!",
                        text: `Deletion Failed : ${error}`,
                        timer: 2000,
                        showConfirmButton: false,
                    });
                }
            }
        });
    };

    // add frame shape
    const handleClickFrame = () => {
        setShowModal(true);
        setModalType("add");
        setFormData({ frameName: "", image: null, id: null });
    };

    // update click
    const handleUpdateClick = (frame) => {
        setModalType("update");
        setShowModal(true);
        setFormData({
            id: frame._id,
            frameName: frame.frameName || "",
            image: null,
        });
    };

    // submit handler for frame shapes
    const handleSubmitFrameShape = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("frameName", formData.frameName);

            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }

            if (modalType === "add") {
                await API.post("/addFrameShapes", formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await API.put(`/updateFrameShapes/${formData.id}`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            Swal.fire({
                icon: "success",
                title: "Done!",
                text: "Frame shape saved successfully!",
                timer: 2000,
                showConfirmButton: false,
            });

            setShowModal(false);
            fetchFrameShapes();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-4">

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleClickFrame}
                    className="bg-green-500 text-white px-3 py-1 text-xl font-semibold rounded-lg hover:cursor-pointer flex items-center gap-2"
                >
                    <FaPlus /> ADD FRAMESHAPE
                </button>
            </div>

            <div className="overflow-x-auto w-full">
                <div className="grid grid-cols-3 gap-x-10 bg-black text-white py-2 px-4 font-semibold">
                    <div className="text-lg">FrameName</div>
                    <div className="text-lg">Image</div>
                    <div className="text-lg">Action</div>
                </div>

                {frameShapeData.map((data) => (
                    <div
                        key={data._id}
                        className="grid grid-cols-3 gap-x-10 items-start border-b border-gray-300 py-2 px-4"
                    >
                        <h1>{data.frameName}</h1>
                        {data.image && (
                            <img
                                src={
                                    data.image.startsWith("http")
                                        ? data.image
                                        : `${IMAGE_URL + data.image}`
                                }
                                alt={data.frameName}
                                className="w-20 h-10 object-cover rounded"
                            />
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
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
                        <h2 className="text-xl font-bold mb-4">
                            {modalType === "add" ? "Add FrameShape" : "Update FrameShape"}
                        </h2>

                        <form onSubmit={handleSubmitFrameShape} className="space-y-3">
                            <div>
                                <input
                                    type="text"
                                    name="frameName"
                                    placeholder="FrameName"
                                    value={formData.frameName}
                                    className="border p-2 w-full rounded"
                                    onChange={handleChange}
                                    required
                                />
                                <label className="block text-gray-700 mb-1">Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                    className="w-full border rounded p-2"
                                />
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
                                    {modalType === "add" ? "Submit" : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FrameShapes;
