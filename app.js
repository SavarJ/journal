const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const PORT = process.env.PORT ?? 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const url = process.env.DB_URL;
mongoose
  .connect(url, {
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
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
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

app.post("/delete", (req, res) => {
  const postId = req.body.postId;

  Post.findByIdAndDelete(postId, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Post successfully deleted!");
    }
    res.redirect("/");
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
