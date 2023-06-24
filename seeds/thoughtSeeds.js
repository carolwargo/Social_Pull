const mongoose = require("mongoose");
const { Thought } = require("../models");

const thoughts = [
  {
    title: "Thought 1",
    content: "This is the first thought.",
  },
  {
    title: "Thought 2",
    content: "This is the second thought.",
  },
];

const seedThoughts = async () => {
  try {
    // CONNECT to MongoDB database
    await mongoose.connect("mongodb://localhost:27017/socialpullapiDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // DELETE existing thoughts in the database
    await Thought.deleteMany();

    // CREATE new thoughts using the sample data
    await Thought.insertMany(thoughts);

    console.log("Thoughts seeded successfully");
  } catch (error) {
    console.error("Error seeding thoughts:", error);
  } finally {

    // DISCONNECT from the database
    mongoose.disconnect();
  }
};

// CALL function to seed the thoughts when this script is run
seedThoughts();
