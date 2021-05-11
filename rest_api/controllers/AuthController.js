const {v4} = require('uuid');
const crypto = require('crypto');
const User = require('../models/User');

/** Use Middleware */
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

/** Use Utils */
const ErrorHandler = require('../utils/errorHandlers');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');

const AuthController = {
  /** @REGISTER */
  registerUser: catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      avatar : {
        public_id: `${v4()}_${new Date(Date.now()).getFullYear()}`,
        url: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'
      }
    });

    sendToken(user, 200, res);
  }),

  /** @LOGIN */
  loginUser: catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }

    //Check user by email in database
    const user = await User.findOne({ email }).select('+password');

    if(!user) {
      return next(new ErrorHandler("Invalid Your Email or Password", 401));
    }

    //Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res);
  }),

  /** @LOGOUT */
  logout: catchAsyncErrors(async (req, res, next) => {
    res.cookies('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true
    });

    return res.status(200).json({
      success: true,
      message: "Logout successfully"
    })
  }),

  /** @FORGOT_PASSWORD */
  forgotPassword: catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
      return next(new ErrorHandler("User not found with this email", 404))
    }

    //Get Reset Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false }); 

    //Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow : \n\n ${resetUrl} \n\n. If you have not requested this email, then ignore it`;

    try {
      
      await sendEmail({
        email: user.email,
        subject: 'SHOP-IT Password Recovery',
        message
      });

      return res.status(200).json({
        success: true,
        message: `Reset password sent to email ${user.email}`
      })

    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500));
    }

  }),

  /** @RESET_PASSWORD */
  resetPassword: catchAsyncErrors(async (req, res, next) => {
    console.log("Params Token", req.params.token);

    //Has url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    console.log("Params Token", req.params.token);
    console.log("Token Reset", resetPasswordToken)
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {$gt: Date.now()}
    });

    console.log("User", user);

    if(!user) {
      return next(new ErrorHandler("Password reset token is invalid or has been expired"))
    }

    if(req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not match", 400));
    }

    //Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200, res);
  }),

  /** @UPDATE_PASSWORD */
  updatePassword: catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);

    if(!isMatched) {
      return next(new ErrorHandler("Old password is incorrect"))
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);

  }),
}

module.exports = AuthController;