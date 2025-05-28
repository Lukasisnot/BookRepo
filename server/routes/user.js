// routes/userRoutes.js (or your actual user routes file)
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user"); // Path to your user controller
const auth = require("../middleware/auth"); // Path to your auth middleware

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);

// NEW: Route for /user/me
// It needs to be protected by authenticateUser so req.userId is available
router.get("/me", auth.authenticateUser, userController.getMe);

// Example of using authorizeUser for a backend admin-only endpoint
// router.get("/admin-stuff", auth.authenticateUser, auth.authorizeUser('admin'), (req, res) => {
//   res.json({ message: "Welcome Admin to secret stuff!" });
// });

module.exports = router;