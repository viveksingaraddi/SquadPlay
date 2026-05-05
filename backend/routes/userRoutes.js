const express = require("express");
const { getUsers, getMe, updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

module.exports = router;
