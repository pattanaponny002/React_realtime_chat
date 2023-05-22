const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");
const MONGODB_URI =
  "mongodb+srv://oloponnyolo:Ponza1234@cluster0.ltpa8rx.mongodb.net/?retryWrites=true&w=majority/master";
mongoose.connect(MONGODB_URI || process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
router.get("/checkExists/:username", async (req, res) => {
  const username = req.params.username;
  // console.log(username);
  const checkedExists = await User.findOne({
    username,
  });
  if (checkedExists) {
    res.status(200).json({ message: username + "already exist..!!" });
  } else {
    res.status(201).json({ message: username + "can use it..!!" });
  }
});
router.post("/register", async (req, res) => {
  const { username, password, email, phone_number, photoURL } = req.body;
  // console.log("DATA", username, password, email, photoURL);
  try {
    const salt = bcryptjs.genSaltSync(10);
    const hash_password = bcryptjs.hashSync(password, salt);
    console.log(typeof hash_password);
    const result = await User.create({
      username,
      password: hash_password,
      email,
      phone_number,
      photoURL,
    });

    res.status(201).send({ result, message: "created username..!!" });
  } catch (err) {
    res.status(404).send({ message: err });
  }
});
//search by name
router.get("/find", async (req, res) => {
  const { username } = req.query;
  console.log("search", username);

  // login have to post password

  const patternCheck = new RegExp(username, "i");
  try {
    const result = await User.find({
      username: {
        $regex: patternCheck,
      },
    });

    if (result.length > 0) {
      res.status(201).send({ result, message: "found username..!!" });
    } else {
      res.status(200).send({ result, message: "dont have yet" });
    }
  } catch (err) {
    res.status(400).send({ message: err });
  }
});
//find by Id in conversation card
router.get("/findId/:id", async (req, res) => {
  const { id } = req.params;
  // console.log("findByID new", id);

  // login have to post password

  try {
    const result = await User.findById(id);

    if (result.length > 0) {
      res.status(201).send({ result, message: "found username..!!" });
    } else {
      res.status(200).send({ result, message: "dont have yet" });
    }
  } catch (err) {
    res.status(400).send({ message: err });
  }
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // console.log("auth", username, password);
  try {
    const result = await User.findOne({
      username,
    });

    const checked = await bcryptjs.compare(password, result.password);
    // console.log("checked", checked);

    if (checked) {
      const jwt_code = jwt.sign({ username }, process.env.REACT_SECRET_KEY, {
        expiresIn: "30s",
      });

      // console.log(jwt_code);
      res
        .cookie("access_token_users", jwt_code, { httpOnly: true })
        .status(200)
        .json({ key: jwt_code, message: "Login successfully", result });
    } else {
      res.status(203).json({
        message: "cookie or jwt code has some problem ",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Bad request",
    });
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
router.get("/welcome", authentication, async (req, res) => {
  const token = req.cookies.access_token_users;

  const { username } = req.body;

  res.status(201).send({ message: "welcome..!!", token, dd: req.dd, username });
});
router.get("/content", authentication, async (req, res) => {
  const token = req.cookies.access_token_users;

  const { username } = req.body;

  res.status(201).send({ message: "welcome..!!", token, dd: req.dd, username });
});

router.delete("/", async (req, res) => {
  const result = await User.deleteMany({
    username: { $exists: true },
  });

  res.status(201).send({ result, message: "deleted username..!!" });
});

module.exports = router;
