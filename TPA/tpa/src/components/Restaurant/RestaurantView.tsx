import { useState } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import RestaurantList from "./RestaurantList";

export default function RestaurantView(){
    const {restaurants} = useRestaurant()
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

    return (
      <div className="container mx-auto p-6">
        <RestaurantList restaurants={restaurants} onEdit={setEditingRestaurant} />
        
      </div>
    );
}