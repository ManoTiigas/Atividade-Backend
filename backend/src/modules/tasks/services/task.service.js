const { v4: uuidv4 } = require('uuid');
const { TaskRepository } = require('../repositories/task.repository');
const { validateCreateTask, validateUpdateTask } = require('../dtos/task.dto');
const { NotFoundError } = require('../../../shared/errors/AppError');

const repository = new TaskRepository();

function listTasks(filters) {
  return repository.findAll(filters);
}

function getTaskById(id) {
  const task = repository.findById(id);
  if (!task) throw new NotFoundError('Tarefa');
  return task;
}

function createTask(body) {
  const data = validateCreateTask(body);
  return repository.create({ id: uuidv4(), ...data });
}

function updateTask(id, body) {
  getTaskById(id);
  return repository.update(id, validateUpdateTask(body));
}

function deleteTask(id) {
  getTaskById(id);
  repository.delete(id);
}

function getStats() {
  const counts = repository.countByStatus();
  const stats = { pending: 0, in_progress: 0, done: 0, total: 0 };

  for (const row of counts) {
    stats[row.status] = row.count;
    stats.total += row.count;
  }

  return stats;
}

module.exports = { listTasks, getTaskById, createTask, updateTask, deleteTask, getStats };
