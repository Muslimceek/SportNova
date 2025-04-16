const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");

router.post("/", controller.createProduct);
router.get("/", controller.getAllProducts);
router.get("/:slug", controller.getProductBySlug);
router.put("/:slug", controller.updateProduct);
router.delete("/:slug", controller.deleteProduct);

module.exports = router;
