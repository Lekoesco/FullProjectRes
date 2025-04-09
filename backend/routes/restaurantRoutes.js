const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Δημόσιο endpoint - Επιστροφή όλων των εστιατορίων
router.get("/restaurants", (req, res) => {
  const sql = "SELECT * FROM restaurants";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ restaurants: results });
  });
});

module.exports = router;
