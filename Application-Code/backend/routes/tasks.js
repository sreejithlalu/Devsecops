const Task = require("../models/task");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const payload = {
      text: req.body.text || req.body.task, // backward compatibility
      completed: req.body.completed ?? false,
    };

    if (!payload.text) {
      return res.status(400).json({ error: "Task text is required" });
    }

    const task = await Task.create(payload);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.send(tasks);
    } catch (error) {
        res.send(error);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id },
            req.body
        );
        res.send(task);
    } catch (error) {
        res.send(error);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        res.send(task);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;
