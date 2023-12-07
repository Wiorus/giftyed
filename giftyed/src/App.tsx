import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home-page/HomePage";
import LoginPage from "./pages/login-page/LoginPage";
import RegisterPage from "./pages/register-page/RegisterPage";
import React from "react";
import AdminPage from "./pages/admin-page/AdminPage";
import FollowPage from "./pages/follow-page/FollowPage";
import SearchPage from "./pages/search-page/SearchPage";
import ProfilePage from "./pages/profile-page/ProfilePage";
import SignUpButton from "./components/singUpButton/SignUpButton";


const App:React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/admin" element={<AdminPage/>}/>
        <Route path="/follow" element={<FollowPage/>}/>
        <Route path="/search" element={<SearchPage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/signup" element={<SignUpButton/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
