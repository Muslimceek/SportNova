const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  color: String,
  size: String,
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true }
});

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String }, // или ObjectId, если есть Users
    items: [CartItemSchema],
    promoCode: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
