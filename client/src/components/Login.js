import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    // Estados de formulário
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Estados de feedback
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Validação simples de email
    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 1) Validações básicas
        if (!email || !password) {
            setError('Email e senha são obrigatórios.');
            return;
        }
        if (!isValidEmail(email)) {
            setError('Formato de email inválido.');
            return;
        }

        // 2) Requisição de login
        setLoading(true);
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            console.log('Login bem-sucedido:', data);
            // 3) Armazenar token e redirecionar
            localStorage.setItem('token', data.token);
            navigate('/tasks');
        } catch (err) {
            console.error('Erro no login:', err);
            const msg = err.response?.data?.error || 'Falha ao autenticar.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded">
            <h2 className="text-2xl mb-4">Login</h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full p-2 border"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-2 border"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-2 bg-blue-600 text-white"
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}
