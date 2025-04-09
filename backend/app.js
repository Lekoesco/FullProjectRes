const express = require("express"); // 👈 Μάλλον λείπει από την αρχή
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();

// ✅ Middleware ΠΡΕΠΕΙ να μπει πριν τα routes
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", restaurantRoutes);
app.use("/api", reservationRoutes);

module.exports = app;
