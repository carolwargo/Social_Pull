//NOTES: REASONING FOR CODE 
/*
The Thought schema is defined with the required fields: thoughtText, createdAt, username, and reactions.
The thoughtText field is of type String, required, and should be between 1 and 280 characters in length.
The createdAt field is of type Date, and its default value is set to the current timestamp using Date.now(). A getter method is defined to format the timestamp on query.
The username field represents the user that created the thought and is of type String and required.
The reactions field is an array of nested documents created with the reactionSchema, which is defined separately.
The virtual field reactionCount is defined to retrieve the length of the thought's reactions array field on query.
You can use this Thought schema in your Express and MongoDB application to create, update, and query thought data while leveraging the defined schema and virtual fields.

Make sure you have Mongoose and MongoDB set up in your project, and use the Thought model wherever you need to interact with thought data.
*/

//CODE FOR REACTION schema

/*
const mongoose = require('mongoose');
const reactionSchema = require('../schemas/ReactionSchema');

const thoughtSchema = new mongoose.Schema({
  // Main fields of the Thought model
  // ...
  reactions: [reactionSchema]
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
*/

//MAIN CODE (integrate reaction schema)
const mongoose = require('mongoose');

//NEED CODE TO ADD thoughtSchema
/*
const thoughtSchema = require('../schemas/ThoughtSchema');
const Thought = mongoose.model('Thought', thoughtSchema);
*/
// REACTION schema
const reactionSchema = new mongoose.Schema({
  reactionBody: {
    type: String,
    required: true,
    maxLength: 280
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: timestamp => dateFormat(timestamp)
  }
});

// THOUGHT schema
const thoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: timestamp => dateFormat(timestamp)
  },
  username: {
    type: String,
    required: true
  },
  reactions: [reactionSchema]
});

// VIRTUAL field `reactionCount`
thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

// CREATE the Thought model
const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;

