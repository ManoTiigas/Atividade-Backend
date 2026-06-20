# taskflow-api

Backend da aplicação TaskFlow. API REST com Express + Firestore.

## Stack

- Node.js (18+)
- Express
- Firebase Admin SDK (Firestore)

## Como rodar

### 1. Criar projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um projeto
3. Vá em **Project Settings → Service Accounts → Generate new private key**
4. Baixe o JSON gerado

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Abra o `.env` e preencha com os dados do JSON baixado:

```env
PORT=3333
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> **Atenção:** a `FIREBASE_PRIVATE_KEY` deve estar entre aspas duplas e com `\n` literal (não quebra de linha real).

### 3. Instalar e rodar

```bash
npm install
npm run dev     # desenvolvimento (--watch)
npm start       # produção
```

API disponível em `http://localhost:3333`.

## Endpoints

| Método   | Rota         | Descrição           |
|----------|--------------|---------------------|
| GET      | /tasks       | Listar tarefas      |
| GET      | /tasks/:id   | Buscar por ID       |
| POST     | /tasks       | Criar tarefa        |
| PATCH    | /tasks/:id   | Atualizar (parcial) |
| DELETE   | /tasks/:id   | Excluir             |

### Corpo esperado — POST /tasks

```json
{
  "title": "Minha tarefa",
  "description": "Opcional",
  "priority": "high",
  "status": "pending"
}
```

Valores aceitos:
- `priority`: `low` | `medium` | `high`
- `status`: `pending` | `in_progress` | `done`
