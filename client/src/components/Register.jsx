import { use, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Importando a logo

export default function Register() {
    // Estados de formulário
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
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
            localStorage.setItem('accessToken', data.tokenJwt);
            navigate('/home');
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
            <h2 className="text-xl font-semibold mb-1">Crie sua conta!</h2>
            <p className="text-sm text-gray-500 mb-6">Registre-se para começar a usar.</p>

            {/* Card de formulário */}
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4"
            >
                {error && (
                    <p className="text-red-600 text-center">{error}</p>
                )}

                {/* Usuário */}
                <input
                    type="text"
                    placeholder="Usuário"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    className="w-full bg-gray-100 rounded-xl shadow-inner py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />

                {/* Email */}
                <input
                    type="email"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-100 rounded-xl shadow-inner py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />

                {/* Senha */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full bg-gray-100 rounded-xl shadow-inner py-3 px-4 pr-12 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        tabIndex={-1}
                        aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    >
                        {showPassword ? (
                            // Ícone de olho aberto
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        ) : (
                            // Ícone de olho fechado
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.249-2.383A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Confirmar Senha */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirmar Senha"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        className="w-full bg-gray-100 rounded-xl shadow-inner py-3 px-4 pr-12 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        tabIndex={-1}
                        aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    >
                        {showPassword ? (
                            // Ícone de olho aberto
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        ) : (
                            // Ícone de olho fechado
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.249-2.383A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Botão Registrar */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white font-medium py-3 rounded-2xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? 'Registrando...' : 'Registrar'}
                </button>

                {/* Terms */}
                <p className="text-xs text-gray-400 mt-4 text-center">
                    Ao clicar em registrar, você concorda com nossos{' '}
                    <a href="#" className="underline">Termos de Serviço</a> e{' '}
                    <a href="#" className="underline">Política de Privacidade</a>.
                </p>
            </form>
        </div>
    );
}
