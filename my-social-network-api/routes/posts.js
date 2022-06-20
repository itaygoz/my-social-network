const fs = require("fs");
const uplaod = require("../middleware/upload");
const winston = require("winston");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const { Post, validate } = require("../models/post");
const { User } = require("../models/user");
const Joi = require("@hapi/joi");
const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find().where({ isPrivate: false }).sort("-date");
  res.send(posts);
});

router.get("/:id/images", async (req, res) => {
  const post = await Post.findById(req.params.id).select("images");
  if (!post)
    return res.status(404).send("The post with the given ID was not found");
  res.send(post.images);
});

router.get("/me", auth, async (req, res) => {
  const posts = await Post.find({ "user._id": req.user._id }).sort("-date");
  if (!posts) return res.status(404).send("User does not have any posts");
  res.send(posts);
});

router.get("/user/:userId", async (req, res) => {
  const user = User.findById(req.params.userId);
  if (!user) return res.status(404).send("User does not exist");

  const posts = await Post.find({ "user._id": req.params.userId })
    .where({ isPrivate: false })
    .sort("-date");
  if (_.isEmpty(posts))
    return res.status(400).send("User does not have any posts");

  res.send(posts);
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id)
    .where({ isPrivate: false })
    .sort("-date");
  if (!post)
    return res.status(404).send("The post with the given ID was not found");
  res.send(post);
});

router.post("/", auth, uplaod.array("images", 6), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("There is no user with the give id.");

  const post = new Post({
    content: req.body.content,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    isPrivate: req.body.isPrivate,
  });

  if (req.files) {
    req.files.forEach((file) => {
      const img = fs.readFileSync(file.path);
      const encode_image = img.toString("base64");

      post.images.push({
        name: file.originalname,
        data: new Buffer.from(encode_image, "base64"),
        contentType: file.mimetype,
      });
      fs.unlink(file.path, () =>
        winston.info("File uploaded to db & deleted from storage succefully")
      );
    });
  }

  const result = await post.save();
  res.send(result);
});

router.post("/comment/:id", auth, async (req, res) => {
  const { error } = validateComment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const post = await Post.findById(req.params.id);
  if (!post)
    return res.status(404).send("The post with the given ID was not found");

  const user = await User.findById(req.user._id).select("firstName lastName");
  if (!post) return res.status(400).send("The user is not valid!");

  post.comments.unshift({
    user: {
      _id: req.user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    content: req.body.content,
  });

  const date = new Date();

  await post.save();
  res.send({
    user: {
      _id: req.user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    content: req.body.content,
    date: date.toISOString(),
  });
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const post = await Post.findById(req.params.id);
  if (!post)
    return res.status(404).send("The post with the given ID was not found");

  if (req.user._id != post.user._id && !req.user.isAdmin)
    return res.status(403).send("Cannot update someone else post");

  post.set({
    content: req.body.content,
    isPrivate: req.body.isPrivate,
    lastUpdated: Date.now(),
  });

  res.send(await post.save());
});

router.put("/isPrivate/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id).select(
    "user isPrivate last update"
  );
  if (!post)
    return res.status(404).send("The post with the given ID was not found");
  if (req.user._id != post.user._id)
    return res.status(400).send("Can't delete this post");

  post.set({
    isPrivate: !post.isPrivate,
    lastUpdated: Date.now(),
  });

  res.send(await post.save());
});

router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post)
    return res.status(404).send("The post with the given ID was not found");

  if (req.user._id != post.user._id && !req.user.isAdmin)
    return res.status(403).send("Cannot update someone else post");

  res.send(await Post.findByIdAndDelete(post._id));
});

function validateComment(body) {
  const schema = Joi.object({
    content: Joi.string().min(2).max(2000).required(),
  });

  return schema.validate(body);
}

module.exports = router;
