import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Importando a logo


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário
        setError('');

        if (!email || !password) {
            setError('Email e senha são obrigatórios.');
            return;
        }
        if (!isValidEmail(email)) {
            setError('Formato de email inválido.');
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/api/auth/login', { email, password }); // Enviando dados para o backend
            console.log('Resposta do servidor:', data); // Log para depuração
            localStorage.setItem('accessToken', data.tokenJwt);
            console.log('Token armazenado:', data.tokenJwt); // Log para depuração
            navigate('/home'); // Redireciona para a página inicial após login
        } catch (err) {
            const msg = err.response?.data?.error || 'Falha ao autenticar.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
            {/* Logo */}
            <div className="mb-8">
                <img
                    src={logo}
                    alt="EzTo-Do"
                    className="w-32 h-32 rounded-full shadow-black/70 shadow-lg"
                />
            </div>

            {/* Header */}
            <h2 className="text-xl font-semibold mb-1">Bem-vindo de volta!</h2>
            <p className="text-sm text-gray-500 mb-6">Faça login na sua conta.</p>

            {/* Card de formulário */}
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4"
            >
                {error && (
                    <p className="text-red-600 text-center">{error}</p>
                )}

                {/* Email */}
                <input
                    type="email"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-100 rounded-xl shadow-inner py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-100 rounded-xl shadow-inner py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />

                {/* Botão Entrar */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white font-medium py-3 rounded-2xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>

                {/* Divider “or” */}
                <div className="flex items-center my-4">
                    <div className="flex-grow h-px bg-gray-300" />
                    <span className="px-2 text-gray-400 text-sm">or</span>
                    <div className="flex-grow h-px bg-gray-300" />
                </div>

                {/* Social Buttons */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
                >
                    <img src="/icons/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                    Continue with Google
                </button>

                {/* Terms */}
                <p className="text-xs text-gray-400 mt-4 text-center">
                    By clicking enter, you agree to our{' '}
                    <a href="#" className="underline">Terms of Service</a> and{' '}
                    <a href="#" className="underline">Privacy Policy</a>.
                </p>
            </form>
        </div>
    );
}
1