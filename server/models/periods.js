const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: { type: String, required: true },
  years: { type: Number, required: true },
  characteristics: { type: String, required: true },
});

module.exports = mongoose.model("Period", schema);