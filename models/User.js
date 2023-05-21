const mongoose = require("mongoose");

const subInfo = new mongoose.Schema({
  address: {
    type: String,
  },
  age: {
    type: Number,
    require: true,
  },
  occupation: {
    type: String,
  },
});
const User = new mongoose.Schema({
  username: {
    type: String,
  },

  password: {
    type: String,
  },
  email: {
    type: String,
  },

  phone_number: {
    type: String,
  },
  photoURL: {
    type: String,
  },
});

module.exports = mongoose.model("Users", User);
