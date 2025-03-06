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
import { RestaurantProvider } from "./components/context/RestaurantContext";
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
import StaffLoginPage from "./pages/StaffLoginPage";
import { TimeProvider } from "./components/context/TimeContext";

const lostAndFoundGroups = ["All Staff", "Lost and Found Staff"];
const rideManagerGroups = ["All Staff", "Operational Division", "requestmaintenance"];
const rideStaffGroups = ["All Staff", "Operational Division"];
const consumptionGroups = ["All Staff", "Consumption Division"];
const maintenanceManagerGroups = ["All Staff", "Care and Maintenance Division", "respondrequest"]
const maintenanceStaffGroups = ["All Staff", "Care and Maintenance Division"]
const marketingGroups = ["All Staff", "Marketing Division"]
const executiveGroups = ["All Staff", "Executive Division"]

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TimeProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />

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

          <Route
            path="/restaurant"
            element={
              <RestaurantProvider>
                <StaffRestaurantUI />
              </RestaurantProvider>
            }
          >
            <Route path="view" element={<RestaurantView />} />
            {/* <Route path="propose" element={} /> */}
            <Route
              path="chat"
              element={<Chatbox groupNames={consumptionGroups} />}
            />
          </Route>

          <Route path="/store" element={<StaffStoreUI />}>
            <Route path="view" element={<StoreView />} />
            {/* <Route path="propose" element={} /> */}
            <Route
              path="chat"
              element={<ChatBox groupNames={marketingGroups} />}
            />
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

          <Route path="/maintenance" element={<MaintenanceUI />}>
            <Route path="reports" element={<ReportView />} />
            <Route path="tasks" element={<TaskView />} />
            <Route path="logs" element={<LogView />} />
            <Route path="staff_reports" element={<ReportView />} />
            <Route path="staff_tasks" element={<TaskView />} />
            {/* <Route path="chat" element={} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </TimeProvider>
  </React.StrictMode>
);
