const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter the Product Name"],
  },
  category: {
    type: String,
    enum: {
      values: ["Man", "Woman", "Kid"],
      message: "Please select Categorie",
    },
  },
  subCategory: {
    type: String,
    enum: {
      values: [
        "Clothing",
        "Footwear",
        "Watches",
        "Bags",
        "Sunglasses",
        "Accessories",
        "Sportswear",
      ],
      message: "Please select subCategorie",
    },
  },
  brand: {
    type: String,
    required: [true, "Please Enter the Brand Name"],
  },
  model: {
    type: String,
  },
  specification: {
    type: String,
    required: [true, "Please Enter the Specifications of Products"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter the Price of Product"],
  },
  quantity: {
    type: Number,
    required: [true, "Please Enter the Quanity of Product"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
