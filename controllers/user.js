const User = require("../models/user");
const Product = require("../models/product");
const asyncError = require("../middlewares/asyncError");
const errorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.registerUser = asyncError(async (req, res, next) => {
  const { name, email, password, role, phoneNo } = req.body;
  const user = await User.create({ name, email, password, role, phoneNo });

  const token = user.jwtToken();
  res.json({
    status: "Success",
    message: "Registration Successfull",
    data: user,
    token,
  });
});

exports.login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorHandler("Please enter Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(
      new errorHandler("Please Enter Correct Email and Password", 403)
    );
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new errorHandler(" Please Enter Correct password", 401));
  }

  const token = user.jwtToken();
  res.json({
    status: "Success",
    message: "Login Successfull",
    data: user,
    token,
  });
});

exports.getProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.json({
    status: "Success",
    data: user,
  });
});

exports.updateProfile = asyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phoneNo: req.body.phoneNo,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.json({
    status: "Success",
    data: user,
    message: "Profile updation successfull",
  });
});

exports.changePassword = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(
    req.body.currentPassword
  );

  if (!isPasswordMatched) {
    return next(new errorHandler("Password is Incorrect", 403));
  }

  user.password = req.body.newPassword;
  user.save();

  res.json({
    status: "Success",
    message: "Password is Changed Successfully",
  });
});

exports.forgetPassword = asyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new errorHandler("Email is not Registered", 403));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //Create Reset password URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset link is as follow:\n\n${resetUrl}\n\n If you have not request this, then please ignore that.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Jobbee-API Password Recovery",
      message: message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent successfully to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new errorHandler("Email is not sent.", 500));
  }
});

exports.forgetChangePassword = asyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Password Reset Token is invalid", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = user.jwtToken();

  res.json({
    status: "Success",
    message: "Password Updation Successfull",
    token,
  });
});

exports.userList = asyncError(async (req, res, next) => {
  const users = await User.find();
  res.json({
    status: "Success",
    message: "List of users",
    count: users.length,
    data: users,
  });
});


