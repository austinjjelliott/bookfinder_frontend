import React, { useContext, useState, useEffect } from "react";
import UserContext from "./UserContext"; // Import UserContext
import "./Profile.css";
function Profile() {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="ProfilePage">
      <div className="profile-card">
        <h1>
          Welcome{" "}
          {currentUser.username.charAt(0).toUpperCase() +
            currentUser.username.slice(1)}
        </h1>
        <div className="profile-card__details">
          <h3>
            Name: {currentUser.firstName} {currentUser.lastName}
          </h3>
          <h3>Email: {currentUser.email}</h3>
        </div>
      </div>
    </div>
  );
}

export default Profile;
