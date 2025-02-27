import { useState } from "react";
import { useLostAndFound } from "./context/LostAndFoundContext";
import LostAndFoundList from "./LostAndFoundList";
import UpdateItemModal from "./UpdateLostItemModal";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";


export default function LostAndFoundView() {
    const { items, setItems, customers } = useLostAndFound();
    const [editingItem, setEditingItem] = useState<LostAndFoundItem | null>(null);

    const updateItem = (updatedItem: LostAndFoundItem) => {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.item_id === updatedItem.item_id ? updatedItem : item
        )
      );

      invoke("update_lost_item", {
        id: updatedItem.item_id,
        newName: updatedItem.name,
        newItemType: updatedItem.item_type,
        newColor: updatedItem.color,
        newLastSeen: updatedItem.last_seen_location,
        newFoundLocation: updatedItem.found_location,
        newFinder: updatedItem.finder,
        newOwner: updatedItem.owner,
        newStatus: updatedItem.status,
      }).then((success) => {
        if (success) toast("Lost item has been updated!");
      });
    };

    return (
        <div className="container mx-auto p-6">
        <LostAndFoundList items={items} onEdit={setEditingItem} />
        {editingItem && (
            <UpdateItemModal
            customers={customers}
            item={editingItem}
            onUpdate={updateItem}
            onClose={() => setEditingItem(null)}
            />
        )}
        </div>
    );
}
