// Definição de modelo de Users
const pool = require('../config/db');

// Definindo classe User
class User {
    static async create({ username, email, password }) { // Método responsavel por criar users no DB.
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, password]
        );
        return result;
    }


    static async findByEmail(email) { // Método para consulta de users via email
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    // Metodo para apagar um user do DB
    static async deleteById(id) {
        const [result] = await pool.execute(
            'DELETE FROM users WHERE id = ?',
            [id]
        );
        return result;
    }

}

module.exports = User;
