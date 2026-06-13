const { initializeDatabase } = require('./infra/database/connection');
const app = require('./app');

const PORT = process.env.PORT ?? 3333;

initializeDatabase();

const server = app.listen(PORT, () => {
  console.log(`[SERVER] TaskFlow API running on http://localhost:${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV ?? 'development'}`);
});

function shutdown(signal) {
  console.log(`\n[SERVER] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('[SERVER] HTTP server closed.');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (err) => { console.error('[FATAL]', err); process.exit(1); });
process.on('unhandledRejection', (reason) => { console.error('[FATAL]', reason); process.exit(1); });
