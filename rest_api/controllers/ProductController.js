const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorHandlers');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/APIFeatures')

const ProductController = {

   /** @ALL_PRODUCT */
   getAll:  catchAsyncErrors(async (req, res, next) => {
    const page = 4;
    const productCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(page);

    const products = await apiFeatures.query;
    return res.status(200).json({ 
      success: true, 
      count: products.length,
      productCount,
      products,  
    });
  }),

  /** @CREATE_NEW_PRODUCT */
  store: catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    if(!product) {
      return next(new ErrorHandler("Product failed created", 400));
    }
    return res.status(200).json({ success: true, product});
  }),

 
  /** @SHOW_PRODUCT */
  show: catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
      
    if(!product) {
      return next(new ErrorHandler("Product Not Found", 400));
    }

    return res.status(200).json({ success: true, product });
  }),

  /** @UPDATE_PRODUCT */
  update: catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
      return next(new ErrorHandler("Product Not Found", 400));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })

    return res.status(200).json({ success: true, product });
  }),

  /** @DELETE_PRODUCT */
  delete: catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
      return next(new ErrorHandler("Product Not Found", 404));
    }

    await product.remove();
    return res.status(200).json({ success: true, message: "Product is deleted" })
  }),
}

module.exports = ProductController;