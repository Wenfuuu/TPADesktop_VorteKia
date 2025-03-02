import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import AddSouvenirDialog from "./AddSouvenirDialog";
import { invoke } from "@tauri-apps/api/core";
import EditSouvenirDialog from "./EditSouvenirDialog"; // Assuming you have this component

type Props = {
  stores: Store[];
  onEdit: (store: Store) => void;
  onAddSouvenir: (
    storeId: string,
    souvenir: Omit<Souvenir, "souvenir_id">
  ) => void;
  onUpdateSouvenir?: (
    souvenirId: string,
    updatedSouvenir: Partial<Souvenir>
  ) => void;
  onRemoveSouvenir?: (souvenirId: string, storeId: string) => void;
};

export default function StoreList({
  stores,
  onEdit,
  onAddSouvenir,
  onUpdateSouvenir,
  onRemoveSouvenir,
}: Props) {
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [souvenirs, setSouvenirs] = useState<{ [key: string]: Souvenir[] }>({});
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  const fetchSouvenirs = async (storeId: string) => {
    // Skip if already loading this store's souvenirs
    if (isLoading[storeId]) return;

    // Set loading state for this store
    setIsLoading((prev) => ({ ...prev, [storeId]: true }));

    try {
      const fetchedSouvenirs: Souvenir[] = await invoke(
        "get_souvenirs_by_store",
        {
          storeid: storeId,
        }
      );
      console.log(`Fetched souvenirs for ${storeId}:`, fetchedSouvenirs);

      // Update souvenirs state for this store
      setSouvenirs((prevSouvenirs) => ({
        ...prevSouvenirs,
        [storeId]: fetchedSouvenirs,
      }));

      // Process souvenir images
      const newImageUrls: { [key: string]: string } = {};
      fetchedSouvenirs.forEach((souvenir) => {
        if (souvenir.image) {
          const imageUrl = URL.createObjectURL(
            new Blob([new Uint8Array(souvenir.image)], { type: "image/png" })
          );
          newImageUrls[souvenir.souvenir_id] = imageUrl;
        }
      });

      // Update image URLs state
      setImageUrls((prevUrls) => ({
        ...prevUrls,
        ...newImageUrls,
      }));
    } catch (error) {
      console.error(`Failed to fetch souvenirs for ${storeId}:`, error);
    } finally {
      // Clear loading state
      setIsLoading((prev) => ({ ...prev, [storeId]: false }));
    }
  };

  const handleUpdateSouvenir = (
    souvenirId: string,
    updatedSouvenir: Partial<Souvenir>
  ) => {
    if (onUpdateSouvenir) {
      onUpdateSouvenir(souvenirId, updatedSouvenir);
    }
  };

  useEffect(() => {
    // Process store images
    const newImageUrls: { [key: string]: string } = {};

    stores.forEach((store) => {
      if (store.image) {
        const imageUrl = URL.createObjectURL(
          new Blob([new Uint8Array(store.image)], {
            type: "image/png",
          })
        );
        newImageUrls[store.store_id] = imageUrl;
      }

      // Fetch souvenirs for each store
      fetchSouvenirs(store.store_id);
    });

    // Update image URLs with store images
    setImageUrls((prevUrls) => ({
      ...prevUrls,
      ...newImageUrls,
    }));

    // Cleanup function for image URLs
    return () => {
      Object.values(imageUrls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [stores]); // Only re-run when stores change

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-6xl mx-auto">
      {stores.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-2">No store available.</p>
          <p className="text-sm text-gray-400">Add a store to get started</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {stores.map((store) => {
            const imageUrl = imageUrls[store.store_id];
            const storeSouvenirs = souvenirs[store.store_id] || [];
            const isSouvenirLoading = isLoading[store.store_id];

            return (
              <li
                key={store.store_id}
                className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 flex-col bg-gray-50"
              >
                <div className="flex justify-between items-center gap-6">
                  <div className="w-40 h-28 flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={store.name}
                        className="w-full h-full object-cover rounded-lg border shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-lg">{store.name}</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Hours:</span>{" "}
                      {store.opening_hours} - {store.closing_hours}
                    </p>
                    <p
                      className={`text-white rounded-full px-3 py-1 mt-2 text-xs font-medium inline-block ${
                        store.status === "Open" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {store.status}
                    </p>
                  </div>

                  <Button
                    onClick={() => onEdit(store)}
                    className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>

                <div className="mt-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold text-gray-800">
                      Souvenir Products
                    </h2>
                    <AddSouvenirDialog
                      storeId={store.store_id}
                      onAddSouvenir={(souvenir) =>
                        onAddSouvenir(store.store_id, souvenir)
                      }
                    />
                  </div>

                  {isSouvenirLoading ? (
                    <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg">
                      <p className="text-gray-500">Loading souvenirs...</p>
                    </div>
                  ) : storeSouvenirs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {storeSouvenirs.map((souvenir) => (
                        <div
                          key={souvenir.souvenir_id}
                          className="flex items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:border-gray-300"
                        >
                          {imageUrls[souvenir.souvenir_id] ? (
                            <img
                              src={imageUrls[souvenir.souvenir_id]}
                              alt={souvenir.name}
                              className="w-16 h-16 object-cover rounded-lg border mr-3"
                            />
                          ) : (
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg border mr-3">
                              <span className="text-gray-500 text-xs">
                                No Image
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {souvenir.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Rp{souvenir.price.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {onUpdateSouvenir && (
                              <EditSouvenirDialog
                                souvenir={souvenir}
                                onUpdateSouvenir={(
                                  souvenirId,
                                  updatedSouvenir
                                ) =>
                                  handleUpdateSouvenir(
                                    souvenirId,
                                    updatedSouvenir
                                  )
                                }
                              />
                            )}
                            {onRemoveSouvenir && (
                              <Button
                                onClick={() =>
                                  onRemoveSouvenir(
                                    souvenir.souvenir_id,
                                    store.store_id
                                  )
                                }
                                variant="destructive"
                                size="sm"
                                className="ml-2 h-8 w-8 p-0 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete souvenir</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-24 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                      <p className="text-gray-500 text-sm mb-1">
                        No souvenir products available
                      </p>
                      <p className="text-xs text-gray-400">
                        Click 'Add Souvenir' to add a product
                      </p>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
