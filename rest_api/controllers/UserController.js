
const User = require('../models/User');

/** Use Middleware */
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

/** Use Utils */
const ErrorHandler = require('../utils/errorHandlers');

const UserController = {

  /** @ALL_USER */
  allUser: catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    return res.status(200).json({ 
      success: true,
      users,
    })
  }),

  /** @SHOW_DETAIL_USER */
  show: catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
      return next(new ErrorHandler(`User does not found with id: ${req.params.id}`));
    }

    return res.status(200).json({
      success: true,
      user,
    });
  }),


  /** @UPDATE_DETAIL_USER  */
  update: catchAsyncErrors(async (req, res, next) => {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUser, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    return res.status(200).json({
      success: true,
      message: 'Update user successfully',
    });
  }),

  /** @UPDATE_DETAIL_USER  */
  delete: catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
      return next(new ErrorHandler(`User does not found with id ${req.params.id}`));
    }

    await user.remove()

    return res.status(200).json({
      success: true,
      message: 'Delete user successfully',
    });
  }),
  
  /** @SHOW_PROFILE */
  showProfile: catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    return res.status(200).json({
      success: true,
      user
    })
  }),

  /** @UPDATE_PROFILE */
  updateProfile: catchAsyncErrors(async (req, res, next) => {
    const updateUser = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, updateUser, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    return res.status(200).json({
      success: true,
      message: 'Update profile successfully'
    });
  }),

  
}

module.exports = UserController;