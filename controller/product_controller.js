const Product = require("../model/product");
const productService = require("../service/product_service");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, icon, images, url, shortDesc } = req.body;
    const user = req.loggedInUser;
    if (!user) {
      throw new Error("User not found");
    }
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
    console.log("error in product create  ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.vote = async (req, res) => {
  try {
    await productService.upvote(req.params.id, req.loggedInUser._id);

    res.status(200).send({ message: "Product voted successfully" });
  } catch (error) {
    // console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    await productService.addComment(req.params.id, req.body.text, req.loggedInUser._id);

    res.status(200).send({ message: "Comment added successfully" });
  } catch (error) {
    // console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.addTag = async (req, res) => {
  try {
    console.log("req.body.tag, logged in user ", req.body.tag, req.loggedInUser._id);
    await productService.addTag(req.params.id, req.body.tag, req.loggedInUser._id);

    res.status(200).send({ message: "Tag added successfully" });
  } catch (error) {
    // console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};

// exports.getTagById = async (req, res) => {
//   try {
//     const tag = await tagService.getTagById(req.params.id);
//     console.log("tag " + tag);
//     if (!tag) {
//       throw new Error("Tag not found");
//     }
//     res.status(200).send(tag);
//   } catch (error) {
//     console.log("error in user post ", error);
//     res.status(400).send({ message: error.message });
//   }
// };
