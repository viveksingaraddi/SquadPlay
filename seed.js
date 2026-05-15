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
        bio: "Aggressive badminton player, looking for evening matches.",
        skillLevel: "advanced",
        preferredGames: ["Badminton", "Volleyball", "Cricket", "Tennis"]
      },
      {
        name: "Rahul Sharma",
        email: "rahul@test.com",
        password,
        location: "Koramangala, Bangalore",
        bio: "Casual cricket fan. Usually free on weekends.",
        skillLevel: "intermediate",
        preferredGames: ["Cricket", "Badminton"]
      },
      {
        name: "Priya Das",
        email: "priya@test.com",
        password,
        location: "HSR Layout, Bangalore",
        bio: "Chess grandmaster in the making! Let's have a brainy match.",
        skillLevel: "advanced",
        preferredGames: ["Chess", "Table Tennis"]
      },
      {
        name: "Amit Kumar",
        email: "amit@test.com",
        password,
        location: "Indiranagar, Bangalore",
        bio: "Beginner at volleyball, but I bring a lot of energy!",
        skillLevel: "beginner",
        preferredGames: ["Volleyball", "Cricket"]
      },
      {
        name: "Sneha Reddy",
        email: "sneha@test.com",
        password,
        location: "Jalahalli, Bangalore",
        bio: "I love to make new friends and play with and enjoy the moments",
        skillLevel: "intermediate",
        preferredGames: ["Badminton", "Tennis"]
      },
      {
        name: "Suresh Babu",
        email: "suresh@test.com",
        password,
        location: "Jalahalli, Bangalore",
        bio: "Looking for local partners for carrom or cards.",
        skillLevel: "advanced",
        preferredGames: ["Chess", "Table Tennis"]
      }
    ];

    await User.deleteMany({ email: { $in: users.map(u => u.email) } });
    await User.insertMany(users);

    console.log("Seeding successful! Added " + users.length + " test profiles.");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedUsers();
