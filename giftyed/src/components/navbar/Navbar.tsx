import React from "react";
import "../navbar/Navbar.scss";
import userImg from "../../utils/userAvatar.svg";

export default function Navbar() {
  return (
    <div className="Navbar">
      <div className="Navbar__match">Match</div>
      <div className="Navbar__best">Best</div>
      <div className="Navbar__categories">Categories</div>
      <div className="Navbar__search">
        <input placeholder="search..."></input>
      </div>
      <div className="Navbar__user">
        <img className="Navbar__user-img" src={userImg} alt="userImg" />
      </div>
    </div>
  );
}
