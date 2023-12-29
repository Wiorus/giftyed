import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home-page/HomePage";
import LoginPage from "./pages/login-page/LoginPage";
import RegisterPage from "./pages/register-page/RegisterPage";
import React from "react";
import AdminPage from "./pages/admin-page/AdminPage";
import FollowPage from "./pages/follow-page/FollowPage";
import SearchPage from "./pages/search-page/SearchPage";
import MyProfilePage from "./pages/my-profile-page/MyProfilePage";
import ProfilePage from "./pages/profile-page/ProfilePage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/follow" element={<FollowPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/MyProfile" element={<MyProfilePage />} />
        <Route path="/Profile/:userId" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
