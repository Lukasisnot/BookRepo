const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const schema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    favoriteBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
},{timestamps: true});

schema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", schema);