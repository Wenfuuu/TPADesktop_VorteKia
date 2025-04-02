import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export function useCustomer(){
    const [customer, setCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        const getCustomer = async () => {
            try {
                const response = await invoke("get_current_customer");
                if (response !== null) {
                    setCustomer(response as Customer);
                }
            } catch (error) {
                console.error("Failed to fetch customer:", error);
            }
        };

        getCustomer();
    }, []);

    return customer;
}