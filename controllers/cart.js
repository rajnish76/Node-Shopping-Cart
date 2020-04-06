const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");
const asyncError = require("../middlewares/asyncError");
const errorHandler = require("../utils/errorHandler");

exports.addToCart = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const product = await Product.findById(req.params.id);

  if (!product) next(new errorHandler("Product is not Found", 500));

  const data = await user.addToCart(product);

  res.json({ data });
});

exports.getCart = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  res.json({ data: user.cart });
});

exports.deleteCartItem = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const product = await Product.findById(req.params.id);

  if (!product) next(new errorHandler("Product is not Found", 500));

  const data = await user.removeToCart(req.params.id);

  res.json({ data });
});

exports.getOrder = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const products = user.cart.items.map((i) => {
    return { quantity: i.quantity, productId: i.productId };
  });
  const order = new Order({
    user: {
      name: req.user.name,
      userId: req.user.id,
    },
    products: products,
  });
  order.save();

  await user.clearCart();

  res.json({ order });
});

exports.orderList = asyncError(async (req, res, next) => {
  const orderList = await Order.find({ "user.userId": req.user.id });
  res.json({ status: "Success", data: orderList });
});
