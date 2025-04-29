// Arquivo que lida com as rotas de autenticação (registro e login) da API

const express = require('express'); // Framework para criar APIs
const router = express.Router(); // Cria um objeto Router, roteador para definir as rotas

// Importa o controlador de autenticação
const authController = require('../controllers/authController'); // Controlador de autenticação


// Rota de registro de usuário
// POST /api/auth/register
// Controller: authController.register
router.post( // Definimos um endpoint que escuta requisições POST na rota '/register'
    '/register', 
    authController.register // Função que trata a requisição
);

// Rota de login de usuário
// POST /api/auth/login
// Controller: authController.login
router.post(
    '/login', 
    authController.login // Função que trata a requisição
);  

// Exporta o roteador para ser utilizado em outros arquivos
module.exports = router; // Exporta o objeto router