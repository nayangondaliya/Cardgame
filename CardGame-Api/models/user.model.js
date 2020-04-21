const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    card: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "cards"
    }]
  })
);

module.exports = User;