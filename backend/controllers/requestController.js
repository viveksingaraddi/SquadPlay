const PlayRequest = require("../models/PlayRequest");

// Send request
const sendRequest = async (req, res) => {
  try {
    const { receiverId, game } = req.body;
    const senderId = req.user.id;

    const exists = await PlayRequest.findOne({ sender: senderId, receiver: receiverId, status: "pending" });
    if (exists) return res.status(400).json({ message: "Request already pending" });

    const request = await PlayRequest.create({
      sender: senderId,
      receiver: receiverId,
      game
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get received requests
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await PlayRequest.find({ receiver: req.user.id })
      .populate("sender", "name email location")
      .sort("-createdAt");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update request status
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await PlayRequest.findById(req.params.id);

    if (request) {
      request.status = status;
      await request.save();
      res.json(request);
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { sendRequest, getReceivedRequests, updateRequestStatus };
