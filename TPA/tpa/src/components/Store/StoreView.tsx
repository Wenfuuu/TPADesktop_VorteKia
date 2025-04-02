import { useEffect, useState } from "react";
import StoreList from "./StoreList";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import EditStoreDialog from "./EditStoreDialog";
import RemoveStoreDialog from "./RemoveStoreDialog";
import { useTime } from "../context/TimeContext";
import { useStaff } from "@/hooks/use-staff";

export default function StoreView() {
    const [stores, setStores] = useState<Store[]>([]);
    const [editingStore, setEditingStore] = useState<Store | null>(null);
    const [removingStore, setRemovingStore] = useState<Store | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const staff = useStaff();
    const {currentTime} = useTime();

    useEffect(() => {
        if (staff !== undefined) fetchStores();
    }, [staff]);

    useEffect(() => {
        stores.forEach(async (store) => {
          // Parse opening and closing times (assumed format "HH:MM:SS")
          const [openHour, openMin, openSec] = store.opening_hours
            .split(":")
            .map(Number);
          const [closeHour, closeMin, closeSec] = store.closing_hours
            .split(":")
            .map(Number);

          const today = new Date(currentTime);
          const openTime = new Date(today);
          openTime.setHours(openHour, openMin, openSec, 0);

          const closeTime = new Date(today);
          closeTime.setHours(closeHour, closeMin, closeSec, 0);

          // Determine desired state
          const shouldBeOpen =
            currentTime >= openTime && currentTime < closeTime;
          const desiredStatus = shouldBeOpen ? "Open" : "Closed";

          if (store.status === "Open" && store.assigned_staff?.length === 0) {
            try {
              const success = await invoke("update_store_status", {
                storeid: store.store_id,
                newstatus: "Closed",
              });
              if (success) {
                fetchStores();
                toast(`Store ${store.name} is now Closed`);
              }
            } catch (error) {
              console.error("Failed to update store status:", error);
            }
          }

          // Only invoke backend if status is different.
          if (store.status !== desiredStatus) {
            if (desiredStatus === "Open" && store.assigned_staff?.length === 0)
              return;
            try {
              const success = await invoke("update_store_status", {
                storeid: store.store_id,
                newstatus: desiredStatus,
              });
              if (success) {
                fetchStores();
                if (desiredStatus === "Open")
                  toast(`Store ${store.name} is now Open`);
                else toast(`Store ${store.name} is now Closed`);
              }
            } catch (error) {
              console.error("Failed to update store status:", error);
            }
          }
        });
    }, [currentTime, stores]);

    const fetchStores = async () => {
      setIsLoading(true);
      try {
        let storeData: Store[] = [];
        console.log("staff role is " + staff?.role);
        
        if (staff?.role === "sales associate" && staff?.staff_id) {
          const assignedStore: Store = await invoke("get_assigned_store", {
            staffid: staff.staff_id,
          });

          storeData = assignedStore ? [assignedStore] : [];
        } else {
          storeData = await invoke("get_all_stores");
        }

        console.log(storeData);
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
        );

        setStores(storeWithStaff);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
        toast("Failed to load store data");
      } finally {
        setIsLoading(false);
      }
    };

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
      if (!staff?.staff_id) {
        toast("Cannot propose store removal: staff information unavailable");
        return;
      }
      
      // invoke backend
      invoke("propose_store_removal", {
        storeid: store.store_id,
        staffid: staff.staff_id,
        removereason: reason,
      }).then((success) => {
        if (success) toast("Store removal has been proposed!");
      }).catch(e => {
        console.log(e);
        toast("Failed to propose store removal");
      });
    }

    return (
      <div className="container mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading stores...</p>
          </div>
        ) : (
          <StoreList 
            stores={stores}
            onEdit={setEditingStore}
            onRemove={setRemovingStore}
            onAddSouvenir={handleAddSouvernir}
            onUpdateSouvenir={handleUpdateSouvenir}
            onRemoveSouvenir={handleRemoveSouvenir}
          />
        )}
        
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