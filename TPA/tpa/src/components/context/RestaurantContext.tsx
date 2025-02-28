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
        const restaurantData = await invoke("get_all_restaurants");
        if (restaurantData) setRestaurants(restaurantData as Restaurant[]);
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
