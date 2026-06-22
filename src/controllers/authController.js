const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.registerUser = async (req, res) => {
  try {

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Activity Log
    await ActivityLog.create({
      action: "User Registered",
      user: email,
      details: `${username} created an account`
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Activity Log
    await ActivityLog.create({
      action: "User Logged In",
      user: email,
      details: `${email} logged into the system`
    });

    res.json({
      token
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};