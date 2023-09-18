import React from "react";
import "../login-page/LoginPage.scss";
import waves from "../../utils/waves.png";
import LoginForm from "../../components/loginForm/LoginForm";

export default function LoginPage() {
  return (
    <div className="LoginPage">
      <div className="LoginPage__form">
        <LoginForm />
      </div>
      <img className="LoginPage__wavesImg" src={waves} alt="waves" />
    </div>
  );
}
