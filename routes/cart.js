const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  deleteCartItem,
  getOrder,
  orderList,
} = require("../controllers/cart");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.put("/addToCart/:id", isAuthenticatedUser, addToCart);

router.get("/getCart", isAuthenticatedUser, getCart);

router.post("/deleteCartItem/:id", isAuthenticatedUser, deleteCartItem);

router.get("/getOrder", isAuthenticatedUser, getOrder);

router.get("/orderList", isAuthenticatedUser, orderList);

module.exports = router;
