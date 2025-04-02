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
