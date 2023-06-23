// REACTION schema  THOUGHTS model
const { Schema, Types } = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    reactionId: {
      type: mongoose.Schema.Types.ObjectId,

      // GENERATES a new ObjectId by default for each reaction
      default: () => new mongoose.Types.ObjectId(),
    },

    // LIMITS reaction body  to 280 characters
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },

    // REQUIRES username for reaction
    username: {
      type: String,
      required: true,
    },

    // SETS default value of createdAt field to the current timestamp
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
  },

  {
    // GETTER is applied to createdAt to format date using dateFormat function
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

module.exports = reactionSchema;
