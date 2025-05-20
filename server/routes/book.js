const express = require("express");
const router = express.Router();

const bookController = require("../controllers/book");

// Get all authors
router.get("/", bookController.getAllBooks);

// Get author by ID
router.get("/:id", bookController.getBookById);

// Create new author
router.post("/", bookController.createBook);

// Update author
router.put("/:id", bookController.updateBook);

// Delete author
router.delete("/:id", bookController.deleteBook);

module.exports = router;
