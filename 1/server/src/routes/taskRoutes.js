const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  patchTask,
  deleteTask
} = require('../controllers/taskController');

const router = express.Router();

// Routes for '/' path (GET all tasks & POST new task)
router
  .route('/')
  .get(getTasks)
  .post(createTask);

// Routes for '/:id' path (GET, PUT, PATCH, DELETE single task by ID)
router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .patch(patchTask)
  .delete(deleteTask);

module.exports = router;
