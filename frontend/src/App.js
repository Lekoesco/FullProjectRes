import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ReservationsPage from "./pages/ReservationsPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import NewReservationPage from "./pages/NewReservationPage";
import Navbar from "./components/Navbar";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Σύνδεση */}
        <Route path="/login" element={<LoginPage />} />

        {/* Εγγραφή */}
        <Route path="/signup" element={<SignupPage />} />

        {/* Σελίδα κρατήσεων */}
        <Route
          path="/reservations"
          element={isLoggedIn ? <ReservationsPage /> : <Navigate to="/login" />}
        />

        {/* Λίστα εστιατορίων */}
        <Route
          path="/restaurants"
          element={isLoggedIn ? <RestaurantsPage /> : <Navigate to="/login" />}
        />

        {/* Νέα κράτηση */}
        <Route
          path="/new-reservation"
          element={isLoggedIn ? <NewReservationPage /> : <Navigate to="/login" />}
        />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
