const Task = require('../models/Task');
const Category = require('../models/Category');
const { taskValidation } = require('../utils/validation');

const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };

    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('category', 'title')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      tasks,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  const { error } = taskValidation(req.body);
  if (error) {
    res.status(400);
    return next(new Error(error.details[0].message));
  }

  const { title, description, category, status } = req.body;

  try {
    const categoryExists = await Category.findOne({ _id: category, user: req.user._id });
    if (!categoryExists) {
      res.status(404);
      return next(new Error('Category not found'));
    }

    const task = await Task.create({
      user: req.user._id,
      category,
      title,
      description,
      status: status || 'pending',
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    if (req.body.category) {
      const categoryExists = await Category.findOne({ _id: req.body.category, user: req.user._id });
      if (!categoryExists) {
        res.status(404);
        return next(new Error('Category not found'));
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id, message: 'Task removed' });
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(400);
    return next(new Error('Title and description are required'));
  }

  try {
    const category = await Category.create({
      user: req.user._id,
      title,
      description,
    });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getCategories,
  createCategory,
};