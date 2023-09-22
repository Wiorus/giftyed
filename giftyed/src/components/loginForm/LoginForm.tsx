import React from "react";
import "../loginForm/LoginForm.scss";

export default function LoginForm() {
  return (
    <div className="LoginForm">
      <div className="LoginForm__logoName">
        <span className="LoginForm__logoName-one">Gift</span>
        <span className="LoginForm__logoName-two">yed</span>
      </div>

      <form>
        <div className="LoginForm__login">
          <label htmlFor="loginName">Login</label>
          <br />
          <input id="loginInput" />
        </div>
        <div className="LoginForm__password">
          <label htmlFor="passwordName">Password</label>
          <br />
          <input type="password" id="passwordInput" />
        </div>

        <div className="LoginForm__loginButton">
          <button type="submit">Login</button>
        </div>

        <div className="LoginForm__selection"><p>Or</p></div>

        <div className="LoginForm__registerButton">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}
