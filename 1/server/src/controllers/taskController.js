const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc    Retrieve all tasks (with optional filtering by status or priority)
 * @route   GET /api/v1/tasks
 * @access  Public
 */
exports.getTasks = asyncHandler(async (req, res, next) => {
  const query = {};

  // Optional filtering by completed status
  if (req.query.completed !== undefined) {
    query.completed = req.query.completed === 'true';
  }

  // Optional filtering by priority
  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  const tasks = await Task.find(query);

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

/**
 * @desc    Retrieve a single task by ID
 * @route   GET /api/v1/tasks/:id
 * @access  Public
 */
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * @desc    Create a new task
 * @route   POST /api/v1/tasks
 * @access  Public
 */
exports.createTask = asyncHandler(async (req, res, next) => {
  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task
  });
});

/**
 * @desc    Update an existing task (Full Update - PUT)
 * @route   PUT /api/v1/tasks/:id
 * @access  Public
 */
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * @desc    Partial update an existing task (PATCH)
 * @route   PATCH /api/v1/tasks/:id
 * @access  Public
 */
exports.patchTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * @desc    Delete a task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Public
 */
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  await Task.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
