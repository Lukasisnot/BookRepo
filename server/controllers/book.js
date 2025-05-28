// controllers/book.js:
const Book = require("../models/book");
const Author = require("../models/author"); // Import Author model

// GET all books
exports.getAllBooks = async (req, res) => {
  try {
    const result = await Book.find().populate({
      path: 'author',
      populate: ['literary_group', 'period'], // to get full author info
    });

    if (result.length > 0) {
      return res.status(200).send({
        msg: "Books found",
        payload: result,
      });
    }
    return res.status(404).send({ msg: "No books found" });
  } catch (error) {
    return res.status(500).send({ msg: error.message || error });
  }
};

// GET book by ID
exports.getBookById = async (req, res) => {
  try {
    const result = await Book.findById(req.params.id).populate({
      path: 'author',
      populate: ['literary_group', 'period'],
    });

    if (result) {
      return res.status(200).send({
        msg: "Book found",
        payload: result,
      });
    }
    return res.status(404).send({ msg: "Book not found" });
  } catch (error) {
    return res.status(500).send({ msg: error.message || error });
  }
};

// DELETE book
exports.deleteBook = async (req, res) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);
    if (result) {
      return res.status(200).send({ msg: "Book deleted" });
    }
    return res.status(404).send({ msg: "Book not found" });
  } catch (error) {
    return res.status(500).send({ msg: error.message || error });
  }
};

// UPDATE book
exports.updateBook = async (req, res) => {
  try {
    const { title, description, author, publishedYear } = req.body;

    // Safety check: if author is being updated, ensure the author exists
    if (author) {
      const authorExists = await Author.findById(author);
      if (!authorExists) {
        return res.status(404).send({ msg: "Author not found. Cannot update book." });
      }
    }

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (author !== undefined) dataToUpdate.author = author;
    if (publishedYear !== undefined) dataToUpdate.publishedYear = publishedYear;


    const result = await Book.findByIdAndUpdate(req.params.id, dataToUpdate, { new: true }).populate({
      path: 'author',
      populate: ['literary_group', 'period'],
    });

    if (result) {
      return res.status(200).send({
        msg: "Book updated",
        payload: result,
      });
    }
    return res.status(404).send({ msg: "Book not found" });
  } catch (error) {
    // Handle potential CastError if author ID is invalid format
    if (error.name === 'CastError' && error.path === '_id' && error.kind === 'ObjectId') {
        return res.status(400).send({ msg: "Invalid Author ID format." });
    }
    return res.status(500).send({ msg: error.message || error });
  }
};

// CREATE book
exports.createBook = async (req, res) => {
  try {
    const { title, description, author, publishedYear } = req.body;

    // Safety check: ensure the author exists
    if (!author) {
        return res.status(400).send({ msg: "Author ID is required." });
    }
    const authorExists = await Author.findById(author);
    if (!authorExists) {
      return res.status(404).send({ msg: "Author not found. Cannot create book." });
    }

    const data = new Book({
      title,
      description,
      author, // This is the author's ID
      publishedYear,
    });

    let result = await data.save();
    // Populate author details in the response
    result = await result.populate({
        path: 'author',
        populate: ['literary_group', 'period'],
    });

    if (result) {
      return res.status(201).send({
        msg: "Book created",
        payload: result,
      });
    }
    // This case should ideally not be reached if save() succeeds or throws an error
    return res.status(500).send({ msg: "Book was not created" });
  } catch (error) {
    // Handle potential CastError if author ID is invalid format
    if (error.name === 'CastError' && error.path === '_id' && error.kind === 'ObjectId') {
        return res.status(400).send({ msg: "Invalid Author ID format." });
    }
    return res.status(500).send({ msg: error.message || error });
  }
};