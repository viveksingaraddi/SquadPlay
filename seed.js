const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./backend/models/User");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const password = await bcrypt.hash("password123", 10);

    const users = [
      {
        name: "Vivek Singaraddi",
        email: "vivek@test.com",
        password,
        location: "Koramangala, Bangalore",
        bio: "let's PLAY",
        skillLevel: "advanced",
        preferredGames: ["Badminton", "Volleyball", "Cricket", "Tennis"]
      },
      {
        name: "Suresh",
        email: "suresh@test.com",
        password,
        location: "Jalahalli, Bangalore",
        bio: "I love to make new friends and play with and enjoy the moments",
        skillLevel: "advanced",
        preferredGames: ["Badminton", "Volleyball", "Cricket", "Football"]
      },
      {
        name: "Anand",
        email: "anand@test.com",
        password,
        location: "Indiranagar, Bangalore",
        bio: "Looking for a casual match.",
        skillLevel: "beginner",
        preferredGames: ["Chess", "Badminton"]
      }
    ];

    await User.deleteMany({ email: { $in: users.map(u => u.email) } });
    await User.insertMany(users);

    console.log("Seeding successful!");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedUsers();
