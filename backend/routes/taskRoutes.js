const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

// ➕ Create a new task
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    const newTask = new Task({
      title,
      description,
      user: req.user.userId, // From JWT payload
    });

    await newTask.save();
    res.status(201).json({ message: 'Task added successfully', task: newTask });
  } catch (err) {
    res.status(500).json({ message: 'Error adding task', error: err.message });
  }
});

// 📄 Get all tasks for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

// ✏️ Update a task
router.put('/update/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, description },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
});

// ❌ Delete a task
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
});

module.exports = router;
