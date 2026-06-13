class AppError extends Error {
  /**
   * @param {string} message - Mensagem legível para o cliente
   * @param {number} statusCode - HTTP status code
   * @param {string} code - Código de erro para o frontend identificar
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} não encontrado`, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

module.exports = { AppError, NotFoundError, ValidationError };
