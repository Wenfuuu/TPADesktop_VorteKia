import { useEffect, useState } from "react";
import StoreList from "./StoreList";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import EditStoreDialog from "./EditStoreDialog";
import RemoveStoreDialog from "./RemoveStoreDialog";

export default function StoreView() {
    const [stores, setStores] = useState<Store[]>([]);
    const [editingStore, setEditingStore] = useState<Store | null>(null);
    const [removingStore, setRemovingStore] = useState<Store | null>(null);
    const [staff, setStaff] = useState<Staff | null>(null);

    useEffect(() =>{
        fetchStores();
        get_staff();
    }, [])

    const get_staff = async () => {
      const response = await invoke("get_current_staff");
      if (response !== null) {
        setStaff(response as Staff);
      }
    }

    const fetchStores = async () => {
        const storeData: Store[] = await invoke("get_all_stores");

        const storeWithStaff = await Promise.all(
            storeData.map(async (store) => {
                const allocatedStaff: Staff[] = await invoke(
                    "get_allocated_staff_in_store",
                    { storeid: store.store_id }
                );

                return {
                    ...store,
                    assigned_staff: allocatedStaff || [],
                };
            })
        )

        setStores(storeWithStaff);
    }

    const handleAddSouvernir = async (storeId: string, newSouvenir: Omit<Souvenir, "souvenir_id">) => {
        try {
            await invoke("add_souvenir", {
                storeid: storeId,
                souvenirname: newSouvenir.name,
                souvenirdesc: newSouvenir.description,
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
                souvenirdesc: updatedSouvenir.description,
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

    const updateStore = (updatedStore: Store) => {
      setStores((prevStores) =>
        prevStores.map((store) =>
          store.store_id === updatedStore.store_id ? updatedStore : store
        )
      );

      invoke("update_store", {
        id: updatedStore.store_id,
        newName: updatedStore.name,
        newOpeningHours: updatedStore.opening_hours,
        newClosingHours: updatedStore.closing_hours,
        newStatus: updatedStore.status,
        newimagedata: updatedStore.image,
      }).then((success) => {
        if (success) toast("Store has been updated!");
      });

      //invoke backend for staff allocation if exists
      if (
        updatedStore.assigned_staff &&
        updatedStore.assigned_staff.length > 0
      ) {
        invoke("allocate_store_staff", {
            storeId: updatedStore.store_id,
            staffIds: updatedStore.assigned_staff.map(
              (staff) => staff.staff_id
            ),
        }).then((success) => {
          if (success) toast("Staff has been allocated!");
        });
      }
    }

    const proposeRemoveStore = (store: Store, reason: string) => {
      // invoke backend
      invoke("propose_store_removal", {
        storeid: store.store_id,
        staffid: staff?.staff_id,
        removereason: reason,
      }).then((success) => {
        if (success) toast("Store removal has been proposed!");
      }).catch(e =>{
        console.log(e);
        toast("Failed to propose store removal");
      })
    }

    return (
      <div className="container mx-auto p-6">
        <StoreList 
        stores={stores}
        onEdit={setEditingStore}
        onRemove={setRemovingStore}
        onAddSouvenir={handleAddSouvernir}
        onUpdateSouvenir={handleUpdateSouvenir}
        onRemoveSouvenir={handleRemoveSouvenir}/>
        {/* Edit Store Dialog */}
        {editingStore && (
            <EditStoreDialog
                store={editingStore}
                onUpdateStore={updateStore}
                onClose={() => setEditingStore(null)}
                open={true}
            />
        )}

        {removingStore && (
            <RemoveStoreDialog
                store={removingStore}
                onRemoveStore={proposeRemoveStore}
                onClose={() => setRemovingStore(null)}
                open={true}
            />
        )}
      </div>
    );
}