const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

router.post("/", authMiddleware, productController.addProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;