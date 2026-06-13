const { AppError } = require('../errors/AppError');

/**
 * Middleware centralizado de tratamento de erros.
 * Nunca expõe stack trace em produção.
 */
function errorHandler(err, req, res, next) {
  const isDev = process.env.NODE_ENV !== 'production';

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
  }

  // Erro inesperado — não vazar internos para o cliente
  console.error('[UNHANDLED ERROR]', err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Ocorreu um erro interno. Tente novamente.',
      ...(isDev && { debug: err.message }),
    },
  });
}

module.exports = { errorHandler };
