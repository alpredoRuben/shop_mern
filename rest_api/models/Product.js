const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    maxlength: [5, 'Product name cannot exceed 5 characters'],
    default: 0.0
  },
  description: {
    type: String,
    required: [true, 'Please enter product description'],
  },
  ratings: {
    type: Number,
    default: 0
  },
  images:[
    {
      product_Id: {type: String, required: true},
      url: {type: String, required: true},
    }
  ],
  category: {
    type: String,
    required: [true, 'Please select this category for this products'],
    enum: {
      values: [
        'Electronics',
        'Camera',
        'Laptop',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Sports',
        'Outdoor',
        'Home'
      ],
      message: `Please select correct category for product`
    }
  },
  seller: {
    type: String,
    required: [true, 'Please enter product seller']
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    maxLength: [5, 'Product name cannot exceed 5 characters'],
    default: 0
  },
  numOfReview: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      name: {type: String, required: true},
      rating: {type: Number, required: true},
      comment: {type: String, required: true},
      
    }
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);