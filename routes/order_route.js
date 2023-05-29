const express = require("express");
const router = express.Router();
const authController = require("../controller/auth_controller");
const orderController = require("../controller/order_controller");

router.route("/success").get(orderController.success);
router.route("/checkout").post(authController.verifyToken, orderController.checkout);

module.exports = router;
