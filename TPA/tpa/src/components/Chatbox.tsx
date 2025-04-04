import React, { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useStaff } from "@/hooks/use-staff";
import { useCustomer } from "@/hooks/use-customer";

interface ChatMessage {
  id: string;
  text: string;
  created_at: number;
  staff_id: string;
  name: string;
  role: string;
  avatarInitials: string;
}

type ChatType = "group" | "personal" | "recent";

type Props = {
  groupNames: string[];
  staffMembers?: Staff[];
};

export default function Chatbox({ groupNames, staffMembers = [] }: Props) {
  const staff = useStaff();
  const customer = useCustomer();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatType, setChatType] = useState<ChatType>("group");
  const [chatGroup, setChatGroup] = useState<string>(groupNames[0]);
  const [selectedUser, setSelectedUser] = useState<Staff | null>(null);
  const [availableStaff, setAvailableStaff] = useState<Staff[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAvailableStaff = async () => {
      // if (!staff) return;
      setLoading(false);
      try {
        // If staffMembers were provided as props, use those
        if (staffMembers.length > 0 && staff) {
          // Filter out the current user
          setAvailableStaff(
            staffMembers.filter((s) => s.staff_id !== staff.staff_id)
          );
        } else {
          // Otherwise fetch from backend
          const fetchedStaff: Staff[] = await invoke("get_all_staffs");

          let filteredStaff: Staff[] = [];
          if(staff){
            if(staff.role === "ride manager"){
              // filteredStaff = fetchedStaff.filter((s) => s.role === "maintenance manager");
              const maintenanceOA: Staff =  {
                staff_id: "maintenanceOA",
                name: "Maintenance OA",
                password: "",
                role: "Maintenance Official Account",
              }
              filteredStaff.push(maintenanceOA);
            }else if(staff.role === "customer service"){
              // ambil smua customers
              const customers: Customer[] = await invoke("get_all_customers");
              // console.log(customers)
              customers.forEach((customer) => {
                let staff: Staff = {
                  staff_id: customer.customer_id,
                  name: customer.name,
                  password: "",
                  role: "Customer",
                }
                filteredStaff.push(staff);
              })
              console.log(filteredStaff)
            }else if(staff.role === "maintenance manager"){
              filteredStaff = fetchedStaff.filter((s) => s.role === "ride manager");
            }else{// ambil smua staff
              filteredStaff = fetchedStaff
            }
            filteredStaff = filteredStaff.filter((s) => s.staff_id !== staff.staff_id);
          }else{// customer
            if(!customer) return;
            const serviceOA: Staff =  {
              staff_id: "serviceOA",
              name: "Service OA",
              password: "",
              role: "Service Official Account",
            }
            filteredStaff.push(serviceOA);
          }

          setAvailableStaff(filteredStaff);
        }
      } catch (error) {
        console.error("Error fetching staff members:", error);
      }
    };

    fetchAvailableStaff();
  }, [staff, customer]);

  // Set initial selectedUser once availableStaff is loaded
  useEffect(() => {
    if (availableStaff.length > 0 && chatType === "personal" && !selectedUser) {
      setSelectedUser(availableStaff[0]);
    }
  }, [availableStaff, chatType, selectedUser]);

  const fetchMessages = async () => {
    // if (!staff) return;

    try {
      let fetchedMessages: ChatMessage[];

      if (chatType === "group") {
        fetchedMessages = await invoke("get_chat_messages", {
          chatgroup: chatGroup,
          limit: 50,
        });
      } else {
        // For personal chats or recent chat selection, we need both users' IDs
        if (!selectedUser) return;
        console.log("kontol");

        if(staff){
          if (staff.role === "maintenance manager") {
            fetchedMessages = await invoke("get_personal_chat_messages", {
              userid1: "maintenanceOA",
              userid2: selectedUser.staff_id,
              limit: 50,
            });
          } else if (staff.role === "customer service") {
            fetchedMessages = await invoke("get_personal_chat_messages", {
              userid1: "serviceOA",
              userid2: selectedUser.staff_id,
              limit: 50,
            });
          } else {
            fetchedMessages = await invoke("get_personal_chat_messages", {
              userid1: staff?.staff_id,
              userid2: selectedUser.staff_id,
              limit: 50,
            });
          }
        }else{
          console.log("kontol2")
          fetchedMessages = await invoke("get_personal_chat_messages", {
            userid1: customer?.customer_id,
            userid2: selectedUser.staff_id,
            limit: 50,
          });
        }
      }

      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    if (!staff && !customer) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [staff, customer, chatGroup, chatType, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      if (chatType === "group" && staff) {
        await invoke("send_chat_message", {
          chatgroup: chatGroup,
          message: newMessage,
          staffId: staff.staff_id,
          name: staff.name,
          role: staff.role,
        });
      } else {
        if (!selectedUser) return;
        if(staff){
          await invoke("send_personal_message", {
            senderId: staff.staff_id,
            receiverId: selectedUser.staff_id,
            message: newMessage,
            senderName: staff.name,
            senderRole: staff.role,
          }); 
        }else if(customer){
          await invoke("send_personal_message", {
            senderId: customer.customer_id,
            receiverId: selectedUser.staff_id,
            message: newMessage,
            senderName: customer.name,
            senderRole: "customer",
          });
        }
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleChatTypeChange = (type: ChatType) => {
    setChatType(type);
    setMessages([]); // Clear messages when switching types
  };

  if (loading && !staff) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  // if (!staff) {
  //   return (
  //     <div className="flex justify-center items-center h-screen text-xl text-gray-600">
  //       Please log in as staff to access the chat.
  //     </div>
  //   );
  // }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-screen max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Sidebar for recent conversations */}
      <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 bg-blue-600 text-white">
          <h2 className="font-bold text-lg">Chats</h2>
        </div>

        {/* Chat type selection */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              chatType === "group"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => handleChatTypeChange("group")}
          >
            Groups
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              chatType === "personal" || chatType === "recent"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => handleChatTypeChange("recent")}
          >
            Personal
          </button>
        </div>

        {/* List content based on selected type */}
        <div className="flex-1 overflow-y-auto">
          {chatType === "group" ? (
            <div className="py-2">
              {groupNames.map((group) => (
                <button
                  key={group}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 ${
                    chatGroup === group ? "bg-blue-50 text-blue-600" : ""
                  }`}
                  onClick={() => setChatGroup(group)}
                >
                  <div className="font-medium"># {group}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-2">
              {availableStaff.map((user) => (
                <button
                  key={user.staff_id}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 ${
                    selectedUser?.staff_id === user.staff_id &&
                    chatType === "personal"
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedUser(user);
                    setChatType("personal");
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold mr-3">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200 flex items-center">
          {chatType === "group" ? (
            <>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                #
              </div>
              <div>
                <h1 className="font-bold text-lg">{chatGroup}</h1>
                <p className="text-xs text-gray-500">Group Chat</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3">
                {selectedUser?.name.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <h1 className="font-bold text-lg">
                  {selectedUser?.name || "Select a user"}
                </h1>
                <p className="text-xs text-gray-500">
                  {selectedUser?.role || "Personal Chat"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
          {loading ? (
            <div className="text-gray-500 text-center">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-gray-500 text-center p-8">
              {chatType === "group" ? (
                <>No messages yet in {chatGroup}. Start the conversation!</>
              ) : selectedUser ? (
                <>No messages yet with {selectedUser.name}. Say hello!</>
              ) : (
                <>Select someone to start chatting</>
              )}
            </div>
          ) : (
            messages.map((msg) => {
              // First determine if current user is staff or customer
              const isCurrentUser = staff
                ? msg.staff_id === staff.staff_id
                : customer && msg.staff_id === customer.customer_id;

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isCurrentUser && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-2 shadow-md">
                      {msg.avatarInitials || msg.name.charAt(0)}
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-lg max-w-xs shadow-md ${
                      isCurrentUser
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    {!isCurrentUser && (
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        {msg.name}{" "}
                        <span className="text-gray-400">({msg.role})</span>
                      </div>
                    )}
                    <div className="text-sm">{msg.text}</div>
                    <div className="text-xs mt-1 text-right text-gray-400">
                      {formatTimestamp(msg.created_at)}
                    </div>
                  </div>

                  {isCurrentUser && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold ml-2 shadow-md">
                      {msg.avatarInitials || msg.name.charAt(0)}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-white flex border-t border-gray-200"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${
              chatType === "group"
                ? chatGroup
                : selectedUser?.name || "selected user"
            }...`}
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={chatType !== "group" && !selectedUser}
          />
          <button
            type="submit"
            disabled={
              !newMessage.trim() || (chatType !== "group" && !selectedUser)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-r-lg transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
