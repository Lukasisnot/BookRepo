const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // <<<--- MODIFIED: Destructure name

    // Optional: Add more specific validation for name if needed (e.g., length)
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    // You could add more specific validation like checking name length, email format (though mongoose does some of this)

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Include name when creating the new user
    const newUser = new User({ name, email, password: hashedPassword }); // <<<--- MODIFIED: Included name
    await newUser.save(); // Mongoose will validate against the schema here (including 'name' being required)
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    // Improved error handling for Mongoose validation errors
    if (error.name === 'ValidationError') {
        let errors = {};
        Object.keys(error.errors).forEach((key) => {
            errors[key] = error.errors[key].message;
        });
        return res.status(400).json({ error: "Validation failed", details: errors });
    }
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Ensure comparePassword is awaited as it's an async function
    if (!user || !(await user.comparePassword(password))) { 
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1d' }); // Consider moving 'secretKey' to an env variable

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure true in production (HTTPS)
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // It's often good to send back some user info (excluding password)
    // or just a success message as you are doing.
    res.status(200).json({ message: 'Logged in successfully' /*, user: { id: user._id, name: user.name, email: user.email, role: user.role } */ });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logged out" });
};