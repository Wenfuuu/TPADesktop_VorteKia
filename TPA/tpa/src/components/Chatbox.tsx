import React, { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";

interface ChatMessage {
  id: string;
  text: string;
  created_at: number;
  staff_id: string;
  name: string;
  role: string;
  avatarInitials: string;
}

type Props = {
  groupNames: string[]
}

export default function Chatbox({groupNames} : Props) {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatGroup, setChatGroup] = useState<string>(groupNames[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getStaff = async () => {
      try {
        const response = await invoke("get_current_staff");
        if (response !== null) {
          setStaff(response as Staff);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching staff:", error);
        setLoading(false);
      }
    };

    getStaff();
  }, []);

  const fetchMessages = async () => {
    try {
      const fetchedMessages: ChatMessage[] = await invoke("get_chat_messages", {
        chatgroup: chatGroup,
        limit: 50,
      });
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    if (!staff) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [staff, chatGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !staff) return;

    try {
      await invoke("send_chat_message", {
        chatgroup: chatGroup,
        message: newMessage,
        staffId: staff.staff_id,
        name: staff.name,
        role: staff.role,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading && !staff) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Please log in as staff to access the chat.
      </div>
    );
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex justify-between items-center rounded-t-lg shadow-md">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold mr-3">
            {staff.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <h1 className="text-white font-bold">{staff.name}</h1>
            <p className="text-xs text-blue-100">{staff.role}</p>
          </div>
        </div>

        <select
          value={chatGroup}
          onChange={(e) => setChatGroup(e.target.value)}
          className="bg-blue-700 text-white border border-blue-500 rounded px-3 py-1 text-sm focus:outline-none"
        >
          {groupNames.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
        {loading ? (
          <div className="text-gray-500 text-center">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-500 text-center">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.staff_id === staff.staff_id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {msg.staff_id !== staff.staff_id && (
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-2 shadow-md">
                  {msg.avatarInitials || msg.name.charAt(0)}
                </div>
              )}

              <div
                className={`p-3 rounded-lg max-w-xs shadow-md ${
                  msg.staff_id === staff.staff_id
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white border border-gray-200 rounded-bl-none"
                }`}
              >
                {msg.staff_id !== staff.staff_id && (
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    {msg.name}{" "}
                    <span className="text-gray-400">({msg.role})</span>
                  </div>
                )}
                <div className="text-sm">{msg.text}</div>
                <div className="text-xs mt-1 text-gray-400">
                  {formatTimestamp(msg.created_at)}
                </div>
              </div>

              {msg.staff_id === staff.staff_id && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold ml-2 shadow-md">
                  {msg.avatarInitials || msg.name.charAt(0)}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white flex border-t border-gray-200 rounded-b-lg"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-r-lg transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
