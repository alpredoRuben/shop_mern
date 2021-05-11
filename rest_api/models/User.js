const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Please enter your name"],
    maxLength: [30, "Your name cannot exceed 30 characters"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email"]
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Your password must be longer than 6 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  role: {
    type: String,
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

/** Encrypt Password Before Saving */
userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

/** Methods */
userSchema.methods = {
  getJwtToken: function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME
    })
  },

  comparePassword: async function(myPassword) {
    return await bcrypt.compare(myPassword, this.password);
  },

  getResetPasswordToken: function() {
    //generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //has and set to reset password
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //set token expire time
    this.resetPasswordExpire = Date.now() + 30 *  60 * 1000;

    return resetToken
  }
}

module.exports = mongoose.model('User', userSchema)