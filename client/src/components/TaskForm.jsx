import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function TaskForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('pending');
    const [points, setPoints] = useState(0);

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
        } else if (description.length > 300) {
            newErrors.description = 'A descrição deve ter no máximo 200 caracteres.';
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

    const clearError = () => {
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
            await api.post('/api/tasks', {
                title,
                description,
                due_date: dueDate,
                points
            });
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
        <div className="max-w-md mx-auto mt-10 p-4 border rounded">
            <h2 className="text-2xl mb-4">Nova Tarefa</h2>

            {/* Exibição de erro geral */}
            {errors.general && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="block">Título*</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            clearError('title');
                        }}
                        className={`w-full p-2 border ${errors.title ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div className="mb-3">
                    <label className="block">Descrição</label>
                    <textarea
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            clearError('description');
                        }}
                        className={`w-full p-2 border ${errors.description ? 'border-red-500' : ''}`}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                        {description.length}/500 caracteres
                    </p>
                </div>

                <div className="mb-3">
                    <label className="block">Vencimento*</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => {
                            setDueDate(e.target.value);
                            clearError('dueDate');
                        }}
                        className={`w-full p-2 border ${errors.dueDate ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
                </div>


                <div className="mb-3">
                    <label className="block">Pontos</label>
                    <input
                        type="number"
                        value={points}
                        onChange={(e) => {
                            setPoints(Number(e.target.value));
                            clearError('points');
                        }}
                        className={`w-full p-2 border ${errors.points ? 'border-red-500' : ''}`}
                        min="0"
                        max="100"
                    />
                    {errors.points && <p className="text-red-500 text-sm mt-1">{errors.points}</p>}
                </div>

                <div className="flex space-x-2">
                    <button
                        type="submit"
                        className="flex-1 p-2 bg-green-600 text-white hover:bg-green-700 rounded"
                    >
                        Salvar
                    </button>

                    <button
                        type="button"
                        onClick={resetForm}
                        className="p-2 bg-gray-300 text-gray-800 hover:bg-gray-400 rounded"
                    >
                        Limpar
                    </button>
                </div>
            </form>
        </div>
    );
}