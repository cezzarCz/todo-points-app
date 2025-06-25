const express = require('express');
const router = express.Router(); // Cria um objeto Router, roteador para definir as rotas
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

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


// Rota de exclusão de usuário
// DELETE /api/auth/delete/:id
// Controller: authController.deleteUser
router.delete(
    '/me', // Alteração para usar '/me' para referenciar o usuário autenticado
    verifyToken,
    authController.deleteUser // Função que trata a requisição
);

// Exporta o roteador para ser utilizado em outros arquivos
module.exports = router; // Exporta o objeto router

