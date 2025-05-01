import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    // Estados de formulário
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Estados de erro/feedback
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Validação simples de email
    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 1) Validações básicas
        if (!username || !email || !password) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        if (!isValidEmail(email)) {
            setError('Formato de email inválido.');
            return;
        }
        if (password.length < 6) {
            setError('A senha deve ter ao menos 6 caracteres.');
            return;
        }

        // 2) Envia ao backend
        setLoading(true);
        try {
            const { data } = await api.post('/api/auth/register', {
                username,
                email,
                password
            });
            console.log('Resposta do servidor:', data);
            // Se criou, armazena token e redireciona
            localStorage.setItem('token', data.token);
            navigate('/tasks');
        } catch (err) {
            console.error(err);
            // Captura mensagem de erro do backend
            const msg = err.response?.data?.error || 'Erro ao registrar.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded">
            <h2 className="text-2xl mb-4">Registrar</h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Usuário</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full p-2 border"
                    />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full p-2 border"
                    />
                </div>
                <div className="mb-3">
                    <label>Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-2 border"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-2 bg-blue-600 text-white"
                >
                    {loading ? 'Registrando...' : 'Registrar'}
                </button>
            </form>
        </div>
    );
}
