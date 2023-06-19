const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');

// DEFINE the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/ // Email validation using regex pattern
  },
  thoughts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thought'
  }],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// DEFINE the virtual field `friendCount` using the `get` function
userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// CREATE the User model
const User = mongoose.model('User', userSchema);

module.exports = User;


//UserSchema file for virtual FRIEND COUNT code 
/*
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // User fields
  // ...

  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

const User = mongoose.model('User', userSchema);

module.exports = User;

*/
