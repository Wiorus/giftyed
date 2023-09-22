import React from 'react'
import "../registerForm/RegisterForm.scss"

export default function RegisterForm() {
  return (
    <div className="RegisterForm">
      <div className="RegisterForm__logoName">
        <span className="RegisterForm__logoName-one">Gift</span>
        <span className="RegisterForm__logoName-two">yed</span>
      </div>

      <form>

        <div className="RegisterForm__email">
          <label htmlFor="emailName">Email</label>
          <br />
          <input id="loginInput" />
        </div>

        <div className="RegisterForm__login">
          <label htmlFor="loginName">Login</label>
          <br />
          <input id="loginInput" />
        </div>

        <div className="RegisterForm__password-one">
          <label htmlFor="passwordName-one">Password</label>
          <br />
          <input type="password" id="passwordInput-one" />
        </div>

        <div className="RegisterForm__password-two">
          <label htmlFor="passwordName-two">Password</label>
          <br />
          <input type="password" id="passwordInput-two" />
        </div>

        <div className="RegisterForm__button">
          <button type="submit">Register</button>
        </div>

      </form>
    </div>
  )
}
