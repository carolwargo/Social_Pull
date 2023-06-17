//NOTE: REASONING FOR CODE
/*
The User schema is defined with the required fields: username, email, thoughts, and friends.
The username field is of type String, unique, required, and trimmed.
The email field is of type String, required, unique, and validated using a regular expression pattern for matching valid email addresses.
The thoughts field is an array of _id values referencing the Thought model.
The friends field is an array of _id values referencing the User model, allowing for self-referencing relationships.
The virtual field friendCount is defined using the get function to return the length of the friends array field.
You can use this User schema in your Express and MongoDB application to create, update, and query user data while leveraging the defined schema and virtual fields.
*/

const mongoose = require('mongoose');

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
