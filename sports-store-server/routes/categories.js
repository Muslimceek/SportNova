const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoriesController");

router.post("/", controller.createCategory);
router.get("/", controller.getAllCategories);
router.get("/:slug", controller.getCategoryBySlug);
router.put("/:slug", controller.updateCategory);
router.delete("/:slug", controller.deleteCategory);

module.exports = router;
