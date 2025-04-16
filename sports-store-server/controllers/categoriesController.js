const Category = require("../models/Category");

// ➕ Создать категорию
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Ошибка создания категории:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// 📥 Получить все категории
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ "meta.sortPriority": 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// 📄 Получить по slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ error: "Категория не найдена" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✏️ Обновить категорию
exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Ошибка обновления" });
  }
};

// ❌ Удалить категорию
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: "Категория удалена" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка удаления" });
  }
};
