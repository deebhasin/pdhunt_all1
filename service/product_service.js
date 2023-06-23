const AuthError = require("../errors/autherror");
const Product = require("../model/product");

const createProduct = async (product) => {
  console.log("In createProduct ", product);
  await product.save();
  return product.id;
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  return product;
};

const upvote = async (productId, userId) => {
  const product = await getProductById(productId);
  await product.upvote(userId);
};

const addComment = async (productId, text, createdBy) => {
  const product = await getProductById(productId);
  await product.addComment(text, createdBy);
};

const addTag = async (productId, tag, loggedInUserId) => {
  const product = await getProductById(productId);
  console.log("In addTag ", product, tag, loggedInUserId);

  if (loggedInUserId.toString() !== product.createdBy.toString()) {
    throw new AuthError("You are not authorized to add tag");
  }

  await product.addTag(tag);
};

const getProducts = async () => {
  const products = await Product.find();
  return products;
};

module.exports = { createProduct, getProductById, upvote, addComment, addTag, getProducts };
