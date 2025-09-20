const express = require("express");
const sequelize = require("./config/db");   // ✅ import DB connection
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
// Import auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Import middleware
const { protect } = require("./middleware/authmiddleware");
const sweetRoutes = require("./routes/sweets");
app.use("/api/sweets", sweetRoutes);

// Protected test route
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have access!` });
});

// Basic public route
app.get("/", (req, res) => {
  res.send("Welcome to Sweet Shop Management System 🍬");
});

// ✅ Test DB connection before starting server
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected");
       // Sync all models (create tables if they don't exist)
    return sequelize.sync({ alter: true }); 
  })
  .then(() => {
    console.log("✅ Tables synced");

    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
  });
