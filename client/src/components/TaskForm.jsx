import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/logo.png';

export default function TaskForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('pending');
    const [points, setPoints] = useState(0);
    const location = useLocation();
    const task = location.state?.task || null;

    // Objeto de erro para cada campo
    const [errors, setErrors] = useState({
        title: '',
        description: '',
        dueDate: '',
        points: '',
    });

    const navigate = useNavigate();


    // Função de validação de campos do forms
    const validateForm = () => {
        const newErrors = {
            title: '',
            description: '',
            dueDate: '',
            points: '',
        };

        let isValid = true;

        // Validação do titulo
        if (!title.trim()) {
            newErrors.title = 'O título é obrigatório.';
            isValid = false;
        } else if (title.length < 3) {
            newErrors.title = 'O título deve ter pelo menos 3 caracteres.';
            isValid = false;
        } else if (title.length > 50) {
            newErrors.title = 'O título deve ter no máximo 50 caracteres.';
            isValid = false;
        }

        // Validação da descrição
        if (!description.trim()) {
            newErrors.description = 'A descrição é obrigatória.';
            isValid = false;
        } else if (description.length < 5) {
            newErrors.description = 'A descrição deve ter pelo menos 5 caracteres.';
            isValid = false;
        } else if (description.length > 500) {
            newErrors.description = 'A descrição deve ter no máximo 500 caracteres.';
            isValid = false;
        }

        // Validação da data
        if (!dueDate) {
            newErrors.dueDate = 'A data de vencimento é obrigatória.';
            isValid = false;
        } else {
            const today = new Date();
            const selectedDate = new Date(dueDate);
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) { // Verifica se a data é anterior a hoje
                newErrors.dueDate = 'A data de vencimento não pode ser anterior a hoje.';
                isValid = false;
            }
        }

        // Validação dos pontos
        if (!points) {
            newErrors.points = 'Os pontos são obrigatórios.';
            isValid = false;
        } else if (points <= 0) {
            newErrors.points = 'Os pontos não podem ser zero ou negativos.';
        }
        else if (points > 100) {
            newErrors.points = 'Os pontos não podem ser maiores que 100.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const clearError = (fieldName) => {
        if (errors[fieldName]) {
            setErrors({ ...errors, [fieldName]: '' });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Se o formulário não for válido, não envia
        console.log('Dados enviados:', {
            title,
            description,
            due_date: dueDate,
            points
        });
        try {

            if (task) {
                // Atualiza a task existente
                await api.put(`/api/tasks/${task.id}`, {
                    title,
                    description,
                    due_date: dueDate,
                    points
                });
            } else {
                await api.post('/api/tasks', {
                    title,
                    description,
                    due_date: dueDate,
                    points
                });
            }
            // Redireciona para a página de tarefas após o envio bem-sucedido
            navigate('/home');
        } catch (err) {
            console.error('Erro ao criar tarefa:', err);
            // Exibe mensagem de erro genérica ou específica
            const msg = err.response?.data?.error || 'Falha ao criar tarefa.';
            setErrors(prev => ({ ...prev, general: msg }));
        }
    }

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setStatus('pending');
        setPoints(0);
        setErrors({
            title: '',
            description: '',
            dueDate: '',
            points: '',
            general: ''
        });
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

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    {task ? 'Editar Tarefa Existente' : 'Criar Nova Tarefa'}
                </h2>

                {/* Exibição de erro geral */}
                {errors.general && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título*</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                clearError('title');
                            }}
                            className={`w-full bg-gray-100 rounded-xl shadow-inner py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 ${errors.title ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descrição</label>
                        <textarea
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                clearError('description');
                            }}
                            className={`w-full bg-gray-100 rounded-xl shadow-inner py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 ${errors.description ? 'border-red-500' : ''}`}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                            {description.length}/500 caracteres
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vencimento*</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => {
                                setDueDate(e.target.value);
                                clearError('dueDate');
                            }}
                            className={`w-full bg-gray-100 rounded-xl shadow-inner py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 ${errors.dueDate ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pontos</label>
                        <input
                            type="number"
                            value={points}
                            onChange={(e) => {
                                setPoints(Number(e.target.value));
                                clearError('points');
                            }}
                            className={`w-full bg-gray-100 rounded-xl shadow-inner py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 ${errors.points ? 'border-red-500' : ''}`}
                            min="0"
                            max="100"
                        />
                        {errors.points && <p className="text-red-500 text-sm mt-1">{errors.points}</p>}
                    </div>

                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-medium py-3 rounded-2xl shadow-lg hover:opacity-90 transition-opacity"
                        >
                            Salvar
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 bg-gray-300 text-gray-800 font-medium py-3 rounded-2xl shadow-lg hover:bg-gray-400 transition"
                        >
                            Limpar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}