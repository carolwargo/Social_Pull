const { ObjectId } = require('mongoose').Types;
const { Thought, User, Reaction } = require('../models');

// AGGREGATE FUNCTION to get the reactions to a thought of a friend
const getReactions = async (friendId, thoughtId) => {
  const reactions = await Reaction.aggregate([
    { $match: { thoughtId: new ObjectId(thoughtId) } },
    { $match: { userId: new ObjectId(friendId) } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $project: {
        _id: 1,
        reactionType: 1,
        user: { $arrayElemAt: ['$user', 0] }
      }
    }
  ]);
  
  return reactions;
};

module.exports = {

  // GET ALL thoughts async
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.status(200).json(thoughts);
    } 
    catch (err) {
      res.status(500).json(err);
    }
  },

  // GET SINGLE thought by id
  getThought(req, res) {
    Thought.find({})
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  
  // CREATE thought
  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No User found with this ID!" });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  // UPDATE single thought by id
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, New: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: "No thought found with this ID!" });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE single thought by id
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: "No thought found with this ID!" });
        } else {
          return User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
          ).then(() => thought);
        }
      })
      .then((thought) => {
        res.json({ message: `Thought ${thought._id} successfully deleted` });
      })
      .catch((err) => res.status(500).json(err));
  },

  async addThoughtReaction(req, res) {
    try {
      const { thoughtId } = req.params;
      const { reactionBody, username } = req.body;

      const updatedThought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $push: { reactions: { reactionBody, username } } },
        { new: true }
      ).exec();

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought with that ID was found' });
      }

      res.status(200).json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE Reaction from a thought by specific Thought id and Reaction id
  async removeThoughtReaction(req, res) {
    try {
      const { thoughtId, reactionId } = req.params;

      const updatedThought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $pull: { reactions: { _id: reactionId } } },
        { new: true }
      ).exec();

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought or reaction with that ID was found' });
      }

      res.status(200).json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getReactions
};