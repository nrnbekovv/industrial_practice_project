const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getCategories,
  createCategory,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/tasks')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/tasks/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/categories')
  .get(protect, getCategories)
  .post(protect, createCategory);

module.exports = router;