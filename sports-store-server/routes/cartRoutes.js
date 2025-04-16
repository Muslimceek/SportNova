// 📁 routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// ✅ Получить корзину пользователя
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (error) {
    res.status(500).json({ error: "Ошибка получения корзины" });
  }
});

// ✅ Добавить или обновить товар в корзине
router.post("/add", async (req, res) => {
  const { userId, productId, color, size, quantity, price } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingItem = cart.items.find(
      (item) =>
        item.productId === productId &&
        item.color === color &&
        item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, color, size, quantity, price });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Ошибка добавления товара в корзину" });
  }
});

// ✅ Удалить товар из корзины
router.post("/remove", async (req, res) => {
  const { userId, productId, color, size } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Корзина не найдена" });

    cart.items = cart.items.filter(
      (item) =>
        !(item.productId === productId &&
          item.color === color &&
          item.size === size)
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Ошибка удаления товара" });
  }
});

// ✅ Очистить корзину
router.post("/clear", async (req, res) => {
  const { userId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Корзина не найдена" });

    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Ошибка очистки корзины" });
  }
});

module.exports = router;
