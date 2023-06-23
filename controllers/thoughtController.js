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
  async getThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');
  
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
  
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  // CREATE thought
  async newThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      ).exec();

      if (!user) {
        return res.status(404).json({ message: 'User not found with that ID' });  
      }

      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // UPDATE single thought by id
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      ).exec();

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE single thought by id
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        res.status(404).json({ message: 'No thought with that ID' });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      ).exec();

      if (!user) {
        return res.status(404).json({ message: 'No thought with that ID was found' });
      }
      
      res.status(200).json({ message: 'Thought and users deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
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
