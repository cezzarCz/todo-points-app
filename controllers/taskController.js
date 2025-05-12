// Controller de Tarefas
// Lida com a lógica de manipulação de dados das tarefas
const Task = require('../models/Task'); // Importa o modelo de Tarefa

exports.createTask = async (req, res) => {
    try {
        const userId = req.user.userId; // ID do usuário autenticado
        const { title, description, due_date, points } = req.body; // Extraindo dados do corpo da requisição
        console.log('Dados recebidos no backend:', { userId, title, description, due_date, points });
        // Validando se todos os campos estão presentes
        if (!title || !description || !due_date || !points) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        // Criando a tarefa no banco de dados
        const newTask = await Task.create({ userId, title, description, due_date, points });
        res.status(201).json({ message: 'Tarefa criada com sucesso.', taskId: newTask.insertId }); // Retorna o ID da nova tarefa criada
    } catch (err) {
        console.error('Erro ao criar tarefa:', err);
        res.status(500).json({ err: 'Erro interno no servidor.' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const userId = req.user.userId; // ID do usuário autenticado       
        const tasks = await Task.findByUserId(userId);// Buscando todas as tarefas do usuário no banco de dados
        res.status(200).json(tasks); // Retorna a lista de tarefas
    } catch (err) {
        console.error('Erro ao buscar tarefas:', err);
        res.status(500).json({ err: 'Erro interno no servidor.' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.id; // ID da tarefa a ser atualizada
        const updates = req.body; // Dados a serem atualizados
        await Task.update(taskId, updates); // Atualizando a tarefa no banco de dados
        res.status(200).json({ message: 'Tarefa atualizada com sucesso.' }); // Retorna mensagem de sucesso
    } catch (err) {
        console.error('Erro ao atualizar tarefa:', err);
        res.status(500).json({ err: 'Erro interno no servidor.' });
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id; // ID da tarefa a ser deletada
        await Task.delete(taskId); // Deletando a tarefa no banco de dados
        res.status(200).json({ message: 'Tarefa deletada com sucesso.' }); // Retorna mensagem de sucesso
    } catch (err) {
        console.error('Erro ao deletar tarefa:', err);
        res.status(500).json({ err: 'Erro interno no servidor.' });
    }
}

exports.completeTask = async () => {
    try {
        const taskId = req.params.id;
        const { completed } = req.body;
        await Task.update(taskId, { completed });
        res.status(200).json({ message: 'Estado de conclusão atualizado com sucesso.' });
    } catch (err) {
        console.error('Erro ao atualizar estado de conclusão:', err);
        res.status(500).json({ err: 'Erro interno no servidor.' });
    }
}