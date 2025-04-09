import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import BookDetail from "./BookDetail";
import LoginForm from "./LoginForm";
import Profile from "./Profile";
import Favorites from "./Favorites";
import BookstoreLocator from "./BookstoreLocator";
import NotFound from "./NotFound";
import SignupForm from "./SignupForm";

function BooklyRoutes({ login, signup }) {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/locator" element={<BookstoreLocator />} />
      <Route path="/books/:id" element={<BookDetail />} />
      <Route path="/login" element={<LoginForm login={login} />} />
      <Route path="/signup" element={<SignupForm signup={signup} />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/:username/favorites" element={<Favorites />} />
      <Route path="*" element={<NotFound />} />
      {/* Catch-all for invalid URLs */}
    </Routes>
  );
}

export default BooklyRoutes;
