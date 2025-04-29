// Arquivo principal do projeto
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Importa e monta as rotas
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes); // Rotas de registtro e login
app.use('/api/tasks', taskRoutes); // Rotas de tarefas

// Inicia o servidor na porta definida no arquivo .env ou na porta 3000 por padrão
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
