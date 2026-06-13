const {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getStats,
} = require('../services/task.service');

async function list(req, res, next) {
  try {
    const { status, priority, search } = req.query;
    const tasks = listTasks({ status, priority, search });
    return res.json({ data: tasks, meta: { total: tasks.length } });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    return res.json({ data: getTaskById(req.params.id) });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    return res.status(201).json({ data: createTask(req.body) });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    return res.json({ data: updateTask(req.params.id, req.body) });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    deleteTask(req.params.id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function stats(req, res, next) {
  try {
    return res.json({ data: getStats() });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, remove, stats };
