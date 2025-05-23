// Controller de Autenticação
// Lógica para manipulação de dados do User

const bcrypt = require('bcrypt'); // Criptografia da senha
const jwt = require('jsonwebtoken'); // Tokens de autenticação
const User = require('../models/User');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        // Extraindo dados enviados no corpo da requisição
        const { username, email, password } = req.body;

        // Validando se os todos os campos estão presentes
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' }); // Codigo 400 = Bad Request
        }

        // Valindo se o user ja existe no BD
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email já cadastrado.' }); // Codigo 409 = Conflict
        }

        // Criptografando senha do user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Utilizando método do modelo User para criar o User no BD
        const newUser = await User.create({ username, email, password: hashedPassword });

        // Geração de token JWT 
        const tokenJwt = jwt.sign(
            { userId: newUser.insertId, email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Retornando resposta ao cliente
        res.status(201).json({ message: 'Usuário registrado com sucesso.', tokenJwt }); // Codigo 201 = Created (Sucesso)
    } catch (error) {
        console.error('Erro no registro do usuário, tente novamente.', error);
        res.status(500).json({ error: 'Erro interno no servidor.' }) // Codigo 500 = Internal Server Error (Deu ruim)
    }
};


exports.login = async (req, res) => {
    try {
        // Extraindo dados da requisição
        const { email, password } = req.body;

        // Validar se os campos estão presentes
        if (!email || !password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        // Verificando se o usuário existe no BD
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Usuario não encontrado.' });
        }

        // Verificando se a senha está correta
        // Metodo bcrypt.compare() compara a senha fornecida com a senha armazenada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });

        }

        // Gerando token JWT
        const tokenJwt = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Retorna resposta ao cliente
        res.status(200).json({ message: 'Login bem-sucedido.', tokenJwt });

    } catch (error) {
        console.error('Erro no login do usuário, tente novamente.', error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};

// Método para deletar um usuário (opcional, mas útil para testes)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.body; // ID do usuário a ser deletado

        // Verifica se o ID foi fornecido
        if (!id) {
            return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
        }

        // Deletando o usuário do banco de dados
        const result = await User.deleteById(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Retorna resposta ao cliente
        res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar usuário.', error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};

