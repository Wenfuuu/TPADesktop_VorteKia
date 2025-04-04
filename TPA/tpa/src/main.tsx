import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router";
import LostAndFoundUI from "./ui/LostAndFoundUI";
import LostAndFoundForm from "./components/LostAndFound/LostAndFoundForm";
import { LostAndFoundProvider } from "./components/context/LostAndFoundContext";
import LostAndFoundView from "./components/LostAndFound/LostAndFoundView";
import { Toaster } from "sonner";
import ChatBox from "./components/Chatbox";
import RestaurantView from "./components/Restaurant/RestaurantView";
import StoreView from "./components/Store/StoreView";
import StaffRestaurantUI from "./ui/StaffRestaurantUI";
import StaffStoreUI from "./ui/StaffStoreUI";
import StaffRideUI from "./ui/StaffRideUI";
import RideView from "./components/Ride/RideView";
import ProposeRideDialog from "./components/Ride/ProposeRideDialog";
import MaintenanceUI from "./ui/MaintenanceUI";
import ReportView from "./components/Maintenance/ReportView";
import TaskView from "./components/Maintenance/TaskView";
import LogView from "./components/Maintenance/LogView";
import Chatbox from "./components/Chatbox";
import { TimeProvider } from "./components/context/TimeContext";
import ExecutiveUI from "./ui/ExecutiveUI";
import RideProposalView from "./components/Ride/RideProposalView";
import CreateStaffForm from "./components/CreateStaffForm";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import RideUI from "./ui/RideUI";
import RideHistory from "./components/Ride/RideHistory";
import ProposeRestaurantDialog from "./components/Restaurant/ProposeRestaurantDialog";
import ProposeStoreDialog from "./components/Store/ProposeStoreDialog";
import OrderView from "./components/Restaurant/OrderView";
import RestaurantUI from "./ui/RestaurantUI";
import RestaurantHistory from "./components/Restaurant/RestaurantHistory";
import StoreUI from "./ui/StoreUI";
import CustomerUI from "./ui/CustomerUI";
import TopupDialog from "./components/Customer/TopupDialog";
import StoreHistory from "./components/Store/StoreHistory";
import CustomerServiceUI from "./ui/CustomerServiceUI";
import BroadcastDialog from "./components/CustomerService/BroadcastDialog";
import CreateCustomerForm from "./components/CustomerService/CreateCustomerForm";

const lostAndFoundGroups = ["All Staff", "Lost and Found Staff"];
const rideManagerGroups = ["All Staff", "Operational Division"];
const rideStaffGroups = ["All Staff", "Operational Division"];
const consumptionGroups = ["All Staff", "Consumption Division"];
const maintenanceManagerGroups = ["All Staff", "Care and Maintenance Division"]
const maintenanceStaffGroups = ["All Staff", "Care and Maintenance Division"]
const marketingGroups = ["All Staff", "Marketing Division"]
const serviceGroups = ["All Staff"]
const executiveGroups = ["All Staff", "Executive Division"]

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TimeProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />

          <Route path="/customer_login" element={<CustomerLoginPage />} />

          <Route path="/customer" element={<CustomerUI />}>
            <Route path="restaurants" element={<RestaurantView />} />
            <Route path="rides" element={<RideView />} />
            <Route path="topup" element={<TopupDialog />} />
            <Route path="chat" element={<ChatBox groupNames={[]} />} />
          </Route>

          <Route path="/customerservice" element={<CustomerServiceUI />}>
            <Route path="restaurants" element={<RestaurantView />} />
            <Route path="rides" element={<RideView />} />
            <Route path="broadcast" element={<BroadcastDialog />} />
            <Route path="create_customer" element={<CreateCustomerForm />} />
            <Route path="chat" element={<Chatbox groupNames={serviceGroups}/>} />
          </Route>

          <Route
            path="/lostandfound"
            element={
              <LostAndFoundProvider>
                <LostAndFoundUI />
              </LostAndFoundProvider>
            }
          >
            <Route path="report" element={<LostAndFoundForm />} />
            <Route path="view" element={<LostAndFoundView />} />
            <Route
              path="chat"
              element={<ChatBox groupNames={lostAndFoundGroups} />}
            />
          </Route>

          <Route path="/restaurant" element={<StaffRestaurantUI />}>
            <Route path="view" element={<RestaurantView />} />
            <Route path="staff_view" element={<RestaurantView />} />
            <Route path="order_view" element={<OrderView />} />
            <Route path="propose" element={<ProposeRestaurantDialog />} />
            <Route
              path="chat"
              element={<Chatbox groupNames={consumptionGroups} />}
            />
          </Route>

          <Route path="/customer_restaurant" element={<RestaurantUI />}>
            <Route path="restaurants" element={<RestaurantView />} />
            <Route path="history" element={<RestaurantHistory />} />
            {/* <Route path="chat" element={} /> */}
          </Route>

          <Route path="/store" element={<StaffStoreUI />}>
            <Route path="view" element={<StoreView />} />
            <Route path="propose" element={<ProposeStoreDialog />} />
            <Route path="staff_view" element={<StoreView />} />
            <Route
              path="chat"
              element={<ChatBox groupNames={marketingGroups} />}
            />
          </Route>

          <Route path="/customer_store" element={<StoreUI />}>
            <Route path="stores" element={<StoreView />} />
            <Route path="history" element={<StoreHistory />} />
            {/* <Route path="chat" element={} /> */}
          </Route>

          <Route path="/ride" element={<StaffRideUI />}>
            <Route path="view" element={<RideView />} />
            <Route path="propose" element={<ProposeRideDialog />} />
            <Route path="staff_view" element={<RideView />} />
            <Route
              path="chat"
              element={<ChatBox groupNames={rideManagerGroups} />}
            />
            <Route
              path="staff_chat"
              element={<ChatBox groupNames={rideStaffGroups} />}
            />
          </Route>

          <Route path="/customer_ride" element={<RideUI />}>
            <Route path="rides" element={<RideView />} />
            <Route path="history" element={<RideHistory />} />
            {/* <Route path="chat" element={} /> */}
          </Route>

          <Route path="/maintenance" element={<MaintenanceUI />}>
            <Route path="reports" element={<ReportView />} />
            <Route path="tasks" element={<TaskView />} />
            <Route path="logs" element={<LogView />} />
            <Route path="staff_reports" element={<ReportView />} />
            <Route path="staff_tasks" element={<TaskView />} />
            <Route
              path="chat"
              element={<ChatBox groupNames={maintenanceManagerGroups} />}
            />
            <Route
              path="staff_chat"
              element={<ChatBox groupNames={maintenanceStaffGroups} />}
            />
          </Route>

          <Route path="/coo" element={<ExecutiveUI />}>
            <Route path="ride_view" element={<RideView />} />
            <Route path="reports" element={<ReportView />} />
            <Route path="tasks" element={<TaskView />} />
            <Route path="ride_proposals" element={<RideProposalView />} />
            <Route path="create_staff" element={<CreateStaffForm />} />
            <Route
              path="chat"
              element={<ChatBox groupNames={executiveGroups} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </TimeProvider>
  </React.StrictMode>
);
