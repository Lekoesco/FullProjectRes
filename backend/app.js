const express = require("express"); 
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();


app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", restaurantRoutes);
app.use("/api", reservationRoutes);

module.exports = app;
