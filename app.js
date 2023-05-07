const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const user = mongoose.model("user", { email: String, password: String });

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const newUser = new user({ email: email, password: password });
    newUser.save();
    res.render("secrets");
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    let checkUser = await user.find({
      email: req.body.username,
      password: req.body.password,
    });
    console.log(checkUser);
    if (checkUser.length !== 0) {
      res.render("secrets");
    } else {
      console.log("user not found");
      res.redirect("/register");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, console.log("The server is running at port 3000"));
