import React, { useContext, useEffect } from "react";
import "../navbar/Navbar.scss";
import userImg from "../../utils/userAvatar.svg";
import { useNavigate } from "react-router-dom";
import { UsersContext, UsersContextType } from "../../contexts/user.context";


const Navbar: React.FC = () => {
  const { currentUserContext, setCurrentUserContext } = useContext(UsersContext) as UsersContextType;
  
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setCurrentUserContext(JSON.parse(storedUserData));
    }
  }, [setCurrentUserContext]);
  
  const handleSignOut = () => {
    localStorage.removeItem('userData');
    setCurrentUserContext(undefined);
  };
  const navigate = useNavigate();

  return (
    <div className="Navbar">
      <div className="Navbar__match" onClick={() => navigate("/search")}>Match</div>

      {currentUserContext && (
        <>
          <div className="Navbar__best" onClick={() => navigate("/")}>Best</div>
          <div className="Navbar__followed"onClick={() => navigate("/follow")}>Followed</div>
        </>
      )}

      <div className="Navbar__user">
        <img className="Navbar__user-img" src={userImg} alt="userImg" />
        <div className="Navbar__user-AuthButton">
          {currentUserContext ? (
            <p className="Navbar__user-AuthButton-signOut" onClick={handleSignOut}>Sign Out</p>
          ) : (
            <p className="Navbar__user-AuthButton-signIn" onClick={() => navigate("/login")}>
              Sign In
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
export default Navbar;