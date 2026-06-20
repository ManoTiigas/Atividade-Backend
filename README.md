# taskflow-api

Backend da aplicação TaskFlow. API REST com Express + Firestore.

## Sobre

A API do TaskFlow é um backend REST desenvolvido em **Node.js** com o framework **Express**, responsável por gerenciar as tarefas (tasks) da aplicação. Os dados são persistidos no **Cloud Firestore** (Firebase), utilizando o Firebase Admin SDK para autenticação e acesso ao banco.

A aplicação está hospedada na plataforma **Vercel**, como uma função serverless, disponível em:

```
https://atividade-backend.vercel.app
```

## Stack

- Node.js (18+)
- Express
- Firebase Admin SDK (Firestore)
- Deploy: Vercel (serverless function)

## Como rodar localmente

### 1. Criar projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um projeto e habilite o **Firestore Database**
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

## Deploy no Vercel

Como o projeto é um Express tradicional (`app.listen`), é necessário um `vercel.json` na raiz instruindo o Vercel a tratar `server.js` como função serverless:

```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
```

As variáveis de ambiente (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) devem ser configuradas em **Project Settings → Environment Variables** no painel do Vercel, e um novo deploy deve ser disparado após qualquer alteração nelas.

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
