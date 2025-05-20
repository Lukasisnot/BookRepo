const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  nationality: { type: String, required: true },
  literary_group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LiteraryGroup",
    required: false 
  },
  period: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Period",
    required: true
  }
});

module.exports = mongoose.model("Author", schema);