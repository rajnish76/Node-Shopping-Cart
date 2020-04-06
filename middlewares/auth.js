const jwt = require("jsonwebtoken");
const User = require("../models/user");
const catchAsyncError = require("./asyncError");
const errorHandler = require("../utils/errorHandler");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new errorHandler("Token not exists", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorHandler(
          `Role(${req.user.role}) is not allowed to use this resource.`,
          403
        )
      );
    }
    next();
  };
};
