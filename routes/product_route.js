const express = require("express");
const router = express.Router();

const productController = require("../controller/product_controller");
const { verifyToken } = require("../controller/auth_controller");

router.route("/").get(productController.getProducts);
router.route("/").post(verifyToken, productController.createProduct);

router.route("/:id/vote").patch(verifyToken, productController.vote);
router.route("/:id/comment").post(verifyToken, productController.addComment);
router.route("/:id/tag").patch(verifyToken, productController.addTag);

module.exports = router;
