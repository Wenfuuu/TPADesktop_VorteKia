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
import RestaurantUI from "./ui/RestaurantUI";
import RestaurantView from "./components/Restaurant/RestaurantView";
import { RestaurantProvider } from "./components/context/RestaurantContext";
import StoreUI from "./ui/StoreUI";
import StoreView from "./components/Store/StoreView";

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
              <RestaurantUI />
            </RestaurantProvider>
          }
        >
          <Route path="view" element={<RestaurantView />} />
          {/* <Route path="propose" element={} />
          <Route path="chat" element={} /> */}
        </Route>

        <Route path="/store" element={<StoreUI />}>
          <Route path="view" element={<StoreView />} />
          {/* <Route path="propose" element={} />
          <Route path="chat" element={} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
