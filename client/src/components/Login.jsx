import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Importando a logo


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

                {/* Divisor */}
                <div className="flex flex-col items-center my-4">
                    <div className="flex items-center w-full mb-4">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="mx-4 text-gray-400 text-sm">ou</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>
                    <span className="text-gray-400 text-sm mb-1">Não tem uma conta?</span>
                    <a href="/register" className="text-purple-600 hover:underline mb-2">Crie sua conta</a>
                    <div className="w-full h-px bg-gray-300" />
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-400 mt-4 text-center">
                    Ao clicar em 'Entrar', você concorda com nossos{' '}
                    <a href="#" className="underline">Termos de Serviço</a> e{' '}
                    <a href="#" className="underline">Política de Privadidade</a>.
                </p>
            </form >
        </div >
    );
}
1