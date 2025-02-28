import { useState } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import RestaurantList from "./RestaurantList";
import UpdateRestaurantModal from "./UpdateRestaurantModal";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

export default function RestaurantView(){
    const {restaurants, setRestaurants} = useRestaurant()
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

    const updateRestaurant = (updatedRestaurant: Restaurant) => {
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((restaurant) =>
            restaurant.restaurant_id === updatedRestaurant.restaurant_id ? updatedRestaurant : restaurant
          )
        );

        //invoke backend
        console.log(updatedRestaurant)
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
    }

    return (
      <div className="container mx-auto p-6">
        <RestaurantList restaurants={restaurants} onEdit={setEditingRestaurant} />
        {editingRestaurant && (
          <UpdateRestaurantModal
            restaurant={editingRestaurant}
            onUpdate={updateRestaurant}
            onClose={() => setEditingRestaurant(null)}
          />
        )}
      </div>
    );
}