import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router";
import LostAndFoundUI from "./ui/LostAndFoundUI";
import LostAndFoundForm from "./components/LostAndFoundForm";
import { LostAndFoundProvider } from "./components/context/LostAndFoundContext";
import LostAndFoundView from "./components/LostAndFoundView";
import { Toaster } from "sonner";
import ChatBox from "./components/Chatbox";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Toaster/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/lostandfound" element={
          <LostAndFoundProvider>
            <LostAndFoundUI/>
          </LostAndFoundProvider>
        }>
          <Route path="report" element={<LostAndFoundForm />} />
          <Route path="view" element={<LostAndFoundView />} />
          <Route path="chat" element={<ChatBox/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
