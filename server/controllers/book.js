const Book = require("../models/book");

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
    res.status(404).send({ msg: "No books found" });
  } catch (error) {
    res.status(500).send(error);
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
    res.status(404).send({ msg: "Book not found" });
  } catch (error) {
    res.status(500).send(error);
  }
};

// DELETE book
exports.deleteBook = async (req, res) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);
    if (result) {
      return res.status(200).send({ msg: "Book deleted" });
    }
    res.status(404).send({ msg: "Book not found" });
  } catch (error) {
    res.status(500).send(error);
  }
};

// UPDATE book
exports.updateBook = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
    };

    const result = await Book.findByIdAndUpdate(req.params.id, data, { new: true });
    if (result) {
      return res.status(200).send({
        msg: "Book updated",
        payload: result,
      });
    }
    res.status(404).send({ msg: "Book not found" });
  } catch (error) {
    res.status(500).send(error);
  }
};

// CREATE book
exports.createBook = async (req, res) => {
  try {
    const data = new Book({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
    });

    const result = await data.save();
    if (result) {
      return res.status(201).send({
        msg: "Book created",
        payload: result,
      });
    }
    res.status(500).send({ msg: "Book was not created" });
  } catch (error) {
    res.status(500).send(error);
  }
};
