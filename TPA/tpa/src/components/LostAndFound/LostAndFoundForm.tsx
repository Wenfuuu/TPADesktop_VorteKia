import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { toast } from "sonner";
import { useLostAndFound } from "../context/LostAndFoundContext";

const LostAndFoundForm = () => {
  const [newItem, setNewItem] = useState<Partial<LostAndFoundItem>>({
    item_id: "",
    name: "",
    item_type: "",
    color: "",
    last_seen_location: "",
    owner: "",
    status: "Missing",
  });
  const [errors, setErrors] = useState<string>("");

  const { items, setItems, customers } = useLostAndFound();

  const addItem = (item: LostAndFoundItem) => {
    setItems([...items, item]);
    invoke("create_lost_item", {
      newName: item.name,
      newType: item.item_type,
      newColor: item.color,
      newLastSeen: item.last_seen_location,
      newOwner: item.owner,
      newStatus: "Missing",
    }).then((success) => {
      if (success) toast.success("Lost item has been reported successfully!");
    });
  };

  const handleAddItem = () => {
    console.log(newItem.owner);
    if (
      !newItem.name ||
      !newItem.item_type ||
      !newItem.color ||
      !newItem.owner
    ) {
      setErrors("Please fill in all required fields.");
      return;
    }
    setErrors("");

    addItem(newItem as LostAndFoundItem);
    setNewItem({
      item_id: "",
      name: "",
      item_type: "",
      color: "",
      last_seen_location: "",
      owner: "",
      status: "Missing",
    });
  };

  return (
    <div className="flex justify-center w-full max-w-2xl mx-auto px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 w-full border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Report Lost Item</h2>
        </div>

        {errors && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                placeholder="ex: Macbook"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Type *
              </label>
              <input
                type="text"
                placeholder="ex: Electronics, Jewelry"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={newItem.item_type}
                onChange={(e) =>
                  setNewItem({ ...newItem, item_type: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color *
              </label>
              <input
                type="text"
                placeholder="ex: Black, Silver"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={newItem.color}
                onChange={(e) =>
                  setNewItem({ ...newItem, color: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Seen Location
              </label>
              <input
                type="text"
                placeholder="ex: Main Lobby, Cafe"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={newItem.last_seen_location}
                onChange={(e) =>
                  setNewItem({ ...newItem, last_seen_location: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner *
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                value={newItem.owner}
                onChange={(e) =>
                  setNewItem({ ...newItem, owner: e.target.value })
                }
              >
                <option value="" disabled>
                  Select Owner
                </option>
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              onClick={handleAddItem}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Report Lost Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostAndFoundForm;
