const { getDatabase } = require('../../../infra/database/connection');

class TaskRepository {
  constructor() {
    this.db = getDatabase();
  }

  findAll({ status, priority, search } = {}) {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (status) { query += ' AND status = ?'; params.push(status); }
    if (priority) { query += ' AND priority = ?'; params.push(priority); }
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';
    return this.db.prepare(query).all(...params);
  }

  findById(id) {
    return this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) ?? null;
  }

  create(task) {
    this.db.prepare(`
      INSERT INTO tasks (id, title, description, priority, status, due_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(task.id, task.title, task.description, task.priority, task.status, task.due_date);
    return this.findById(task.id);
  }

  update(id, fields) {
    const keys = Object.keys(fields);
    const setClauses = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => fields[k]);

    // Atualiza updated_at manualmente (trigger não disponível em node:sqlite nativo)
    const stmt = this.db.prepare(
      `UPDATE tasks SET ${setClauses}, updated_at = datetime('now') WHERE id = ?`
    );
    const result = stmt.run(...values, id);
    if (result.changes === 0) return null;
    return this.findById(id);
  }

  delete(id) {
    const result = this.db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return result.changes > 0;
  }

  countByStatus() {
    return this.db.prepare(
      `SELECT status, COUNT(*) as count FROM tasks GROUP BY status`
    ).all();
  }
}

module.exports = { TaskRepository };
