// Middleware que irá verificar o Token JWT, para aunteticar requisições
// Função intermediaria que antecede requisições enviadas dos clientes ao backend
// para garantir que, neste caso, o cliente esta autorizado a consumir os endpoints.

const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization'); // Obtém o token do cabeçalho da requisição

    if (!authHeader) {
        return res.status(403).json({ message: 'Accesso Negado. Token JWT não encontrado.' }); // Codigo 403 = Forbidden (Acesso negado)
    }

    const token = authHeader.split(' ')[1]; // Extrai o token do cabeçalho (formato "Bearer token")
    if (!token) {
        return res.status(403).json({ message: 'Token mal formatado.' }); 
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token com a chave secreta
        req.user = verified; // Adiciona os dados do usuário ao objeto req
        next(); // Continua para o próximo middleware ou rota
    } catch (err) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};

module.exports = verifyToken;