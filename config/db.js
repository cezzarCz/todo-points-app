// Arquivo de estabelece conexão com B.D e exporta um pool de conexões.

// Biblioteca para interação com MYSQL
const mysql = require('mysql2/promise');

// Carregando variaveis de ambiente
require('dotenv').config();

// Criando pool de conexões com o B.D 
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Limite de conexões simultanes
    queueLimit: 0
});


// Exportando pool
module.exports = pool;