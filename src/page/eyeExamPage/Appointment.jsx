import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../API/Api";
import { FaSearch } from "react-icons/fa";

const Appointment = () => {
    const [allExam, setAllExam] = useState([]);
    const [filteredExam, setFilteredExam] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDoctor, setFilterDoctor] = useState("");

    const fetchAllExam = async () => {
        try {
            const res = await API.get("/getAllEyeExam");
            const exams = res.data.data || [];
            setAllExam(exams);
            setFilteredExam(exams);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAllExam();
    }, []);

    // 🔍 Filter + Search Functionality
    useEffect(() => {
        let filtered = allExam;

        if (filterDoctor) {
            filtered = filtered.filter((exam) =>
                exam.doctorName?.toLowerCase().includes(filterDoctor.toLowerCase())
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (exam) =>
                    exam.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    exam.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    exam.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    exam.examType?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredExam(filtered);
    }, [searchTerm, filterDoctor, allExam]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Title */}
            <motion.h2
                className="text-3xl font-bold text-center text-red-600 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Eye Examination Appointments
            </motion.h2>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                {/* Search Bar */}
                <div className="relative w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search by patient name, email, or exam type..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>

                {/* Doctor Filter */}
                <select
                    className="w-full md:w-1/4 py-2 px-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none shadow-sm"
                    value={filterDoctor}
                    onChange={(e) => setFilterDoctor(e.target.value)}
                >
                    <option value="">All Doctors</option>
                    {[...new Set(allExam.map((exam) => exam.doctorName))].map(
                        (doctor, i) =>
                            doctor && (
                                <option key={i} value={doctor}>
                                    {doctor}
                                </option>
                            )
                    )}
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow-lg rounded-2xl bg-white">
                <div className="grid grid-cols-9 text-center bg-black text-white font-semibold py-3 px-4 sticky top-0 z-10 rounded-t-2xl">
                    <div>Appointment Date</div>
                    <div>Exam Type</div>
                    <div>Doctor</div>
                    <div>Patient Name</div>
                    <div>Gender</div>
                    <div>D.O.B</div>
                    <div>Phone</div>
                    <div>Email</div>
                    <div>Weekday</div>
                </div>

                <div className="max-h-[560px] overflow-y-auto">
                    {filteredExam.length > 0 ? (
                        filteredExam.map((data, idx) => (
                            <motion.div
                                key={idx}
                                className={`grid grid-cols-9 text-center items-center px-4 py-3 text-sm border-b border-gray-200 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    }`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                whileHover={{

                                    backgroundColor: "#b0b0ad39",
                                    transition: { duration: 0.2 },
                                }}
                            >
                                <div>{data.appointmentDate || "-"}</div>
                                <div>{data.examType || "-"}</div>
                                <div>{data.doctorName || "-"}</div>
                                <div>
                                    {data.firstName} {data.lastName}
                                </div>
                                <div>{data.gender || "-"}</div>
                                <div>{data.dob || "-"}</div>
                                <div>{data.phone || "-"}</div>
                                <div className="break-words">{data.email || "-"}</div>
                                <div>{data.weekday || "-"}</div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-500 font-medium">
                            No matching appointments found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Appointment;
