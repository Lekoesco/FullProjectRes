import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [editingReservation, setEditingReservation] = useState(null);
  const [formData, setFormData] = useState({ date: "", time: "", people_count: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/user/reservations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReservations(res.data.reservations);
      } catch (err) {
        alert("❌ Δεν είστε συνδεδεμένος. Κάντε login ξανά.");
        navigate("/login");
      }
    };

    fetchReservations();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις την κράτηση;");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReservations((prev) => prev.filter((r) => r.reservation_id !== id));
      alert("✅ Διαγραφή επιτυχής");
    } catch (err) {
      alert("❌ Αποτυχία διαγραφής");
    }
  };

  const handleEditClick = (res) => {
    setEditingReservation(res);
    setFormData({ date: res.date, time: res.time, people_count: res.people_count });
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/reservations/${editingReservation.reservation_id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReservations((prev) =>
        prev.map((r) =>
          r.reservation_id === editingReservation.reservation_id ? { ...r, ...formData } : r
        )
      );

      setEditingReservation(null);
      alert("✅ Επεξεργασία επιτυχής");
    } catch (err) {
      alert("❌ Αποτυχία επεξεργασίας");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Οι Κρατήσεις μου</h2>
      <button onClick={handleLogout}>🚪 Αποσύνδεση</button>{" "}
      <button onClick={() => navigate("/new-reservation")}>➕ Νέα Κράτηση</button>
      <br /><br />
      {reservations.length === 0 ? (
        <p>Δεν υπάρχουν κρατήσεις.</p>
      ) : (
        <ul>
          {reservations.map((res) => (
            <li key={res.reservation_id}>
              <strong>{res.restaurant_name}</strong> – {res.date} – {res.time} – {res.people_count} άτομα
              <br />
              <button
                onClick={() => handleDelete(res.reservation_id)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.4rem 0.7rem",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ❌ Διαγραφή
              </button>{" "}
              <button
                onClick={() => handleEditClick(res)}
                style={{
                  marginTop: "0.5rem",
                  marginLeft: "0.5rem",
                  padding: "0.4rem 0.7rem",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ✏️ Επεξεργασία
              </button>
            </li>
          ))}
        </ul>
      )}

      {editingReservation && (
        <div className="modal">
          <h3>Επεξεργασία Κράτησης</h3>
          <label>Ημερομηνία:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          /><br />
          <label>Ώρα:</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          /><br />
          <label>Άτομα:</label>
          <input
            type="number"
            min="1"
            value={formData.people_count}
            onChange={(e) => setFormData({ ...formData, people_count: e.target.value })}
          /><br />
          <button onClick={handleEditSave}>💾 Αποθήκευση</button>
          <button onClick={() => setEditingReservation(null)}>❌ Ακύρωση</button>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;