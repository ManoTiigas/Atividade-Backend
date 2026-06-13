const { ValidationError } = require('../../../shared/errors/AppError');

const VALID_PRIORITIES = ['low', 'medium', 'high'];
const VALID_STATUSES = ['pending', 'in_progress', 'done'];

/**
 * Valida e sanitiza os dados de criação de tarefa.
 * Lança ValidationError com detalhes se inválido.
 */
function validateCreateTask(body) {
  const errors = [];

  if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Título é obrigatório' });
  }

  if (body.title && body.title.trim().length > 120) {
    errors.push({ field: 'title', message: 'Título deve ter no máximo 120 caracteres' });
  }

  if (body.description && body.description.length > 500) {
    errors.push({ field: 'description', message: 'Descrição deve ter no máximo 500 caracteres' });
  }

  if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
    errors.push({ field: 'priority', message: `Prioridade deve ser: ${VALID_PRIORITIES.join(', ')}` });
  }

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    errors.push({ field: 'status', message: `Status deve ser: ${VALID_STATUSES.join(', ')}` });
  }

  if (body.due_date && isNaN(Date.parse(body.due_date))) {
    errors.push({ field: 'due_date', message: 'Data de vencimento inválida (use ISO 8601)' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Dados inválidos', errors);
  }

  return {
    title: body.title.trim(),
    description: body.description?.trim() ?? null,
    priority: body.priority ?? 'medium',
    status: body.status ?? 'pending',
    due_date: body.due_date ?? null,
  };
}

/**
 * Valida e sanitiza os dados de atualização de tarefa.
 * Permite atualização parcial (PATCH semantics).
 */
function validateUpdateTask(body) {
  const errors = [];
  const update = {};

  if ('title' in body) {
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Título não pode ser vazio' });
    } else if (body.title.trim().length > 120) {
      errors.push({ field: 'title', message: 'Título deve ter no máximo 120 caracteres' });
    } else {
      update.title = body.title.trim();
    }
  }

  if ('description' in body) {
    if (body.description && body.description.length > 500) {
      errors.push({ field: 'description', message: 'Descrição deve ter no máximo 500 caracteres' });
    } else {
      update.description = body.description?.trim() ?? null;
    }
  }

  if ('priority' in body) {
    if (!VALID_PRIORITIES.includes(body.priority)) {
      errors.push({ field: 'priority', message: `Prioridade deve ser: ${VALID_PRIORITIES.join(', ')}` });
    } else {
      update.priority = body.priority;
    }
  }

  if ('status' in body) {
    if (!VALID_STATUSES.includes(body.status)) {
      errors.push({ field: 'status', message: `Status deve ser: ${VALID_STATUSES.join(', ')}` });
    } else {
      update.status = body.status;
    }
  }

  if ('due_date' in body) {
    if (body.due_date && isNaN(Date.parse(body.due_date))) {
      errors.push({ field: 'due_date', message: 'Data de vencimento inválida (use ISO 8601)' });
    } else {
      update.due_date = body.due_date ?? null;
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Dados inválidos', errors);
  }

  if (Object.keys(update).length === 0) {
    throw new ValidationError('Nenhum campo válido enviado para atualização');
  }

  return update;
}

module.exports = { validateCreateTask, validateUpdateTask };
