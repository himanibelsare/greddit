import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./profile";
import AllSubGreddits from "./AllSubGreddits";
import MySubGreddits from "./MySubGreddits";
import SavedPosts from "./SavedPosts";
import SubGredDetails from "./SubGredDetails";
import SubGredditPage from "./SubGredditPage.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/allsubgreddits" element={<AllSubGreddits />} />
        <Route path="/mysubgreddits" element={<MySubGreddits />} />
        <Route path="/savedposts" element={<SavedPosts />} />
        <Route path="/mysubgreddits/:subName" element={<SubGredDetails />} />
        <Route path="/allsubgreddits/:subName" element={<SubGredditPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
