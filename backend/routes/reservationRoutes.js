const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

// 🔒 Προστατευμένο endpoint - Εμφάνιση κρατήσεων του χρήστη
router.get("/user/reservations", verifyToken, (req, res) => {
  const userId = req.user.user_id;

  const sql = `
    SELECT r.reservation_id, r.date, r.time, r.people_count,
           rest.name AS restaurant_name, rest.location
    FROM reservations r
    JOIN restaurants rest ON r.restaurant_id = rest.restaurant_id
    WHERE r.user_id = ?
    ORDER BY r.date DESC, r.time DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ reservations: results });
  });
});

// 🔒 Προστατευμένο endpoint - Δημιουργία νέας κράτησης
router.post("/reservations", verifyToken, (req, res) => {
  const { restaurant_id, date, time, people_count } = req.body;
  const user_id = req.user.user_id;

  const sql = `
    INSERT INTO reservations (user_id, restaurant_id, date, time, people_count)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, restaurant_id, date, time, people_count], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({ message: "Reservation created successfully" });
  });
});
// 🔥 Διαγραφή κράτησης
router.delete("/reservations/:id", verifyToken, (req, res) => {
  const reservationId = req.params.id;
  const userId = req.user.user_id;

  const sql = "DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?";
  db.query(sql, [reservationId, userId], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "Δεν επιτρέπεται η διαγραφή" });
    }

    res.json({ message: "Κράτηση διαγράφηκε επιτυχώς" });
  });
});
router.get("/restaurants", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM restaurants"); // ή συγκεκριμένα πεδία
    res.json({ restaurants: rows });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});
// 🔒 Επεξεργασία κράτησης
router.put("/reservations/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { date, time, people_count } = req.body;
  const userId = req.user.user_id;

  const sql = `
    UPDATE reservations 
    SET date = ?, time = ?, people_count = ? 
    WHERE reservation_id = ? AND user_id = ?
  `;

  db.query(sql, [date, time, people_count, id, userId], (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "❌ Δεν βρέθηκε ή δεν σας ανήκει η κράτηση" });
    }

    res.json({ message: "✅ Η κράτηση ενημερώθηκε επιτυχώς" });
  });
});

module.exports = router;
