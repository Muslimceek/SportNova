const Product = require("../models/Product");

// ➕ Добавить товар
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Ошибка создания товара:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// 📥 Получить все товары
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// 📄 Получить товар по slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ error: "Товар не найден" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✏️ Обновить товар
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Ошибка обновления" });
  }
};

// ❌ Удалить товар
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: "Товар удалён" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка удаления" });
  }
};
