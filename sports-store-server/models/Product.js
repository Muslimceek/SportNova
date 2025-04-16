const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  slug: { type: String, required: true },
  brand: { type: String, required: true },
  category: {
    id: String,
    slug: String,
    name: {
      ru: String,
      en: String,
    },
  },
  subcategory: {
    id: String,
    slug: String,
    name: {
      ru: String,
      en: String,
    },
  },
  gender: String,
  ageGroup: String,
  name: {
    ru: String,
    en: String,
  },
  description: {
    ru: String,
    en: String,
  },
  features: mongoose.Schema.Types.Mixed,
  options: {
    colors: [String],
    sizes: [String],
  },
  media: {
    imagesByColor: mongoose.Schema.Types.Mixed,
    additionalImagesByColor: mongoose.Schema.Types.Mixed,
    fallbackImage: String,
  },
  pricing: {
    currency: String,
    basePrice: Number,
    minPrice: Number,
    variants: [
      {
        color: String,
        size: String,
        price: Number,
        stock: Number,
        sku: String,
      },
    ],
  },
  promotions: [mongoose.Schema.Types.Mixed],
  logistics: mongoose.Schema.Types.Mixed,
  availability: {
    status: String,
    isPreorder: Boolean,
    restockDate: Date,
  },
  rating: {
    average: Number,
    count: Number,
  },
  analytics: {
    views: Number,
    cartAdds: Number,
    purchases: Number,
  },
  relations: {
    relatedProductIds: [String],
    upsellProductIds: [String],
    accessories: [String],
  },
  meta: {
    new: Boolean,
    bestseller: Boolean,
    tags: [String],
  },
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
