const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandlers');

/** Check if user is authenticated or not */
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const {token} = req.cookies;

  if(!token) {
    return next(new ErrorHandler("Login first to access this resources.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();

});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role (${req.user.role}) is not allowed to access this module`)
      );
    }

    next();
  }
}