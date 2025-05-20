const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author", // odkazy na model autora
    required: true,
  },
  publishedYear: { type: Number, required: true },
});

module.exports = mongoose.model("Book", bookSchema);
