import React, { useState, useEffect, useRef } from "react";
import API from "../../API/Api";
import { useAuth } from "../../authContext/AuthContext"; // assuming you store logged-in insurance details

const InsuranceChat = () => {
  const { user } = useAuth(); // logged in insurance company { userId, role, etc. }
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/chat/${user.userId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err.response?.data?.message || err.message);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await API.post("/chat/send", {
        receiverId: "admin", // fixed → send to admin
        text: newMessage,
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err.response?.data || err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white font-bold">
        Chat with Admin
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.sender === user.userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                msg.sender === user.userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
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
  );
};

export default InsuranceChat;
