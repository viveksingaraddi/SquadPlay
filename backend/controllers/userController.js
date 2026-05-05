const User = require("../models/User");

// Get all users with filters
const getUsers = async (req, res) => {
  try {
    const { name, game, skill, location } = req.query;
    let query = { _id: { $ne: req.user.id } }; // Don't show current user

    if (name) query.name = { $regex: name, $options: "i" };
    if (game && game !== "All games") query.preferredGames = game;
    if (skill && skill !== "All skill levels") query.skillLevel = skill.toLowerCase();
    if (location && location !== "Anywhere") query.location = { $regex: location, $options: "i" };

    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { location, bio, preferredGames, skillLevel } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
      user.location = location || user.location;
      user.bio = bio || user.bio;
      user.preferredGames = preferredGames || user.preferredGames;
      user.skillLevel = skillLevel || user.skillLevel;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUsers, getMe, updateProfile };
