// Criação de rotas para as tarefas
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const verifyToken = require('../middlewares/verifyToken');

// Protegendo rotas com middleware de verificação de token
router.use(verifyToken);

router.post('/', taskController.createTask); // Criar tarefa
router.get('/', taskController.getTasks); // Obter todas as tarefas
router.put('/:id', taskController.updateTask); // Atualizar tarefa por ID
router.delete('/:id', taskController.deleteTask); // Deletar tarefa por ID

module.exports = router;