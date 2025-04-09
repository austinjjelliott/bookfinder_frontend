import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import NavBar from "./NavBar";
import BooklyRoutes from "./Routes";
import BooklyAPI from "./api";
import UserContext from "./UserContext";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (token) {
        try {
          localStorage.setItem("token", token);
          BooklyAPI.token = token;
          console.log("Token set in App state:", token); // DEBUGGING: Log the token
          const { username } = jwtDecode(token);
          const user = await BooklyAPI.getUser(username);
          setCurrentUser(user);
          console.log("Current user set in App state:", user); // DEBUGGING: Log the current user
        } catch (err) {
          console.error("Error Loading User", err);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    }
    fetchUser();
  }, [token]); //Change it everytime the token changes (ie new user)

  async function login(credentials) {
    try {
      const token = await BooklyAPI.login(credentials);
      setToken(token);
    } catch (err) {
      console.error("ERROR LOGGING IN", err);
      throw err;
    }
  }
  async function signup(userData) {
    try {
      const token = await BooklyAPI.register(userData);
      setToken(token);
    } catch (err) {
      console.error("ERROR SIGNING UP", err);
      throw err;
    }
  }

  async function updateUser(username, userData) {
    try {
      // Make sure the username is passed in the URL path when making the PATCH request
      const res = await BooklyAPI.updateUser(username, userData); // Pass username from context
      setCurrentUser(res); // Update the context with the new user data
    } catch (err) {
      console.error("Error updating profile", err);
      throw err;
    }
  }

  async function updateFavorites(favorites) {
    try {
      if (currentUser) {
        const updatedUser = await BooklyAPI.updateFavorites(
          currentUser.username,
          {
            favorites, // Pass the updated favorites list to the backend
          }
        );
        setCurrentUser(updatedUser); // Update context with new favorites list
      }
    } catch (err) {
      console.error("Error updating favorites", err);
      throw err;
    }
  }

  async function logout() {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("token");
    BooklyAPI.token = null;
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser, token, setToken, updateFavorites }}
    >
      <BrowserRouter>
        <NavBar logout={logout} token={token} />
        <BooklyRoutes
          login={login}
          signup={signup}
          updateUser={updateUser}
          token={token}
          updateFavorites={updateFavorites}
        />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
