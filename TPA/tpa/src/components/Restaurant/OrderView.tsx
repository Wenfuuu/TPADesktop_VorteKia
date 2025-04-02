import { useStaff } from "@/hooks/use-staff";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OrderList from "./OrderList";

export default function OrderView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const staff = useStaff();

  useEffect(() => {
    if (staff) {
      fetchOrders();
    }
  }, [staff])

  const fetchOrders = async () => {
    if(!staff) return;
    let orderData: Order[] = [];

    if(staff.role === "chef"){
        orderData = await invoke("get_assigned_orders", {
            staffid: staff.staff_id
        })
    }else{
        orderData = await invoke("get_all_orders");
    }

    setOrders(orderData);
  }

  const updateOrder = (order: Order, newStatus: string, chefid?: string) => {
    if(newStatus === "Cooking"){
        invoke("assign_order", {
          orderid: order.order_id,
          staffid: chefid,
        }).then((success) => {
            if (success) {
              toast("Order set to cooking!");
              fetchOrders();
            }
        }).catch((e) => {
            console.log(e);
            toast(e);
        });
    }else if(newStatus === "Ready to Serve"){
        invoke("mark_order_ready", {
            orderid: order.order_id
        }).then((success) => {
            if(success){
                toast("Order is ready to serve!");
                fetchOrders();
            }
        }).catch((e) => {
            console.log(e);
            toast(e);
        })
    }else{ // complete order
        invoke("complete_order", {
            orderid: order.order_id
        }).then((success) => {
            if(success){
                toast("Order is completed!");
                fetchOrders();
            }
        }).catch((e) => {
            console.log(e);
            toast(e);
        })
    }
  }

  return (
    <div className="container mx-auto px-6 text-white">
      <OrderList orders={orders} 
      onUpdate={updateOrder} 
      />
    </div>
  );
}
