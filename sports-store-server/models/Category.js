const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema({
  id: String,
  slug: String,
  name: {
    ru: String,
    en: String,
  },
  image: String,
  tag: String,
  icon: {
    type: { type: String },
    value: String,
  },
  targetGender: String,
  filters: [
    {
      name: String,
      type: String,
    },
  ],
  meta: {
    badge: String,
    sortWeight: Number,
    isHidden: Boolean,
  },
  analytics: {
    views: Number,
    clicks: Number,
    conversions: Number,
  },
  cta: {
    text: String,
    url: String,
    style: String,
  },
});

const CategorySchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  slug: { type: String, required: true },
  slugAuto: Boolean,
  name: {
    ru: String,
    en: String,
  },
  description: {
    ru: String,
    en: String,
  },
  image: String,
  icon: {
    type: { type: String },
    value: String,
  },
  filters: [
    {
      name: String,
      type: String,
    },
  ],
  categoryType: [String],
  role: String,
  seo: {
    title: String,
    description: String,
    keywords: [String],
    index: Boolean,
    canonical: String,
  },
  landingPageId: String,
  meta: {
    isFeatured: Boolean,
    isHidden: Boolean,
    sortPriority: Number,
    badgeColor: String,
    createdAt: Date,
    updatedAt: Date,
    priorityWeight: Number,
  },
  analytics: {
    views: Number,
    clicks: Number,
    conversions: Number,
    ctr: Number,
    avgTimeOnPage: Number,
  },
  subcategories: [SubcategorySchema],
}, { timestamps: true });

module.exports = mongoose.model("Category", CategorySchema);
