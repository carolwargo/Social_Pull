const mongoose = require("mongoose");
const { User } = require("../models");

const users = [
    {
      username: "user1",
      email: "user1@example.com",
    },
    {
      username: "user2",
      email: "user2@example.com",
    },
    // Add more users as needed
  ];
  
  const seedUsers = async () => {
    try {

       // CONNECT to  MongoDB database
    await mongoose.connect("mongodb://localhost:27017/socialpullapiDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      // DELETE all existing users in the database
      await User.deleteMany();
  
      // CREATE new users using the sample data
      await User.insertMany(users);
  
      console.log("Users seeded successfully");
    } catch (error) {
      console.error("Error seeding users:", error);
    } finally {
     
      mongoose.disconnect();
    }
  };
  
  // CALL function to seed the users 
  seedUsers();
  