const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT ?? 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose
  .connect("mongodb://localhost:27017/blogDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error(err));

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const Post = mongoose.model("Post", postSchema);

const aboutContent =
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum ullam iure error ducimus pariatur accusamus saepe est aperiam hic quis natus, maiores illo fugit consequatur! Natus et explicabo non enim!";
const contactContent =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut illo doloremque iure, rem fugit labore quos quod eos incidunt laborum.";

let posts = [];

app.get("/", (req, res) => {
  Post.find({}, (err, foundPosts) => {
    if (err) {
      console.error(err);
    } else {
      let obj = {
        posts: foundPosts,
      };
      // console.log(foundPosts);
      res.render("home", obj);
    }
  });
});

app.get("/about", (req, res) => {
  let obj = {
    content: aboutContent,
  };
  res.render("about", obj);
});

app.get("/contact", (req, res) => {
  let obj = {
    content: contactContent,
  };
  res.render("contact", obj);
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.composeTitle,
    body: req.body.composeMessage,
  });

  post.save((err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Successfully saved new blog post into DB");
    }
    res.redirect("/");
  });
});

app.get("/post/:postId", (req, res) => {
  const postId = req.params.postId;

  Post.findById(postId, (err, foundList) => {
    if (err) {
      console.error(err);
      res.redirect("/404");
    } else {
      console.log("Successfully found requested post!");
      res.render("post", { post: foundList });
    }
  });
});

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(PORT, () =>
  console.log(
    `---------------------------------------------------------------------------------\nServer starting on port ${PORT}`
  )
);
