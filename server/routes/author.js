const express = require("express");
const router = express.Router();

const authorController = require("../controllers/author");

// Get all authors
router.get("/", authorController.getAllAuthors);

// Get author by ID
router.get("/:id", authorController.getAuthorById);

// Create new author
router.post("/", authorController.createAuthor);

// Update author
router.put("/:id", authorController.updateAuthor);

// Delete author
router.delete("/:id", authorController.deleteAuthor);

module.exports = router;
