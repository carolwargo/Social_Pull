const mongoose = require("mongoose");

// VALIDATE user by id
const validateEmail = (email) => {
  const re = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  return re.test(email);
};

// DEFINE the User schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validateEmail, "Enter a valid email address"],
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Enter a valid email address']
    },
    thoughts: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
   
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// DEFINE the virtual field `friendCount` using the `get` function
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// CREATE the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
