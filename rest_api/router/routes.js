const router = require('express').Router();

/** Use Middleware */
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth');

/** Use Controller */
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const ProductController = require('../controllers/ProductController');


/** Auth Routing */
router.route('/auth/register').post(AuthController.registerUser);
router.route('/auth/login').post(AuthController.loginUser);
router.route('/forgot/password').get(AuthController.forgotPassword);
router.route('/password/reset/:token').put(AuthController.resetPassword);

//After Login
router.route('/password/update').put(isAuthenticatedUser, AuthController.updatePassword);
router.route('/auth/logout').get(isAuthenticatedUser, AuthController.logout);

/** User Routing */
router.route('/users').get(isAuthenticatedUser, authorizeRoles('admin'), UserController.allUser);
router.route('/user/:id')
  .get(isAuthenticatedUser, UserController.showProfile)
  .put(isAuthenticatedUser, authorizeRoles('admin'), UserController.update)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), UserController.delete);

router.route('/user/show/profile').get(isAuthenticatedUser, UserController.showProfile);
router.route('/users/update/profile').post(isAuthenticatedUser, UserController.updateProfile);

/** Product Routing */
router.route('/products').get(isAuthenticatedUser, ProductController.getAll);
router.route('/products/:id').get(isAuthenticatedUser, ProductController.show);
router.route('/products').post(isAuthenticatedUser, authorizeRoles(['admin']), ProductController.store);
router.route('/products/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), ProductController.update)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), ProductController.delete);

module.exports = router;