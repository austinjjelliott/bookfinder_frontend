import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "./UserContext";
import "./NavBar.css";

function NavBar({ token, logout }) {
  const { currentUser } = useContext(UserContext);
  return (
    // Dynamic navbar based on whether user is logged in or not
    <nav className="NavBar">
      <div className="nav-left">
        {" "}
        <NavLink to="/locator">Find a Bookstore Near You</NavLink>
      </div>
      <div className="nav-right">
        <NavLink to="/">Home</NavLink>

        {token ? (
          <>
            <NavLink to="/profile">Profile</NavLink>
            {/* Ensure currentUser and username exist before rendering the link */}
            {currentUser?.username ? (
              <NavLink to={`/${currentUser.username}/favorites`}>
                My Books
              </NavLink>
            ) : (
              // Fallback if currentUser or username doesn't exist
              <span>Loading...</span>
            )}{" "}
            <NavLink to="/login" onClick={logout}>
              Log Out {currentUser && currentUser.username}
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/signup">Sign Up</NavLink>
            <NavLink to="/login">Login</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
