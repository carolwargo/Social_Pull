const { User, Thought } = require('../models');

module.exports = {

//GET all Users
    async getAllUsers(req, res) {
        try {
          const users = await User.find();
          res.status(200).json(users);
        } catch (err) {
          res.status(500).json(err);
        }
      },
    
// GET single User
    async getUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId})
                .populate('friends')
                .populate('thoughts')
                .select('-__v')
                .exec();
            if (!user) {
                return res.status(404).json({ messsage: 'No user found with that id'});
            }

            res.status(200).json(user);
        }   catch (err) {
            console.log(err);
            res.status(500).json(err);
        }         
    },
   
    //CREATE new user
    async NewUser(req, res) {
        try {
            const user =await User.create(req.body);
            res.status(200).json(user);     
        }   catch(err) {
            res.status(500).json(err);
        }
    },

    async updateUser(req, res) {
        try {
          const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
          ).exec();
      
          if (!user) {
            return res.status(404).json({ message: 'No user with that ID was found' });
          }
      
          res.status(200).json(user);
        } catch (err) {
          res.status(500).json(err);
        }
      },
// DELETE user by id
      async deleteUser(req, res) {
        try {
          const user = await User.findOneAndDelete({ _id: req.params.userId }).exec();
      
          if (!user) {
            return res.status(404).json({ message: 'No user with that ID was found' });
          }
      
          await Thought.deleteMany({ _id: { $in: user.thoughts } }).exec();
      
          res.status(200).json({ message: 'User and their respective thoughts have been deleted' });
        } catch (err) {
          res.status(500).json(err);
        }
      },
      
// ADD user to friends array by id
async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      ).exec();
  
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID was found' });
      }
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // REMOVE user from friend array
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      ).exec();
  
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID was found' });
      }
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }  
      
};      






