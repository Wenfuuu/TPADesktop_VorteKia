import { useEffect, useState } from "react";
import ImageUpload from "../ImageUpload";
import { invoke } from "@tauri-apps/api/core";

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
    assigned_staff: Array.isArray(restaurant.assigned_staff)
      ? [...restaurant.assigned_staff]
      : [], // Safely handle non-array values
  });
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [errors, setErrors] = useState("");

  async function fetchStaff() {
    try {
      const fetchedStaff: Staff[] = await invoke("get_all_staffs");
      setAllStaff(fetchedStaff);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    }
  }

  useEffect(() => {
    console.log(restaurant)
    fetchStaff();
  }, [restaurant]);

  // Toggle staff selection
  function toggleStaffSelection(staff: Staff) {
    setUpdatedRestaurant((prev) => {
      const currentAssignedStaff = Array.isArray(prev.assigned_staff)
        ? prev.assigned_staff
        : [];

      // Check if staff is already assigned by comparing staff_id
      const isStaffAssigned = currentAssignedStaff.some(
        (assignedStaff) => assignedStaff.staff_id === staff.staff_id
      );

      if (isStaffAssigned) {
        // If staff is already assigned, remove them
        return {
          ...prev,
          assigned_staff: currentAssignedStaff.filter(
            (assignedStaff) => assignedStaff.staff_id !== staff.staff_id
          ),
        };
      } else {
        // If staff is not assigned, add them
        return {
          ...prev,
          assigned_staff: [...currentAssignedStaff, staff],
        };
      }
    });
  }

  // Check if a staff member is currently assigned
  function isStaffAssigned(staffId: string): boolean {
    return (
      Array.isArray(updatedRestaurant.assigned_staff) &&
      updatedRestaurant.assigned_staff.some(
        (staff) => staff.staff_id === staffId
      )
    );
  }

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
                value={
                  updatedRestaurant.opening_hours
                    ? updatedRestaurant.opening_hours.slice(0, 5)
                    : ""
                } // Handle null/undefined
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
                value={
                  updatedRestaurant.closing_hours
                    ? updatedRestaurant.closing_hours.slice(0, 5)
                    : ""
                } // Handle null/undefined
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

          {/* Staff Allocation Section */}
          <div className="w-full mb-4">
            <h2 className="font-semibold mb-2">Assign Staff</h2>
            <div className="border rounded p-4 max-h-60 overflow-y-auto">
              {allStaff.length === 0 ? (
                <p className="text-gray-500">Loading staff...</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {allStaff.map((staff) => (
                    <div key={staff.staff_id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${staff.staff_id}`}
                        checked={isStaffAssigned(staff.staff_id)}
                        onChange={() => toggleStaffSelection(staff)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`${staff.staff_id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <span className="font-medium">{staff.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({staff.role})
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
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
