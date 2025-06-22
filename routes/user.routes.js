const { Router } = require("express");
const User = require("../models/user.model");

const router = Router();

router.get("/", (req, res) => {
  return res.render("home");
});

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  return res.redirect("/api/v1/user");
});

router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  const user = await User.create({
    fullName: fullname,
    email: email,
    password: password,
  })

  console.log("User created:", user);

  return res.redirect("/api/v1/user");
});

module.exports = router;
