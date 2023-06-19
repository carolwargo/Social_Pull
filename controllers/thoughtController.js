const { Thought, User } = require('../models');

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
  //!!! SHOULD I add '_v' field
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
  
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
  
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  // CREATE thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        {_id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      ).exec();

      if (!user) {
        return res.status(404).json({ message: 'User not found with that ID'});  
      }

      res.status(200).json(user);
    } catch (err) {
      console.log(err);
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
        return res.status(404).json({ message: 'No thought with that ID was found'});
      }
      
      res.status(200).json({ message: 'Thought and users deleted!' });
    } catch (err) {
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

  // ADD Reaction to reaction array by specific Thought id
async addThoughtReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      ).exec();
  
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID was found' });
      }
  
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
},

//DELETES Reaction from reaction array by thought id
async removeThoughtReaction(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: req.body } },
          { runValidators: true, new: true }
        ).exec();
    
    if (!thought) {
        return res.status(404).json({ message: 'No thought with this id was found '})
    }

    res.status(200).json(thought);
  }   catch (err) {
    res.status(500).json(err);
  }
 }
}


