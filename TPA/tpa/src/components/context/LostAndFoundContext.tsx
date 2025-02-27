import { invoke } from "@tauri-apps/api/core";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface LostAndFoundContextType {
  items: LostAndFoundItem[];
  setItems: React.Dispatch<React.SetStateAction<LostAndFoundItem[]>>;
  customers: Customer[];
}

// Create the context
const LostAndFoundContext = createContext<LostAndFoundContextType | undefined>(undefined);

// Provider component
export const LostAndFoundProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<LostAndFoundItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const fetchData = async () => {
    const customerData = await invoke("get_all_customers");
    if (customerData) setCustomers(customerData as Customer[]);

    const itemData = await invoke("get_all_lost_items");
    if (itemData) setItems(itemData as LostAndFoundItem[]);

    items.map((item) =>{
        console.log(item)
    })
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <LostAndFoundContext.Provider value={{ items, setItems, customers }}>
      {children}
    </LostAndFoundContext.Provider>
  );
};

// Custom hook for using the context
export const useLostAndFound = () => {
  const context = useContext(LostAndFoundContext);
  if (!context) {
    throw new Error("useLostAndFound must be used within a LostAndFoundProvider");
  }
  return context;
};