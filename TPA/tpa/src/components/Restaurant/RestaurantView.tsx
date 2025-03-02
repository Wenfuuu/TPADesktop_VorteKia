import { useEffect, useState } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import RestaurantList from "./RestaurantList";
import UpdateRestaurantModal from "./UpdateRestaurantModal";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

export default function RestaurantView() {
  const { restaurants, setRestaurants } = useRestaurant();
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(
    null
  );

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    const restaurantData: Restaurant[] = await invoke("get_all_restaurants");
    setRestaurants(restaurantData);
  }

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
      <RestaurantList 
      restaurants={restaurants} 
      onEdit={setEditingRestaurant} 
      onAddMenu={handleAddMenu}
      onUpdateMenu={handleUpdateMenu}
      onRemoveMenu={handleRemoveMenu}/>
      {editingRestaurant && (
        <UpdateRestaurantModal
          restaurant={editingRestaurant}
          onUpdate={updateRestaurant}
          onClose={() => setEditingRestaurant(null)}
          open={true}
        />
      )}
    </div>
  );
}
