const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const findUserByEmail = async (email) => {
  return User.findOne({ email: new RegExp(`^${escapeRegex(email)}$`, 'i') });
};

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const email = req.body.email?.toString().trim().toLowerCase();
    const password = req.body.password?.toString();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userExists = await findUserByEmail(email);
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const email = req.body.email?.toString().trim().toLowerCase();
    const password = req.body.password?.toString();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "User not found" });

    let valid = false;
    const storedPassword = user.password || "";

    if (storedPassword.startsWith('$2')) {
      valid = await bcrypt.compare(password, storedPassword);
    } else {
      valid = password === storedPassword;
      if (valid) {
        // Migrate legacy plain-text password to a bcrypt hash.
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!valid) return res.status(400).json({ message: "Invalid password" });

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;