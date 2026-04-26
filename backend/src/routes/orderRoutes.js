const express = require("express");
const router = express.Router(); 
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

console.log("Контроллер заказов:", orderController);

router.use(authMiddleware);

router.post("/", orderController.createOrder);

router.get("/", orderController.getMyOrders);

module.exports = router;