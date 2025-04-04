import { useEffect, useState } from "react";
import RestaurantList from "./RestaurantList";
import UpdateRestaurantModal from "./UpdateRestaurantModal";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { useTime } from "../context/TimeContext";
import { useStaff } from "@/hooks/use-staff";
import { useCustomer } from "@/hooks/use-customer";
import { useDeviceId } from "@/hooks/use-device-id";
import RestaurantIncome from "./RestaurantIncome";

export default function RestaurantView() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(
    null
  );
  const [incomeRestaurant, setIncomeRestaurant] = useState<Restaurant | null>(null);  
  const { currentTime } = useTime();
  const [statusFilter, setStatusFilter] = useState("All");
  const staff = useStaff();
  const customer = useCustomer();
  const deviceId = useDeviceId();

  useEffect(() => {
    // console.log(deviceId);
    if(deviceId){
      fetchRestaurants();
    }
  }, [staff, customer, deviceId, statusFilter]);

  const filterRestaurant = (restaurants: Restaurant[]) => {
    if (statusFilter === "All") return restaurants;
    return restaurants.filter((restaurant) => restaurant.status === statusFilter);
  }

  const fetchRestaurants = async () => {
    let restaurantData: Restaurant[] = [];
    
    if(deviceId?.startsWith("RES")){
      restaurantData = await invoke("get_all_restaurants");
      const restaurant = restaurantData.find((r) => r.restaurant_id === deviceId);

      restaurantData = restaurant ? [restaurant] : [];
    }else if(deviceId?.startsWith("STAFF")){
      console.log("staff role is " + staff?.role);
      if (staff?.role === "f&b supervisor" || staff?.role === "customer service") {
        restaurantData = await invoke("get_all_restaurants");
      } else {
        setRestaurants([]);
        const assignedRestaurant: Restaurant = await invoke(
          "get_assigned_restaurant",
          {
            staffid: staff?.staff_id,
          }
        );

        restaurantData = assignedRestaurant ? [assignedRestaurant] : [];
      }
    }else{
      restaurantData = await invoke("get_all_restaurants");
    }

    console.log(restaurantData)
    setRestaurants(filterRestaurant(restaurantData));
  };

  useEffect(() => {
    restaurants.forEach(async (restaurant) => {
      // Parse opening and closing times (assumed format "HH:MM:SS")
      const [openHour, openMin, openSec] = restaurant.opening_hours
        .split(":")
        .map(Number);
      const [closeHour, closeMin, closeSec] = restaurant.closing_hours
        .split(":")
        .map(Number);

      const today = new Date(currentTime);
      const openTime = new Date(today);
      openTime.setHours(openHour, openMin, openSec, 0);

      const closeTime = new Date(today);
      closeTime.setHours(closeHour, closeMin, closeSec, 0);

      // Determine desired state
      const shouldBeOpen = currentTime >= openTime && currentTime < closeTime;
      const desiredStatus = shouldBeOpen ? "Open" : "Closed";

      if (
        restaurant.status === "Open" &&
        restaurant.assigned_staff?.length === 0
      ) {
        try {
          const success = await invoke("update_restaurant_status", {
            restaurantid: restaurant.restaurant_id,
            newstatus: "Closed",
          });
          if (success) {
            fetchRestaurants();
            toast(`restaurant ${restaurant.name} is now Closed`);
          }
        } catch (error) {
          console.error("Failed to update restaurant status:", error);
        }
      }

      // Only invoke backend if status is different.
      if (restaurant.status !== desiredStatus) {
        if (
          desiredStatus === "Open" &&
          (!restaurant.assigned_staff || restaurant.assigned_staff.length === 0)
        )
          return;
        try {
          const success = await invoke("update_restaurant_status", {
            restaurantid: restaurant.restaurant_id,
            newstatus: desiredStatus,
          });
          if (success) {
            // Optionally update local restaurant status:
            fetchRestaurants();
            if (desiredStatus === "Open")
              toast(`Restaurant ${restaurant.name} is now Open`);
            else toast(`Restaurant ${restaurant.name} is now Closed`);
          }
        } catch (error) {
          console.error("Failed to update restaurant status:", error);
        }
      }
    });
  }, [currentTime, restaurants]);

  // Handle menu addition
  const handleAddMenu = async (
    restaurantId: string,
    newMenu: Omit<Menu, "menu_id">
  ) => {
    try {
      // Call your Tauri function to add a menu
      await invoke("add_menu", {
        restaurantid: restaurantId,
        menuname: newMenu.name,
        menuprice: newMenu.price,
        menuimage: newMenu.image,
      });

      // Refresh the restaurant list to show the new menu
      fetchRestaurants();

      toast("Menu item added successfully");
    } catch (error) {
      console.error("Failed to add menu:", error);
      toast("Failed to add menu item");
    }
  };

  const handleUpdateMenu = async (
    menuId: string,
    updatedMenu: Partial<Menu>
  ) => {
    try {
      // Call your Tauri function to update a menu
      await invoke("update_menu", {
        menuid: menuId,
        menuname: updatedMenu.name,
        menuprice: updatedMenu.price,
        menuimage: updatedMenu.image,
      });

      // Refresh the restaurant list to show the updated menu
      fetchRestaurants();

      toast("Menu item updated successfully");
    } catch (error) {
      console.error("Failed to update menu:", error);
      toast("Failed to update menu item");
    }
  };

  // Handle menu removal
  const handleRemoveMenu = async (menuId: string) => {
    try {
      // Call your Tauri function to remove a menu
      await invoke("delete_menu", {
        menuid: menuId,
      });

      // Refresh the restaurant list to update the menu items
      fetchRestaurants();

      toast("Menu item removed successfully");
    } catch (error) {
      console.error("Failed to remove menu:", error);
      toast("Failed to remove menu item");
    }
  };

  const removeRestaurant = async (restaurantId: string) => {
    try {
      await invoke("delete_restaurant", {
        restaurantid: restaurantId,
      });

      fetchRestaurants();
      toast("Restaurant has been removed!");
    } catch (error) {
      console.error("Failed to remove restaurant:", error);
      toast("Failed to remove restaurant");
    }
  };

  const updateRestaurant = (updatedRestaurant: Restaurant) => {
    setRestaurants((prevRestaurants) =>
      prevRestaurants.map((restaurant) =>
        restaurant.restaurant_id === updatedRestaurant.restaurant_id
          ? updatedRestaurant
          : restaurant
      )
    );

    //invoke backend
    // console.log(updatedRestaurant);
    invoke("update_restaurant", {
      id: updatedRestaurant.restaurant_id,
      newName: updatedRestaurant.name,
      newCuisineType: updatedRestaurant.cuisine_type,
      newOpeningHours: updatedRestaurant.opening_hours,
      newClosingHours: updatedRestaurant.closing_hours,
      newStatus: updatedRestaurant.status,
      newimagedata: updatedRestaurant.image,
    }).then((success) => {
      if (success) toast("Restaurant has been updated!");
    });

    //invoke backend for staff allocation if exists
    if (
      updatedRestaurant.assigned_staff &&
      updatedRestaurant.assigned_staff.length > 0
    ) {
      invoke("allocate_restaurant_staff", {
        restaurantId: updatedRestaurant.restaurant_id,
        staffIds: updatedRestaurant.assigned_staff.map(
          (staff) => staff.staff_id
        ),
      }).then((success) => {
        if (success) toast("Staff has been allocated!");
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Filter controls */}
      {/* Improved Filter UI */}
      {staff?.role === "f&b supervisor" && (
        <div className="mb-6 bg-white rounded-lg shadow-md p-4 mx-auto flex flex-col justify-center items-center max-w-2xl gap">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Filter Restaurants
          </h2>
          <div className="flex items-center">
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm flex items-center cursor-pointer ${
                  statusFilter === "All"
                    ? "bg-blue-100 text-blue-700 ring-2 ring-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setStatusFilter("All")}
              >
                All Restaurants
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm flex items-center cursor-pointer ${
                  statusFilter === "Open"
                    ? "bg-green-100 text-green-700 ring-2 ring-green-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setStatusFilter("Open")}
              >
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Open
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm flex items-center cursor-pointer ${
                  statusFilter === "Closed"
                    ? "bg-red-100 text-red-700 ring-2 ring-red-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setStatusFilter("Closed")}
              >
                <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                Closed
              </button>

              <div className="flex items-center text-sm text-gray-500">
                Showing {restaurants.length} of {restaurants.length} restaurants
              </div>
            </div>
          </div>
        </div>
      )}

      <RestaurantList
        restaurants={restaurants}
        onEdit={setEditingRestaurant}
        onRemove={removeRestaurant}
        onAddMenu={handleAddMenu}
        onUpdateMenu={handleUpdateMenu}
        onRemoveMenu={handleRemoveMenu}
        onIncome={setIncomeRestaurant}
      />

      {editingRestaurant && (
        <UpdateRestaurantModal
          allRestaurants={restaurants}
          editRestaurant={editingRestaurant}
          onUpdate={updateRestaurant}
          onClose={() => setEditingRestaurant(null)}
          open={true}
        />
      )}

      {incomeRestaurant && (
        <RestaurantIncome 
        restaurantId={incomeRestaurant.restaurant_id} />
      )}

    </div>
  );
}
