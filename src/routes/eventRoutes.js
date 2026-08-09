const express = require("express");
const router = express.Router();

const { createEvent, getEvents } = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getEvents);
router.post("/", protect, createEvent);

module.exports = router; 