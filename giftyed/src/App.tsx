import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home-page/HomePage";
import LoginPage from "./pages/login-page/LoginPage";
import RegisterPage from "./pages/register-page/RegisterPage";
import React from "react";
import SignIn from "./pages/sign-in/SignIn";
import AdminPage from "./pages/admin-page/AdminPage";
import FollowPage from "./pages/follow-page/FollowPage";
import SearchPage from "./pages/search-page/SearchPage";
import ProfilePage from "./pages/profile-page/ProfilePage";


const App:React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/signIn" element={<SignIn/>}/>
        <Route path="/admin" element={<AdminPage/>}/>
        <Route path="/follow" element={<FollowPage/>}/>
        <Route path="/search" element={<SearchPage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
