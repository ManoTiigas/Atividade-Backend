const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./shared/middlewares/errorHandler');
const taskRoutes = require('./modules/tasks/routes/task.routes');

const app = express();

// Segurança: headers HTTP seguros
app.use(helmet());

// CORS: em produção, substituir por whitelist de origens
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse de body com limite para evitar ataques de payload grande
app.use(express.json({ limit: '50kb' }));

// Health check — sem lógica de negócio
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api/v1/tasks', taskRoutes);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `Rota ${req.method} ${req.path} não existe` },
  });
});

// Handler centralizado de erros (deve ser o último middleware)
app.use(errorHandler);

module.exports = app;
