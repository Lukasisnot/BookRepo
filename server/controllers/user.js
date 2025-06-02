// controllers/user.js
const User = require('../models/user'); // Adjust path if necessary
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose'); // Added for ObjectId validation
const Book = require('../models/book'); // Uncomment and adjust path if you need to validate book existence

// Helper to sign JWT
const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "secretKey", { 
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

// Helper to create and send token
const createSendTokenResponse = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRES_IN_DAYS) || 90) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'lax',
  };

  res.cookie('token', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    payload: {
      user
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
      role: role === 'admin' ? 'admin' : 'user'
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

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ status: 'fail', error: 'Incorrect email or password.' });
    }

    createSendTokenResponse(user, 200, req, res);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ status: 'error', error: 'Login failed.' });
  }
};

exports.logoutUser = (req, res) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ status: 'fail', error: 'Not authenticated' });
  }
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'fail', error: 'User not found' });
    }
    res.status(200).json({
      status: 'success',
      payload: user
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ status: 'error', error: 'Failed to fetch user details' });
  }
};

exports.getUserFavoriteBooks = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ status: 'fail', error: 'Not authenticated' });
  }
  try {
    const user = await User.findById(req.userId)
                           .populate('favoriteBooks') 
                           .select('favoriteBooks _id');

    if (!user) {
      return res.status(404).json({ status: 'fail', error: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      payload: {
        favoriteBooks: user.favoriteBooks 
      }
    });
  } catch (error) {
    console.error("Error fetching user's favorite books:", error);
    res.status(500).json({ status: 'error', error: "Failed to fetch user's favorite books" });
  }
};

// NEW: Add a book to user's favorites
exports.addFavoriteBook = async (req, res) => {
  try {
    const userId = req.userId; // From auth.authenticateUser middleware
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ status: 'fail', error: 'Invalid book ID format.' });
    }

    // Check if the book actually exists in the 'Book' collection
    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      return res.status(404).json({ status: 'fail', error: 'Book not found.' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favoriteBooks: bookId } }, // $addToSet prevents duplicates
      { new: true } // Return the updated document
    ).select('favoriteBooks');

    if (!user) {
      return res.status(404).json({ status: 'fail', error: 'User not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Book added to favorites.',
      payload: {
        favoriteBooks: user.favoriteBooks, // Returns array of ObjectId
      },
    });
  } catch (error) {
    console.error("Error adding favorite book:", error);
    res.status(500).json({ status: 'error', error: 'Failed to add book to favorites.' });
  }
};

// NEW: Remove a book from user's favorites
exports.removeFavoriteBook = async (req, res) => {
  try {
    const userId = req.userId; // From auth.authenticateUser middleware
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ status: 'fail', error: 'Invalid book ID format.' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteBooks: bookId } }, // $pull removes the item
      { new: true } // Return the updated document
    ).select('favoriteBooks');

    if (!user) {
      return res.status(404).json({ status: 'fail', error: 'User not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Book removed from favorites.',
      payload: {
        favoriteBooks: user.favoriteBooks, // Returns array of ObjectId
      },
    });
  } catch (error) {
    console.error("Error removing favorite book:", error);
    res.status(500).json({ status: 'error', error: 'Failed to remove book from favorites.' });
  }
};