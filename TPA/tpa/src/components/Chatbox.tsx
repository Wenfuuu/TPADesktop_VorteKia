import { useState } from "react";

const ChatBox = () => {
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages([...chatMessages, newMessage]);
    setNewMessage("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 mb-6">
      <h2 className="text-xl font-semibold mb-3">Group Chat</h2>
      <div className="h-40 overflow-y-auto border rounded p-3 mb-3 bg-gray-50">
        {chatMessages.length === 0 ? <p className="text-gray-500">No messages yet.</p> : chatMessages.map((msg, index) => <p key={index}>{msg}</p>)}
      </div>
      <input type="text" className="w-full p-2 border rounded mb-2" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full" onClick={sendMessage}>
        Send Message
      </button>
    </div>
  );
};

export default ChatBox;