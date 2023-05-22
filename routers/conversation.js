const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const Conversations = require("../models/Conversations");
const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");
const MONGODB_URI =
  "mongodb+srv://oloponnyolo:Ponza1234@cluster0.ltpa8rx.mongodb.net/?retryWrites=true&w=majority/master";

mongoose.connect(MONGODB_URI || process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function checkAlreadyAdded(req, res, next) {
  const { senderID, receiverID } = req.body;
  const result = await Conversations.find({
    members: { $all: [senderID, receiverID] },
  });
  console.log("end", result);
  if (result.length === 0) {
    console.log("empty, this conversation is be able to add");
    next();
  } else {
    res.status(200).json({ message: "conversation is already exists..!!" });
  }
}
router.post("/add", checkAlreadyAdded, async (req, res) => {
  const { senderID, receiverID } = req.body;
  // console.log("DATA", senderID, "/n", receiverID);
  try {
    const result = await Conversations.create({
      members: [senderID, receiverID],
    });

    res.status(201).send({ result, message: "created converation..!!" });
  } catch (err) {
    res.status(200).send({ message: err });
  }
});

router.get("/:receiverID", async (req, res) => {
  const { receiverID } = req.params;
  // console.log("DATA", receiverID);
  try {
    const result = await Conversations.find({
      members: { $in: [receiverID] },
    });

    res
      .status(201)
      .send({ result, message: "found receiver-conversaiotb..!!" });
  } catch (err) {
    res.status(200).send({ message: err });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const result = await Conversations.deleteMany({
      members: { $exists: true },
    });

    res.status(201).send({ message: "deleted", result });
  } catch (err) {
    res.status(200).send({ message: err });
  }
});
function authentication(req, res, next) {
  const token = req.cookies.access_token_users;

  //   const { username } = req.body;

  jwt.verify(token, process.env.REACT_SECRET_KEY, (err, user) => {
    if (!err) {
      console.log("PASSED AUTH>>", user);
      req.dd = user;
      next();
    } else {
      res.status(400).json({ err });
    }
  });
}

module.exports = router;
