// import React, { useState, useEffect, useRef } from "react";
// import API from "../../API/Api";

// const AdminChatDashboard = () => {
//   const [vendors, setVendors] = useState([]);
//   const [selectedVendor, setSelectedVendor] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const res = await API.get("/allvendor");

//         setVendors(res.data);
//         if (res.data.length > 0) setSelectedVendor(res.data[0]);
//       } catch (err) {
//         console.error(
//           "Error fetching vendors:",
//           err.response?.data?.message || err.message
//         );
//       }
//     };
//     fetchVendors();
//   }, []);

//   useEffect(() => {
//     if (!selectedVendor) return;

//     const fetchMessages = async () => {
//       try {
//         const res = await API.get(`/chat/${selectedVendor.userId}`);
//         setMessages(res.data);
//       } catch (err) {
//         console.error(
//           "Error fetching messages:",
//           err.response?.data?.message || err.message
//         );
//       }
//     };

//     fetchMessages();

//     const interval = setInterval(fetchMessages, 2000);

//     return () => clearInterval(interval);
//   }, [selectedVendor]);

//   const handleSend = async () => {
//     if (!newMessage.trim() || !selectedVendor) return;

//     try {
//       const res = await API.post("/chat/send", {
//         receiverId: selectedVendor.userId,
//         text: newMessage,
//       });
//       setMessages([...messages, res.data]);
//       setNewMessage("");
//     } catch (err) {
//       console.error("Error sending message:", err.response?.data || err);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* ---------------- Vendor List ---------------- */}
//       <div className="w-1/4 bg-white border-r overflow-y-auto">
//         <h2 className="text-xl font-bold p-4 border-b">Vendors</h2>
//         {vendors.map((vendor) => (
//           <div
//             key={vendor._id}
//             onClick={() => setSelectedVendor(vendor)}
//             className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
//               selectedVendor?._id === vendor._id ? "bg-gray-200" : ""
//             }`}
//           >
//             <p className="font-semibold">{vendor.contactName}</p>
//             <p className="text-sm text-gray-500">{vendor.contactEmail}</p>
//           </div>
//         ))}
//       </div>

//       {/* ---------------- Chat Window ---------------- */}
//       <div className="flex-1 flex flex-col">
//         <div className="p-4 border-b bg-white font-bold">
//           Chat with {selectedVendor?.contactName || "Select a Vendor"}
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
//           {messages.map((msg) => (
//             <div
//               key={msg._id}
//               className={`flex ${
//                 msg.sender === selectedVendor.userId
//                   ? "justify-start"
//                   : "justify-end"
//               }`}
//             >
//               <div
//                 className={`px-4 py-2 rounded-lg max-w-xs break-words ${
//                   msg.sender === selectedVendor.userId
//                     ? "bg-gray-200 text-gray-800"
//                     : "bg-blue-500 text-white"
//                 }`}
//               >
//                 {msg.text}
//               </div>
//             </div>
//           ))}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* ---------------- Input Box ---------------- */}
//         <div className="p-4 border-t bg-white flex">
//           <input
//             type="text"
//             className="flex-1 border rounded-l px-4 py-2 focus:outline-none"
//             placeholder="Type a message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           />
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
//             onClick={handleSend}
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminChatDashboard;



import React, { useState, useEffect, useRef } from "react";
import API from "../../API/Api";

const AdminChatDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // vendor or insurance
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // ---------------- Fetch vendors ----------------
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await API.get("/allvendor");
        setVendors(res.data);
      } catch (err) {
        console.error("Error fetching vendors:", err.response?.data?.message || err.message);
      }
    };
    fetchVendors();
  }, []);

  // ---------------- Fetch insurances comp----------------
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await API.get("/company/getAllCompany");
        setInsurances(res.data.companies || []);
        if (res.data.companies?.length > 0) {
          setSelectedUser(res.data.companies[0]);

          
        }
      } catch (err) {
        console.error("Error fetching companies:", err.response?.data || err);
      }
    };
    fetchCompanies();
  }, []);

  // ---------------- Fetch messages ----------------
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/chat/${selectedUser.userId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err.response?.data?.message || err.message);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  // ---------------- Send message ----------------
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const res = await API.post("/chat/send", {
        receiverId: selectedUser.userId,
        text: newMessage,
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err.response?.data || err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ---------------- User List ---------------- */}
      <div className="w-1/4 bg-white border-r overflow-y-auto">
        <h2 className="text-xl font-bold p-4 border-b">Vendors</h2>
        {vendors.map((vendor) => (
          <div
            key={vendor._id}
            onClick={() => setSelectedUser(vendor)}
            className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
              selectedUser?._id === vendor._id ? "bg-gray-200" : ""
            }`}
          >
            <p className="font-semibold">{vendor.contactName}</p>
            <p className="text-sm text-gray-500">{vendor.contactEmail}</p>
          </div>
        ))}

        <h2 className="text-xl font-bold p-4 border-b">Insurance Companies</h2>
        {insurances.map((ins) => (
          <div
            key={ins._id}
            onClick={() => setSelectedUser(ins)}
            className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
              selectedUser?._id === ins._id ? "bg-gray-200" : ""
            }`}
          >
            <p className="font-semibold">{ins.companyName}</p>
            <p className="text-sm text-gray-500">{ins.contactEmail}</p>
          </div>
        ))}
      </div>

      {/* ---------------- Chat Window ---------------- */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white font-bold">
          Chat with {selectedUser?.contactName || selectedUser?.companyName || "Select a User"}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender === selectedUser.userId ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                  msg.sender === selectedUser.userId
                    ? "bg-gray-200 text-gray-800"
                    : "bg-blue-500 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* ---------------- Input Box ---------------- */}
        <div className="p-4 border-t bg-white flex">
          <input
            type="text"
            className="flex-1 border rounded-l px-4 py-2 focus:outline-none"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChatDashboard;
