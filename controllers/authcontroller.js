const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = "mysecretkey123"; 

// Register
const register = async (req, res) => {
  const { username, password, isAdmin } = req.body;

  try {
    // Check if user exists
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const newUser = await User.create({
      username,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    res.status(201).json({ 
      message: "User registered successfully", 
      user: { id: newUser.id, username: newUser.username, isAdmin: newUser.isAdmin } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, isAdmin: user.isAdmin }); // ✅ include isAdmin
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { register, login };
