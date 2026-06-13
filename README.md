# TaskFlow — CRUD Mobile com React Native + Expo + Node.js

Aplicação completa de gerenciamento de tarefas com:
- **Backend**: Node.js + Express + SQLite nativo (Node 22+)
- **Mobile**: React Native + Expo + TypeScript + React Navigation

---

## Estrutura do Projeto

```
taskflow/
├── backend/          # API REST
│   └── src/
│       ├── modules/tasks/
│       │   ├── controllers/   # HTTP handlers (thin)
│       │   ├── services/      # Regras de negócio
│       │   ├── repositories/  # Acesso ao banco
│       │   ├── dtos/          # Validação de input
│       │   └── routes/        # Definição de rotas
│       ├── shared/
│       │   ├── errors/        # AppError tipado
│       │   └── middlewares/   # errorHandler global
│       ├── infra/database/    # Conexão SQLite
│       ├── app.js             # Express app
│       └── server.js          # Entry point + graceful shutdown
│
└── mobile/           # App Expo
    └── src/
        ├── screens/           # TaskListScreen, TaskFormScreen
        ├── components/        # TaskCard, StatusBadge
        ├── services/          # taskApi (fetch wrapper)
        ├── hooks/             # useTasks (data fetching)
        ├── types/             # Task, DTOs, navegação
        └── theme/             # Tokens de design
```

---

## Como Rodar

### Pré-requisitos
- Node.js **22+** (necessário para `node:sqlite` nativo)
- npm ou yarn
- Expo Go instalado no celular (ou emulador)

---

### 1. Backend

```bash
cd backend

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Iniciar em desenvolvimento
npm run dev

# Produção
npm start
```

Servidor disponível em `http://localhost:3333`.

---

### 2. Mobile

```bash
cd mobile

npm install

npx expo start
```

Escaneie o QR code com o **Expo Go** (Android/iOS).

---

### Configurar IP da API no Mobile

Edite `mobile/src/services/api.ts` e altere `BASE_URL`:

| Ambiente               | URL                              |
|------------------------|----------------------------------|
| Android Emulator       | `http://10.0.2.2:3333/api/v1`    |
| Dispositivo físico     | `http://<SEU_IP_LOCAL>:3333/api/v1` |
| iOS Simulator          | `http://localhost:3333/api/v1`   |

Para descobrir seu IP local: `ipconfig` (Windows) ou `ifconfig` / `ip addr` (Linux/Mac).

---

## API Endpoints

| Método   | Rota                     | Descrição               |
|----------|--------------------------|-------------------------|
| `GET`    | `/api/v1/tasks`          | Listar tarefas          |
| `GET`    | `/api/v1/tasks/stats`    | Contagem por status     |
| `GET`    | `/api/v1/tasks/:id`      | Buscar por ID           |
| `POST`   | `/api/v1/tasks`          | Criar tarefa            |
| `PATCH`  | `/api/v1/tasks/:id`      | Atualizar (parcial)     |
| `DELETE` | `/api/v1/tasks/:id`      | Excluir tarefa          |

### Exemplo — Criar tarefa

```bash
curl -X POST http://localhost:3333/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implementar autenticação JWT",
    "description": "Login com refresh token",
    "priority": "high",
    "status": "pending"
  }'
```

### Campos da tarefa

| Campo         | Tipo     | Valores aceitos                     | Obrigatório |
|---------------|----------|--------------------------------------|-------------|
| `title`       | string   | máx. 120 chars                       | ✅           |
| `description` | string   | máx. 500 chars                       | ❌           |
| `priority`    | string   | `low`, `medium`, `high`              | ❌ (default: `medium`) |
| `status`      | string   | `pending`, `in_progress`, `done`     | ❌ (default: `pending`) |
| `due_date`    | string   | ISO 8601 (ex: `2026-12-31`)          | ❌           |

---

## Padrões Arquiteturais Aplicados

- **Repository Pattern** — acesso ao banco isolado da lógica de negócio
- **DTO + Validação na borda** — validação antes de chegar ao service
- **AppError tipado** — erros de domínio com `statusCode` e `code`
- **Error Handler centralizado** — único ponto de formatação de erros
- **Graceful Shutdown** — fecha conexões pendentes em `SIGTERM`/`SIGINT`
- **Custom Hook `useTasks`** — encapsula data-fetching, sem lógica inline nos componentes
- **Tokens de design centralizados** — `theme/index.ts` como fonte única de verdade
- **Navegação tipada** — `RootStackParamList` com TypeScript
