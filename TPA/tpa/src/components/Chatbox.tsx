import React, { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";

// Define the interface for Chat Message
interface ChatMessage {
  id: string;
  text: string;
  created_at: number;
  staff_id: string;
  name: string;
  role: string;
  avatarInitials: string;
}

export default function Chatbox() {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatGroup, setChatGroup] = useState("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch current staff from Tauri backend
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

  const initialFetch = async () => {
    setLoading(true)

    try {
      const fetchedMessages = (await invoke("get_chat_messages", {
        chatgroup: chatGroup,
        limit: 100,
      })) as ChatMessage[];

      setMessages(fetchedMessages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  }

  const fetchMessages = async () => {
    try {
      const fetchedMessages: ChatMessage[] = await invoke("get_chat_messages", {
        chatgroup: chatGroup,
        limit: 50, // Adjust the limit as needed
      });
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  // Fetch messages when staff is loaded or chat group changes
  useEffect(() => {
    if (!staff) return;

    setLoading(true);

    initialFetch();

    const interval = setInterval(fetchMessages, 3000); // Fetch every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [staff, chatGroup]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !staff) return;

    try {
      // Send message using Tauri backend
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

  // Handle chat group change
  const handleChatGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChatGroup(e.target.value);
  };

  if (loading && !staff) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">
          Please log in as staff to access the chat.
        </div>
      </div>
    );
  }

  // Format timestamp from backend
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header with chat group selector */}
      <div className="bg-blue-600 p-4 flex justify-between items-center rounded-t-lg">
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

        <div className="flex items-center space-x-4">
          <div>
            <select
              value={chatGroup}
              onChange={handleChatGroupChange}
              className="bg-blue-700 text-white border border-blue-500 rounded px-2 py-1 text-sm"
            >
              <option value="general">General Chat</option>
              <option value="managers">Managers Only</option>
              <option value="support">Support Team</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">
              No messages yet. Start the conversation!
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-4 ${
                msg.staff_id === staff.staff_id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {msg.staff_id !== staff.staff_id && (
                <div className="flex flex-col items-center mr-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold self-end">
                    {msg.avatarInitials || msg.name.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{msg.role}</span>
                </div>
              )}

              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.staff_id === staff.staff_id
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white border border-gray-200 rounded-bl-none"
                }`}
              >
                {msg.staff_id !== staff.staff_id && (
                  <div className="font-medium text-xs mb-1">{msg.name}</div>
                )}
                <div className="break-words">{msg.text}</div>
                <div className="text-xs mt-1 opacity-70">
                  {formatTimestamp(msg.created_at)}
                </div>
              </div>

              {msg.staff_id === staff.staff_id && (
                <div className="flex flex-col items-center ml-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold self-end">
                    {msg.avatarInitials || msg.name.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{msg.role}</span>
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
        className="p-4 bg-white border-t border-gray-200 flex rounded-b-lg"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-r-lg transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
