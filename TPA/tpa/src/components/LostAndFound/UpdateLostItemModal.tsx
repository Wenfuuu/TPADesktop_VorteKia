import { useEffect, useState } from "react";
import ImageUpload from "../ImageUpload";

type Props = {
  customers: Customer[];
  item: LostAndFoundItem;
  onUpdate: (updatedItem: LostAndFoundItem) => void;
  onClose: () => void;
};

export default function UpdateItemModal({
  customers,
  item,
  onUpdate,
  onClose,
}: Props) {
  if (!item) return null;
  const [updatedItem, setUpdatedItem] = useState<LostAndFoundItem>({ ...item });
  const [itemStatus, setItemStatus] = useState<ItemStatus>(updatedItem.status);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    if (itemStatus !== "Missing") {
      setUpdatedItem((prev) => ({
        ...prev,
        finder: "",
        found_location: "",
      }));
    }
  }, [itemStatus]);

  function handleUpdate() {
    //check error
    if (itemStatus === "Missing") {
      if (
        !updatedItem.name ||
        !updatedItem.item_type ||
        !updatedItem.color ||
        !updatedItem.last_seen_location ||
        !updatedItem.owner
      ) {
        setErrors("There are empty form fields.");
        return;
      }
    } else {
      if (
        !updatedItem.name ||
        !updatedItem.item_type ||
        !updatedItem.color ||
        !updatedItem.last_seen_location ||
        !updatedItem.owner ||
        !updatedItem.found_location ||
        !updatedItem.finder
      ) {
        setErrors("There are empty form fields.");
        return;
      }
    }

    if (itemStatus === "Missing") {
      setUpdatedItem({ ...updatedItem, finder: "" });
      setUpdatedItem({ ...updatedItem, found_location: "" });
    }
    setErrors("");
    onUpdate(updatedItem);
    onClose();
  }

  return (
    <div>
      <div className="fixed inset-0 bg-white opacity-50 z-10"></div>
      <div
        className="fixed inset-0 flex items-center justify-center z-20"
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Update Item
          </h2>
          {errors && <div className="text-red-500 text-sm mt-2">{errors}</div>}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <h2>Item Name</h2>
              <input
                type="text"
                className="p-2 border rounded w-full"
                value={updatedItem.name}
                onChange={(e) =>
                  setUpdatedItem({ ...updatedItem, name: e.target.value })
                }
              />
            </div>

            <div>
              <h2>Type</h2>
              <input
                type="text"
                className="p-2 border rounded w-full"
                value={updatedItem.item_type}
                onChange={(e) =>
                  setUpdatedItem({ ...updatedItem, item_type: e.target.value })
                }
              />
            </div>

            <div>
              <h2>Color</h2>
              <input
                type="text"
                className="p-2 border rounded w-full"
                value={updatedItem.color}
                onChange={(e) =>
                  setUpdatedItem({ ...updatedItem, color: e.target.value })
                }
              />
            </div>

            <div>
              <h2>Last Seen Location</h2>
              <input
                type="text"
                className="p-2 border rounded w-full"
                value={updatedItem.last_seen_location}
                onChange={(e) =>
                  setUpdatedItem({
                    ...updatedItem,
                    last_seen_location: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <h2>Owner</h2>
              <select
                className="p-2 border rounded w-full"
                value={updatedItem.owner}
                onChange={(e) =>
                  setUpdatedItem({ ...updatedItem, owner: e.target.value })
                }
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
            </div>

            <div>
              <h2>Status</h2>
              <select
                className="p-2 border rounded w-full"
                value={updatedItem.status}
                onChange={(e) => {
                  if (
                    ["Missing", "Found", "Returned to Owner"].includes(
                      e.target.value
                    )
                  ) {
                    setItemStatus(e.target.value as ItemStatus);
                    setUpdatedItem({
                      ...updatedItem,
                      status: e.target.value as ItemStatus,
                    });
                  }
                }}
              >
                <option value="Missing">Missing</option>
                <option value="Found">Found</option>
                <option value="Returned to Owner">Returned to Owner</option>
              </select>
            </div>

            <div>
              <h2>Finder</h2>
              <select
                className={`p-2 border rounded w-full ${
                  itemStatus === "Missing"
                    ? "bg-gray-200 cursor-not-allowed"
                    : ""
                }`}
                value={updatedItem.finder}
                onChange={(e) =>
                  setUpdatedItem({ ...updatedItem, finder: e.target.value })
                }
                disabled={itemStatus === "Missing"}
              >
                <option value="">Not found yet!</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h2>Found Location</h2>
              <input
                type="text"
                className={`p-2 border rounded w-full ${
                  itemStatus === "Missing"
                    ? "bg-gray-200 cursor-not-allowed"
                    : ""
                }`}
                value={updatedItem.found_location}
                onChange={(e) =>
                  setUpdatedItem({
                    ...updatedItem,
                    found_location: e.target.value,
                  })
                }
                disabled={itemStatus === "Missing"}
              />
            </div>
          </div>

          {/* <ImageUpload/> */}
          {/* <ImageUpload image={updatedItem.image} setImage={setImage} /> */}
          <ImageUpload
            image={updatedItem.image}
            onImageUpload={(binaryImage) =>
              setUpdatedItem({ ...updatedItem, image: binaryImage })
            }
          />

          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            onClick={handleUpdate}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
