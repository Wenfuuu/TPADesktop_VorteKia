import { invoke } from "@tauri-apps/api/core";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface RestaurantContextType {
  restaurants: Restaurant[];
  setRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
}

// Create the context
const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

// Provider component
export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    const fetchData = async () => {
      const restaurantData: Restaurant[] = await invoke("get_all_restaurants");
      // if (restaurantData) setRestaurants(restaurantData as Restaurant[]);

      // Map over each restaurant to fetch its allocated staff
      const restaurantsWithStaff = await Promise.all(
        restaurantData.map(async (restaurant) => {
          // Fetch allocated staff for the current restaurant
          const allocatedStaff: Staff[] = await invoke(
            "get_allocated_staff_in_restaurant",
            { restaurantid: restaurant.restaurant_id }
          );

          // Return the restaurant object with its allocated staff
          return {
            ...restaurant,
            assigned_staff: allocatedStaff || [], // Ensure assigned_staff is always an array
          };
        })
      );

      // Update the state with the restaurants and their allocated staff
      setRestaurants(restaurantsWithStaff);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <RestaurantContext.Provider value={{ restaurants, setRestaurants }}>
        {children}
        </RestaurantContext.Provider>
    );
};

// Custom hook for using the context
export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
};
