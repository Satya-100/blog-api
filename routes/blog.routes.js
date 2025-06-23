const { Router } = require("express");
const multer = require("multer");
const Blog = require("../models/blog.model");
const path = require("path");
const Comment = require("../models/comment.model");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads/"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.get("/add-blog", (req, res) => {
  return res.render("addBlog");
});

router.post("/add-blog", upload.single("coverImgUrl"), async (req, res) => {
  const blog = await Blog.create({
    title: req.body.title,
    content: req.body.content,
    coverImgUrl: `/uploads/${req.file.filename}`,
    author: req.user._id,
  });
  return res.redirect(`/api/v1/blog/${blog._id}`);
});

router.get("/:blogId", async (req, res) => {
  const blogId = req.params.blogId;
  const blog = await Blog.findById(blogId).populate("author");
  const comments = await Comment.find({ blogId: blogId }).populate("createdBy");

  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  return res.render("blog", {
    blog: blog,
    user: req.user,
    comments: comments,
  });
});

router.post("/comments/:blogId", async (req,res) => {
    await Comment.create({
        content: req.body.content,
        createdBy: req.user._id,
        blogId: req.params.blogId,
    });

    return res.redirect(`/api/v1/blog/${req.params.blogId}`);
})

module.exports = router;
