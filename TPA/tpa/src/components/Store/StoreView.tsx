import { useEffect, useState } from "react";
import StoreList from "./StoreList";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

export default function StoreView() {
    const [stores, setStores] = useState<Store[]>([]);
    const [editingStore, setEditingStore] = useState<Store | null>(null);

    useEffect(() =>{
        fetchStores();
    }, [])

    const fetchStores = async () => {
        const storeData: Store[] = await invoke("get_all_stores");
        setStores(storeData);
    }

    const handleAddSouvernir = async (storeId: string, newSouvenir: Omit<Souvenir, "souvenir_id">) => {
        try {
            await invoke("add_souvenir", {
                storeid: storeId,
                souvenirname: newSouvenir.name,
                souvenirprice: newSouvenir.price,
                souvenirimage: newSouvenir.image,
            });

            fetchStores();
            toast("Souvenir item added successfully");
        } catch (error) {
            console.error("Failed to add souvenir:", error);
            toast("Failed to add souvenir item");
        }
    }

    const handleUpdateSouvenir = async (souvenirId: string, updatedSouvenir: Partial<Souvenir>) => {
        try {
            await invoke("update_souvenir", {
                souvenirid: souvenirId,
                souvenirname: updatedSouvenir.name,
                souvenirprice: updatedSouvenir.price,
                souvenirimage: updatedSouvenir.image,
            });

            fetchStores();
            toast("Souvenir item updated successfully");
        } catch (error) {
            console.error("Failed to update souvenir:", error);
            toast("Failed to update souvenir item");
        }
    }

    const handleRemoveSouvenir = async (souvenirId: string) => {
        try {
            await invoke("delete_souvenir", {
                souvenirid: souvenirId,
            });

            fetchStores();
            toast("Souvenir item removed successfully");
        } catch (error) {
            console.error("Failed to remove souvenir:", error);
            toast("Failed to remove souvenir item");
        }
    }

    return (
      <div className="container mx-auto p-6">
        <StoreList 
        stores={stores}
        onEdit={setEditingStore}
        onAddSouvenir={handleAddSouvernir}
        onUpdateSouvenir={handleUpdateSouvenir}
        onRemoveSouvenir={handleRemoveSouvenir}/>
        {/* Edit Store Dialog */}
        
      </div>
    );
}