const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const homeStartingContent =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur cum vel doloremque aut ducimus fugit, possimus culpa dolor ea consectetur! Neque pariatur minus tenetur eos qui quas exercitationem voluptate, odio impedit quibusdam eligendi velit modi similique libero aspernatur quae quia beatae ex consequatur optio numquam! Optio odit voluptate necessitatibus asperiores.";
const aboutContent =
  "Lorem ipsum dolor, sit amet consectetur adipisicin........................................................................................................g elit. Illum ullam iure error ducimus pariatur accusamus saepe est aperiam hic quis natus, maiores illo fugit consequatur! Natus et explicabo non enim!";
const contactContent =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut illo doloremque iure, rem fugit labore quos quod eos incidunt laborum.";

let posts = [];

app.get("/", (req, res) => {
  let obj = {
    content: homeStartingContent,
    posts: posts,
  };
  res.render("home", obj);
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
  let post = {
    title: req.body.composeTitle,
    message: req.body.composeMessage,
  };
  posts.push(post);
  res.redirect("/");
});

app.get("/post/:postName", (req, res) => {
  let requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach((post) => {
    let storedTitle = _.lowerCase(post.title);
    if (storedTitle === requestedTitle) {
      console.log("Match found!");
      res.render("post", { post: post });
      return;
    }
  });
  // console.log("Not a valid post");
  res.redirect("/404");
});

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(3000, () =>
  console.log(
    "---------------------------------------------------------------------------------------------------\nServer starting on port 3000"
  )
);
