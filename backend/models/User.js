const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: [String],
  balance: { type: Number, default: 5 },
  ads: [{ title: String, description: String }] // İlanlar için yeni alan
});

module.exports = mongoose.model('User', UserSchema);