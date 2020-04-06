const Product = require("../models/product");
const asyncError = require("../middlewares/asyncError");
const errorHandler = require("../utils/errorHandler");
const APIFilters = require("../utils/filter");

exports.addProduct = asyncError(async (req, res, next) => {
  const {
    name,
    category,
    subCategory,
    brand,
    model,
    specification,
    price,
    quantity,
  } = req.body;

  const product = await Product.create({
    name,
    category,
    subCategory,
    brand,
    model,
    specification,
    price,
    quantity,
    userId: req.user.id,
  });

  res.json({
    status: "Success",
    message: "Product added Successfull",
    data: product,
  });
});

exports.getProduct = asyncError(async (req, res, next) => {
  const apiFilters = new APIFilters(Product.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();
  const products = await apiFilters.query;
  res.json({
    status: "Success",
    message: "List of products",
    count: products.length,
    data: products,
  });
});

// exports.getProduct = asyncError(async (req, res, next) => {
//   const products = Product.find().populate("User");
//   res.json({
//     status: "Success",
//     message: "List of products",
//     count: products.length,
//     data: products,
//   });
// });

exports.editProduct = asyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) next(new errorHandler("Product not found", 500));

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.json({
    status: "Success",
    message: "Product Edited Successfull",
    data: product,
  });
});

exports.deleteProduct = asyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) next(new errorHandler("Product not found", 500));

  product = await Product.deleteOne({ _id: req.params.id });

  res.json({ status: "Success", message: "Product Deleted" });
});
