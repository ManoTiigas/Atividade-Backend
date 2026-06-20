require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// ── Firebase ───────────────────────────────────────────
initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // \n literal no .env vira quebra de linha real
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore();
const tasks = db.collection('tasks');

// ── App ────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// Serializa DocumentSnapshot → objeto plano
function serialize(doc) {
  return { id: doc.id, ...doc.data() };
}

// ── Rotas ──────────────────────────────────────────────

// Listar todas
app.get('/tasks', async (req, res) => {
  const snapshot = await tasks.orderBy('createdAt', 'desc').get();
  res.json(snapshot.docs.map(serialize));
});

// Buscar por ID
app.get('/tasks/:id', async (req, res) => {
  const doc = await tasks.doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Tarefa não encontrada' });
  res.json(serialize(doc));
});

// Criar
app.post('/tasks', async (req, res) => {
  const { title, description, priority, status } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: 'Título é obrigatório' });

  const ref = await tasks.add({
    title: title.trim(),
    description: description ?? null,
    priority: priority ?? 'medium',
    status: status ?? 'pending',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const doc = await ref.get();
  res.status(201).json(serialize(doc));
});

// Atualizar (parcial)
app.patch('/tasks/:id', async (req, res) => {
  const ref = tasks.doc(req.params.id);
  const doc = await ref.get();
  if (!doc.exists) return res.status(404).json({ error: 'Tarefa não encontrada' });

  const { title, description, priority, status } = req.body;
  const update = { updatedAt: FieldValue.serverTimestamp() };

  if (title !== undefined) update.title = title.trim();
  if (description !== undefined) update.description = description;
  if (priority !== undefined) update.priority = priority;
  if (status !== undefined) update.status = status;

  await ref.update(update);
  const updated = await ref.get();
  res.json(serialize(updated));
});

// Excluir
app.delete('/tasks/:id', async (req, res) => {
  const doc = await tasks.doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Tarefa não encontrada' });
  await tasks.doc(req.params.id).delete();
  res.status(204).send();
});

// ── Start ──────────────────────────────────────────────
const PORT = process.env.PORT ?? 3333;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
