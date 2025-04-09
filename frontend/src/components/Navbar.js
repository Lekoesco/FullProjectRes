import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">🍽️ ResBook</div>
      <div className="nav-links">
        {isLoggedIn && (
          <>
            <Link to="/restaurants">Εστιατόρια</Link>
            <Link to="/reservations">Κρατήσεις</Link>
            <Link to="/new-reservation">Νέα Κράτηση</Link>
            <button onClick={handleLogout}>Αποσύνδεση</button>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Link to="/login">Σύνδεση</Link>
            <Link to="/signup">Εγγραφή</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
