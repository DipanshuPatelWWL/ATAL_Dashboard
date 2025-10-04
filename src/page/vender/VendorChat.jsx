import React, { useState, useEffect, useRef } from "react";
import API from "../../API/Api";

const VendorChatDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [adminId, setAdminId] = useState(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token"); // vendor token

  //  Fetch admin ID (assume only one admin exists)
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const adminId = "68a6e76c4c3e5ed4fd0df895"; // admin _id
        const res = await API.get(`/getAdminById/${adminId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminId(res.data._id);
      } catch (err) {
        console.error("Error fetching admin:", err.response?.data || err);
      }
    };
    fetchAdmin();
  }, [token]);

  //  Fetch messages with admin
  useEffect(() => {
    if (!adminId) return;

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/chat/${adminId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err.response?.data || err);
      }
    };

    // Initial fetch
    fetchMessages();
  }, [adminId, token]);

  //  Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !adminId) return;
    try {
      const res = await API.post(
        "/send",
        { receiverId: adminId, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err.response?.data || err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-white border-b font-bold">Chat with Admin</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.sender === adminId ? "justify-start" : "justify-end"
              }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs break-words ${msg.sender === adminId
                ? "bg-gray-200 text-gray-800"
                : "bg-green-500 text-white"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t flex">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-l px-4 py-2 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default VendorChatDashboard;
