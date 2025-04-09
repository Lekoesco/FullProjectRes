const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  console.log("BODY DEBUG:", req.body);

  const { name, email, password } = req.body;

  try {
    // Έλεγχος αν το email υπάρχει ήδη
    const checkSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkSql, [email], async (err, results) => {
      if (err) {
        console.error("DB Error (check):", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: "Το email χρησιμοποιείται ήδη" });
      }

      // Hash κωδικού και εισαγωγή νέου χρήστη
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.query(insertSql, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("DB Error (insert):", err);
          return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({ message: "Εγγραφή επιτυχής!" });
      });
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  });
};

module.exports = {
  registerUser,
  loginUser,
};
