const { Router } = require("express");
const User = require("../models/user.model");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("signin", {
        error: "All fields are required",
      });
    }

    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/api/v1/");
  } catch (error) {
    console.error("Error during sign-in:", error);
    return res.status(500).render("signin", {
      error: error.message || "Internal Server Error",
    });
  }
});

router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).render("signup", {
      error: "All fields are required",
    });
  }

  // Check if user already exists
  const existingUser = await User.find({ email });
  if (!existingUser) {
    return res.status(400).render("signup", {
      error: "User already exists with this email",
    });
  }

  // Create a new user
  const user = await User.create({
    fullName: fullname,
    email: email,
    password: password,
  });

  return res.redirect("/api/v1");
});

router.get("/logout", (req, res) => {
  return res.clearCookie("token").redirect("/api/v1/user/signin");
});

module.exports = router;
