import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", { name, email, password });
      alert("✅ Εγγραφή επιτυχής!");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("❌ Το email χρησιμοποιείται ήδη.");
      } else {
        alert("❌ Σφάλμα εγγραφής.");
      }
    }
  };

  return (
    <div className="container">
      <h2>Εγγραφή</h2>
      <form onSubmit={handleSignup}>
        <label>Όνομα:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Κωδικός:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Εγγραφή</button>
      </form>
    </div>
  );
};

export default SignupPage;
