const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const Messages = require("../models/Messages");
const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");
mongoose.connect("mongodb://localhost:27017/master", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
router.get("/", async (req, res) => {
  res.json({ hello: "test" });
});
router.post("/add", async (req, res) => {
  const { conversationId, senderId, text, photoURL } = req.body;
  console.log(
    "text",
    text,
    "conversationId",
    conversationId,
    "senderId",
    senderId
  );
  try {
    const result = await Messages.create({
      conversationId,
      senderId,
      text,
      photoURL,
    });

    res.status(200).json({ result, message: "create chat..!!" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  console.log("find", conversationId);
  try {
    const result = await Messages.find({
      conversationId,
    });

    res.status(200).json({ result, message: "found message..!!" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
router.delete("/", async (req, res) => {
  console.log("hello");
  try {
    const result = await Messages.deleteMany({
      conversationId: { $exists: true },
    });

    res.status(201).json({ result, message: "found message..!!" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
module.exports = router;
