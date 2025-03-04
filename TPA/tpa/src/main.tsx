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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
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
          <Route path="chat" element={<ChatBox />} />
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
          {/* <Route path="propose" element={} />
          <Route path="chat" element={} /> */}
        </Route>

        <Route path="/store" element={<StaffStoreUI />}>
          <Route path="view" element={<StoreView />} />
          {/* <Route path="propose" element={} />
          <Route path="chat" element={} /> */}
        </Route>

        <Route path="/ride" element={<StaffRideUI />}>
          <Route path="view" element={<RideView />} />
          <Route path="propose" element={<ProposeRideDialog />} />
          {/* <Route path="chat" element={} /> */}
        </Route>

        <Route path="/maintenance" element={<MaintenanceUI />}>
          <Route path="reports" element={<ReportView />} />
          <Route path="tasks" element={<TaskView />} />
          <Route path="staff_reports" element={<ReportView />} />
          {/* <Route path="chat" element={} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
