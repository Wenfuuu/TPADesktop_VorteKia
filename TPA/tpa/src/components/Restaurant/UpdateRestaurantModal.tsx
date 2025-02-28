import { useState } from "react";
import ImageUpload from "../ImageUpload";

type Props = {
  restaurant: Restaurant;
  onUpdate: (restaurant: Restaurant) => void;
  onClose: () => void;
};

export default function UpdateRestaurantModal({
  restaurant,
  onUpdate,
  onClose,
}: Props) {
  if (!restaurant) return null;
  const [updatedRestaurant, setUpdatedRestaurant] = useState<Restaurant>({
    ...restaurant,
  });
  const [errors, setErrors] = useState("");

  function handleUpdate() {
    // Check for errors
    if (
      !updatedRestaurant.name ||
      !updatedRestaurant.cuisine_type ||
      !updatedRestaurant.opening_hours ||
      !updatedRestaurant.closing_hours ||
      !updatedRestaurant.status
    ) {
      setErrors("There are empty form fields.");
      return;
    }

    setErrors("");
    onUpdate(updatedRestaurant);
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
            Update Restaurant
          </h2>
          {errors && <div className="text-red-500 text-sm mt-2">{errors}</div>}
          <div className="grid grid-cols-2 gap-4 mb-4 w-full">
            <div>
              <h2>Restaurant Name</h2>
              <input
                type="text"
                className="p-2 border rounded w-full"
                value={updatedRestaurant.name}
                onChange={(e) =>
                  setUpdatedRestaurant({
                    ...updatedRestaurant,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <h2>Cuisine Type</h2>
              <input
                type="text"
                className="p-2 border rounded w-full"
                value={updatedRestaurant.cuisine_type}
                onChange={(e) =>
                  setUpdatedRestaurant({
                    ...updatedRestaurant,
                    cuisine_type: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <h2>Opening Hours</h2>
              <input
                type="time"
                className="p-2 border rounded w-full"
                value={updatedRestaurant.opening_hours}
                onChange={(e) =>
                  setUpdatedRestaurant({
                    ...updatedRestaurant,
                    opening_hours: e.target.value + ":00",
                  })
                }
              />
            </div>

            <div>
              <h2>Closing Hours</h2>
              <input
                type="time"
                className="p-2 border rounded w-full"
                value={updatedRestaurant.closing_hours}
                onChange={(e) =>
                  setUpdatedRestaurant({
                    ...updatedRestaurant,
                    closing_hours: e.target.value + ":00",
                  })
                }
              />
            </div>

            <div>
              <h2>Status</h2>
              <select
                className="p-2 border rounded w-full"
                value={updatedRestaurant.status}
                onChange={(e) =>
                  setUpdatedRestaurant({
                    ...updatedRestaurant,
                    status: e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <ImageUpload
            image={updatedRestaurant.image}
            onImageUpload={(binaryImage) =>
              setUpdatedRestaurant({ ...updatedRestaurant, image: binaryImage })
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
