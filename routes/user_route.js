const express = require("express");
const router = express.Router();
const { createUser, getUserByEmail, getAllUsers } = require("../controller/user_controller");
const authController = require("../controller/auth_controller");
// router.route("/").post(createUser);
router.route("/").post(authController.verifyToken, authController.authorize(["admin", "manager"]), getUserByEmail);
router.route("/").get(getAllUsers);
module.exports = router;
