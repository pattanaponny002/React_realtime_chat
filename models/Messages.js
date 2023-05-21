const mongoose = require("mongoose");

const Message = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
    photoURL: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Messages", Message);
