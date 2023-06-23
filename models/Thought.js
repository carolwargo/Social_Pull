const mongoose = require("mongoose");
const reactionSchema = require("./Reaction");

// THOUGHT schema
const thoughtSchema = new mongoose.Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJson: {
      virtuals: true,
    },
    id: false,
  }
);

// VIRTUAL field `reactionCount`
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// CREATE the Thought model
const Thought = mongoose.model("Thought", thoughtSchema);

module.exports = Thought;
