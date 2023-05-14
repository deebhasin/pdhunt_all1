const express = require("express");
const router = express.Router();

const { createTag, getAllTags, getTagById } = require("../controller/tag_controller");
const { verifyToken } = require("../controller/auth_controller");
// router.route("/").post(createUser);
router.route("/").post(verifyToken, createTag).get(verifyToken, getAllTags);
router.route("/:id").get(verifyToken, getTagById);

module.exports = router;
