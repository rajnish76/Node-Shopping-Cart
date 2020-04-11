const express = require("express");
const router = express.Router();

const {
  registerUser,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgetPassword,
  forgetChangePassword,
  userList,
} = require("../controllers/user");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.post("/register", registerUser);

router.post("/login", login);

router.get("/profile", isAuthenticatedUser, getProfile);

router.post("/updateProfile", isAuthenticatedUser, updateProfile);

router.put("/changePassword", isAuthenticatedUser, changePassword);

router.post("/forgotPassword", forgetPassword);

router.put("/password/reset/:token", forgetChangePassword);

router.get("/userList", isAuthenticatedUser, authorizeRoles("admin"), userList);

module.exports = router;
