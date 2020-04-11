const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/product");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.post(
  "/addProduct",
  isAuthenticatedUser,
  authorizeRoles("employeer", "admin"),
  addProduct
);

router.get(
  "/getProduct",
  isAuthenticatedUser,
  authorizeRoles("employeer", "admin"),
  getProduct
);

router.put(
  "/editProduct/:id",
  isAuthenticatedUser,
  authorizeRoles("employeer", "admin"),
  editProduct
);

router.delete(
  "/deleteProduct/:id",
  isAuthenticatedUser,
  authorizeRoles("employeer", "admin"),
  deleteProduct
);

module.exports = router;
