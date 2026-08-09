const Event = require("../models/Event");

const createEvent = async (req, res) => {
  try {
    const { type, severity, source, description } = req.body;

    const event = await Event.create({
      type,
      severity,
      source,
      description,
      createdBy: req.user.id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createEvent,
  getEvents
};