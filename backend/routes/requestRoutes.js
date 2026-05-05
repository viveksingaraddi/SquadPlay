const express = require("express");
const { sendRequest, getReceivedRequests, updateRequestStatus } = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send", protect, sendRequest);
router.get("/received", protect, getReceivedRequests);
router.put("/:id", protect, updateRequestStatus);

module.exports = router;
