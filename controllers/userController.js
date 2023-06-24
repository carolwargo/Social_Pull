const { User, Thought } = require("../models");

module.exports = {

 //GET ALL users
  getAllUsers(req, res) {
    User.find({})
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  //GET SINGLE user by id
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate("thoughts")
      .populate("friends")
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User found with that ID!" })
          : res.json(user)
      )
      .catch((err) => {
        res.status(500).json(err)
    });    
  },

  // CREATE NEW user
  createUser(req, res) {
    User.create(req.body)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json(err));
  },

  //UPDATE user by id
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User found with this ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  //DELETE user by id
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) => 
        !user 
        ? res.status(404).json({ message: 'No user with that Id was found'})
        : Thought.deleteMany({ _id: { $in: user.thoughts }})
    )
    .then(() => res.status(200).json({ message: 'User and their respective thoughts have been deleted'}))
    .catch((err) => res.status(500).json(err));
},

//ADD new friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "No user found with this id!"});
      }
      res.json(user);
    })
    .catch((err) => res.status(500).json(err));
  }, 

// DELETE exising friend
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user found with this id!"});
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  }
};
