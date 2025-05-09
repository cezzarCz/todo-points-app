// Definição do modelo de Tasks
const pool = require('../config/db');

// Definindo classe Task
class Task {
    // Criacao de tarefa
    static async create({ userId, title, description, due_date, points }) {
        console.log('Dados enviados ao banco de dados:', { userId, title, description, due_date, points });
        const [result] = await pool.execute(
            'INSERT INTO tasks (user_id, title, description, due_date, points) VALUES (?, ?, ?, ?, ?)',
            [userId, title, description, due_date, points]
        );
        return result;
    }

    // Busca todas as tarefas do usuário
    static async findByUserId(userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', // Busca todas as tarefas do usuário ordenadas pela data de criação
            [userId]
        );
        return rows;
    }

    // Atualiza tarefa
    static async update(id, { title, description, due_date, status, points }) {
        const [result] = await pool.execute(
            `UPDATE tasks SET 
                title = ?, 
                description = ?, 
                due_date = ?, 
                status = ?, 
                points = ? 
            WHERE id = ?`,
            [title, description, due_date, status, points, id]
        );
        return result;
    }

    // Deleta tarefa
    static async delete(id) {
        const [result] = await pool.execute(
            'DELETE FROM tasks WHERE id = ?',
            [id]
        );
        return result;
    }
}

module.exports = Task;
