const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',      // Referencing the User who owns this task
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  dueDate: Date,
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Task', taskSchema);
