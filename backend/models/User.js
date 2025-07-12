const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Never return password in queries
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  reputation: {
    type: Number,
    default: 0,
    min: [0, 'Reputation cannot be negative']
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [200, 'Bio cannot exceed 200 characters'],
    default: ''
  },
  website: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: 'Please provide a valid URL'
    },
    default: ''
  },
  location: {
    type: String,
    maxlength: [50, 'Location cannot exceed 50 characters'],
    default: ''
  },
  banned: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  socialLinks: {
    github: String,
    twitter: String,
    linkedin: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate questions
UserSchema.virtual('questions', {
  ref: 'Question',
  foreignField: 'author',
  localField: '_id'
});

UserSchema.virtual('answers', {
  ref: 'Answer',
  foreignField: 'author',
  localField: '_id'
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.pre(/^find/, function(next) {
  if (this._conditions._id) {
    this.model.updateOne(
      { _id: this._conditions._id },
      { $set: { lastActive: Date.now() } }
    ).exec();
  }
  next();
});

UserSchema.pre('remove', async function(next) {
  await this.model('Question').deleteMany({ author: this._id });
  await this.model('Answer').deleteMany({ author: this._id });
  next();
});

module.exports = mongoose.model('User', UserSchema);