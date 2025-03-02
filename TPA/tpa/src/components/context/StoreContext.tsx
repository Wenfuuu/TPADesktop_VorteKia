import { invoke } from "@tauri-apps/api/core";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface StoreContextType {
  stores: Store[];
  setStores: React.Dispatch<React.SetStateAction<Store[]>>;
}

// Create the context
const StoreContext = createContext<StoreContextType | undefined>(
  undefined
);

// Provider component
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [stores, setStores] = useState<Store[]>([]);

  const fetchData = async () => {
    const storeData: Store[] = await invoke("get_all_stores");
    // if (restaurantData) setRestaurants(restaurantData as Restaurant[]);

    // Map over each restaurant to fetch its allocated staff
    // const restaurantsWithStaff = await Promise.all(
    //   restaurantData.map(async (restaurant) => {
    //     // Fetch allocated staff for the current restaurant
    //     const allocatedStaff: Staff[] = await invoke(
    //       "get_allocated_staff_in_restaurant",
    //       { restaurantid: restaurant.restaurant_id }
    //     );

    //     // Return the restaurant object with its allocated staff
    //     return {
    //       ...restaurant,
    //       assigned_staff: allocatedStaff || [], // Ensure assigned_staff is always an array
    //     };
    //   })
    // );

    // Update the state with the restaurants and their allocated staff
    setStores(storeData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <StoreContext.Provider value={{ stores, setStores }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook for using the context
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a RestaurantProvider");
  }
  return context;
};
