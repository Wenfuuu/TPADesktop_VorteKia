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
  const [newCustomerName, setNewCustomerName] = useState<string>("");

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
      if (success) toast("Lost item has been created!");
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
      setErrors("There are empty form fields.");
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

  function createCustomer() {
    toast("creating customer");
    if (newCustomerName.trim() === "") return;
    invoke("create_customer", {
      newName: newCustomerName,
    }).then((success) => {
      if (success) {
        setNewCustomerName("");
      }
    });
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-5 mb-6">
      <h2 className="text-xl font-semibold mb-3">Report Lost Item</h2>
      {errors && <p className="text-red-500 text-sm mb-2">{errors}</p>}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Item Name"
          className="p-2 border rounded"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Type (e.g., Phone, Wallet)"
          className="p-2 border rounded"
          value={newItem.item_type}
          onChange={(e) =>
            setNewItem({ ...newItem, item_type: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Color"
          className="p-2 border rounded"
          value={newItem.color}
          onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Seen Location"
          className="p-2 border rounded"
          value={newItem.last_seen_location}
          onChange={(e) =>
            setNewItem({ ...newItem, last_seen_location: e.target.value })
          }
        />
        <select
          className="p-2 border rounded"
          value={newItem.owner}
          onChange={(e) => setNewItem({ ...newItem, owner: e.target.value })}
        >
          <option value="" disabled>
            Select Owner
          </option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          className="col-span-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddItem}
        >
          Report Item
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <h2>test create customer</h2>
        <input
          type="text"
          placeholder="new customer name"
          className="p-2 border rounded"
          value={newCustomerName}
          onChange={(e) => setNewCustomerName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={createCustomer}
        >
          create customer
        </button>
      </div>
    </div>
  );
};

export default LostAndFoundForm;
