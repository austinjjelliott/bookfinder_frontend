import React, { useContext, useState, useEffect } from "react";
import UserContext from "./UserContext";
import "./Favorites.css";

function Favorites() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [favorites, setFavorites] = useState(currentUser?.favorites || []);

  useEffect(() => {
    if (currentUser) {
      setFavorites(currentUser.favorites);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <h3>Please log in to view your favorite books.</h3>;
  }

  return (
    <div className="favorite-container">
      <div className="favorite-card">
        <h1>
          Welcome{" "}
          {currentUser.username.charAt(0).toUpperCase() +
            currentUser.username.slice(1)}
        </h1>
        <h3>Your Favorite Books Are:</h3>
        {favorites.length > 0 ? (
          <ul>
            {favorites.map((bookTitle, index) => (
              <p className="bookTitle" key={index}>
                {" "}
                {bookTitle}{" "}
                <a
                  href={`https://www.amazon.com/s?k=${bookTitle}`}
                  target="_blank"
                  rel="noopener noreferrer" //Done for user security purposes
                  className="amazon-link"
                >
                  <br /> 📚<small>Purchase</small>📚
                </a>
              </p>
            ))}
          </ul>
        ) : (
          <p>You have no favorite books yet.</p>
        )}
      </div>
    </div>
  );
}

export default Favorites;
