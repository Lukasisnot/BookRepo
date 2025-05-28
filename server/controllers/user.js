// controllers/user.js
const User = require('../models/User'); // Adjust path if necessary
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Helper to sign JWT
const signToken = (userId) => { // Sign with userId as per your auth middleware
  return jwt.sign({ userId }, "secretKey", { // IMPORTANT: Use process.env.JWT_SECRET
    expiresIn: process.env.JWT_EXPIRES_IN || '90d' // Example expiry
  });
};

// Helper to create and send token (stores in HTTP-only cookie)
const createSendTokenResponse = (user, statusCode, req, res) => {
  const token = signToken(user._id); // Use user._id as userId for the token

  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRES_IN_DAYS) || 90) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'lax',
  };

  res.cookie('token', token, cookieOptions); // Ensure cookie name matches 'token' from your auth middleware

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    // token, // Not sending token in body as it's in httpOnly cookie
    payload: { // Your frontend expects payload
      user // Send the full user object (which includes name, email, role, _id)
    }
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: 'fail', error: 'Please provide name, email, and password.' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ status: 'fail', error: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user' // Securely handle role assignment
    });

    createSendTokenResponse(newUser, 201, req, res);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ status: 'error', error: 'Registration failed.' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'fail', error: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) { // Ensure comparePassword takes candidate only
      return res.status(401).json({ status: 'fail', error: 'Incorrect email or password.' });
    }

    createSendTokenResponse(user, 200, req, res);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ status: 'error', error: 'Login failed.' });
  }
};

exports.logoutUser = (req, res) => {
  res.cookie('token', 'loggedout', { // Clear the 'token' cookie
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

// NEW: Endpoint to get current user details
exports.getMe = async (req, res) => {
  // req.userId should be set by authenticateUser middleware
  if (!req.userId) {
    return res.status(401).json({ status: 'fail', error: 'Not authenticated' });
  }
  try {
    const user = await User.findById(req.userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ status: 'fail', error: 'User not found' });
    }
    res.status(200).json({
      status: 'success',
      payload: user // Send the user object, which includes the role
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ status: 'error', error: 'Failed to fetch user details' });
  }
};