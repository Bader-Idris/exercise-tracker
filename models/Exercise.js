const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    auto: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a valid Id'],
  },
  username: {
    type: String,
    ref: 'User',
  },
  description: {
    type: String,
    required: [true, 'Please provide a valid description'],
  },
  duration: {
    type: Number,
    required: [true, 'Please provide minutes numeral input'],
    validate: {
      validator: function (value) {
        return Number.isInteger(value) && value >= 0;
      },
      message: 'Please provide a valid duration in minutes',
    },
    set: function (value) {
      return Math.floor(value);
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
});

exerciseSchema.pre('save', async function (next) {
  try {
    if (!this.createdBy || !mongoose.Types.ObjectId.isValid(this.createdBy)) {
      throw new Error('Please provide a valid _id');
    }
    // Populate the username field, same as sql joins
    const user = await mongoose.model('User').findById(this.createdBy).select('username');
    if (!user) {
      throw new Error('User not found');
    }
    this.username = user.username;
    next();
  } catch (error) {
    next(error);
  }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = { Exercise }