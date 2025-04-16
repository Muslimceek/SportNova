require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware should come BEFORE routes
app.use(cors());
app.use(express.json());

connectDB(); // Подключаем БД

// Routes
const productRoutes = require("./routes/product.routes");
const categoriesRoutes = require("./routes/categories");
const cartRoutes = require("./routes/cartRoutes");

app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoriesRoutes);

// Пример маршрута
app.get("/", (req, res) => {
  res.send("API работает 🟢");
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
