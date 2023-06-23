const mongoose = require("mongoose");
const Product = require("../model/product");
const productService = require("../service/product_service");
const ValidationError = require("../errors/validation_error");

const handleErrors = (error, next) => {
  console.log("In handleErrors product ");
  if (error instanceof mongoose.Error.ValidationError) {
    next(new ValidationError(error.message));
  } else {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    res.status(200).send(products);
  } catch (error) {
    handleErrors(error, next);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, icon, images, url, shortDesc } = req.body;
    const user = req.loggedInUser;

    const product = new Product({
      name,
      description,
      icon,
      images,
      url,
      shortDesc,
      createdBy: user._id,
      updatedBy: user._id,
    });
    // console.log("In POST user " + tag);
    await productService.createProduct(product);

    res.status(201).send({ message: "Product created successfully" });
  } catch (error) {
    handleErrors(error, next);
  }
};

exports.vote = async (req, res, next) => {
  try {
    await productService.upvote(req.params.id, req.loggedInUser._id);

    res.status(200).send({ message: "Product voted successfully" });
  } catch (error) {
    handleErrors(error, next);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    await productService.addComment(req.params.id, req.body.text, req.loggedInUser._id);

    res.status(200).send({ message: "Comment added successfully" });
  } catch (error) {
    handleErrors(error, next);
  }
};

exports.addTag = async (req, res, next) => {
  try {
    console.log("req.body.tag, logged in user ", req.body.tag, req.loggedInUser._id);
    await productService.addTag(req.params.id, req.body.tag, req.loggedInUser._id);

    res.status(200).send({ message: "Tag added successfully" });
  } catch (error) {
    handleErrors(error, next);
  }
};
