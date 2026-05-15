const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./backend/models/User");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const sports = ["Cricket", "Football", "Badminton", "Tennis", "Basketball", "Swimming", "Chess", "Table Tennis", "Squash", "Volleyball"];
const locations = [
  "Indiranagar, Bangalore", "Koramangala, Bangalore", "Whitefield, Bangalore", 
  "HSR Layout, Bangalore", "Jayanagar, Bangalore", "Malleshwaram, Bangalore", 
  "Bannerghatta Road, Bangalore", "Marathahalli, Bangalore", "Hebbal, Bangalore", 
  "Electronic City, Bangalore", "Sarjapur Road, Bangalore", "Rajajinagar, Bangalore", 
  "Kalyan Nagar, Bangalore", "Basavanagudi, Bangalore", "Ulsoor, Bangalore"
];
const skills = ["beginner", "intermediate", "advanced"];
const bios = [
  "Love to play on weekends!", "Looking for a competitive match.", "Easy-going player, just for fun.",
  "New to the city, looking for sports buddies.", "Aggressive player, bring your A-game!",
  "Available early mornings.", "Weekend warrior here!", "Professional training background.",
  "I play for fitness and fun.", "Always up for a quick game after work."
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const password = await bcrypt.hash("password123", 10);

    // Initial users (original ones preserved)
    const users = [
      {
        name: "Vivek Singaraddi",
        email: "vivek@test.com",
        password,
        location: "Koramangala, Bangalore",
        bio: "Aggressive badminton player, looking for evening matches.",
        skillLevel: "advanced",
        preferredGames: ["Badminton", "Volleyball", "Cricket", "Tennis"]
      }
    ];

    const firstNames = ["Rahul", "Priya", "Amit", "Sneha", "Suresh", "Anita", "Vikram", "Deepa", "Kiran", "Meghna", "Arjun", "Sonal", "Rohan", "Pooja", "Kartik", "Shweta", "Abhishek", "Kavya", "Manish", "Divya", "Sanjay", "Ritu", "Nikhil", "Asha", "Pranav", "Leela", "Varun", "Nehal", "Aditya", "Tanya", "Harish", "Preeti", "Sunil", "Monica", "Ravi", "Simran", "Vijay", "Anjali", "Omkar", "Ishani"];
    const lastNames = ["Sharma", "Das", "Kumar", "Reddy", "Babu", "Patel", "Singh", "Nair", "Iyer", "Gupte", "Verma", "Joshi", "Malhotra", "Rao", "Shetty", "Desai", "Bose", "Menon", "Chopra", "Thakur"];

    for (let i = 0; i < 40; i++) {
      const fName = firstNames[i % firstNames.length];
      const lName = lastNames[i % lastNames.length];
      const name = `${fName} ${lName}`;
      const email = `${fName.toLowerCase()}${i}@test.com`;
      
      const numGames = Math.floor(Math.random() * 3) + 1;
      const userGames = [];
      while(userGames.length < numGames) {
        const game = sports[Math.floor(Math.random() * sports.length)];
        if(!userGames.includes(game)) userGames.push(game);
      }

      users.push({
        name,
        email,
        password,
        location: locations[Math.floor(Math.random() * locations.length)],
        bio: bios[Math.floor(Math.random() * bios.length)],
        skillLevel: skills[Math.floor(Math.random() * skills.length)],
        preferredGames: userGames
      });
    }

    // Clear existing test users (but keep main test account if you want, here we delete all matching generated emails)
    await User.deleteMany({ email: { $regex: /@test.com$/ } });
    await User.insertMany(users);

    console.log("Seeding successful! Added " + users.length + " test profiles to the database.");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedUsers();
