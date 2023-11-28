import React from "react";
import "../navbar/Navbar.scss";
import userImg from "../../utils/userAvatar.svg";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div className="Navbar">
      <div className="Navbar__match">Match</div>
      <div className="Navbar__best">Best</div>
      <div className="Navbar__followed">Followed</div>
      <div className="Navbar__user">
        <img className="Navbar__user-img" src={userImg} alt="userImg" />
        <Link className="Navbar__user-singIn" to="/login">sign in</Link>
      </div>
    </div>
  );
}
export default Navbar;