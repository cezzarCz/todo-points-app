// Arquivo principal do projeto
const express = require('express');
const cors = require('cors'); // Middleware para habilitar CORS
require('dotenv').config();

const app = express();
app.use(express.json()); // Middleware para parsear JSON

app.use(cors({
  origin: 'http://localhost:3001',      // permite apenas requests vindos desta origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Importa e monta as rotas
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes); // Rotas de registro e login
app.use('/api/tasks', taskRoutes); // Rotas de tarefas

// Inicia o servidor na porta definida no arquivo .env ou na porta 3000 por padrão
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota teste
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bem vindo a API;' });
});