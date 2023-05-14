const Tag = require("../model/tag");
const tagService = require("../service/tag_service");
const ValidationError = require("../errors/validation_error");
const mongoose = require("mongoose");

const handleErrors = (error, next) => {
  console.log("In handleAuthErrors ");
  if (error instanceof mongoose.Error.ValidationError) {
    next(new ValidationError(error.message));
  } else {
    next(error);
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    let tag = new Tag({ name, description });
    console.log("In POST user " + tag);
    await tagService.createTag(tag);

    res.status(201).send({ message: "Tag created successfully" });
  } catch (error) {
    console.log("error in Tag create  ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tags = await tagService.getAllTags();
    console.log("tags are " + tags);

    res.status(200).send(tags);
  } catch (error) {
    // console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.getTagById = async (req, res) => {
  try {
    const tag = await tagService.getTagById(req.params.id);
    console.log("tag " + tag);
    if (!tag) {
      throw new Error("Tag not found");
    }
    res.status(200).send(tag);
  } catch (error) {
    console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};
