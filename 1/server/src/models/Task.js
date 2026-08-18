const mongoose = require('mongoose');

// Define the Schema for a Task
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true
  }
);

// Compile the schema into a Mongoose Model and export it
module.exports = mongoose.model('Task', TaskSchema);
