const express = require("express");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const { checkForAuth } = require("./middlewares/authentication");
const Blog = require("./models/blog.model");

const app = express();
const port = process.env.PORT || 3000;

// Connecting to MongoDB
const mongoose = require("mongoose");
const dbURI = process.env.MONGO_DB_URI;

if (!dbURI) {
  console.error("MONGO_DB_URI is not defined in the environment variables");
  process.exit(1);
}

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join("./views"));
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(checkForAuth("token"));

// Routes
app.get("/api/v1", async (req, res) => {
  const allBlogs = await Blog.find({});

  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

const userRoutes = require("./routes/user.routes");
app.use("/api/v1/user", userRoutes);

const blogRoutes = require("./routes/blog.routes");
app.use("/api/v1/blog", blogRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
