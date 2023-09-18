import React from "react";
import "../loginForm/LoginForm.scss";

export default function LoginForm() {
  return (
    <div className="LoginForm">
      <div className="LoginForm__logoName">
        <spam className="LoginForm__logoName-one">Gift</spam>
        <spam className="LoginForm__logoName-two">yed</spam>
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
          <input id="passwordInput" />
        </div>

        <div className="LoginForm__button">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
