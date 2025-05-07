// Tela principal do app
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


export default function Home() {
    const [allTasks, setAllTasks] = useState([]);
    const [filter, setFilter] = useState('today');
    const navigate = useNavigate();

    // Buscar todas as tarefas ao carregar o componente
    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get('/api/tasks');
                setAllTasks(data);
            } catch (err) {
                console.error('Erro ao buscar tarefas', err);
            }
        })();
    }, []);

    // Filtros de tarefas por data
    const getFilteredTasks = () => {
        const now = new Date();
        return allTasks.filter(task => {
            const due = new Date(task.due_date);
            switch (filter) {
                case 'today':
                    return due.toDateString() === now.toDateString();
                case 'tomorrow':
                    const tom = new Date(now);
                    tom.setDate(now.getDate() + 1);
                    return due.toDateString() === tom.toDateString();
                case 'week':
                    const weekFromNow = new Date(now);
                    weekFromNow.setDate(now.getDate() + 7);
                    return due >= now && due <= weekFromNow;
                case 'all':
                default:
                    return true;
            }
        });
    };

    const tasks = getFilteredTasks();

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6">
            {/* Meta Semanal (ainda sem valor) */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Meta Semanal</h2>
                <p className="text-gray-500">Você ainda não definiu uma meta.</p>
            </div>

            {/* Barra de Filtros */}
            <div className="flex gap-2 mb-6">
                {['today', 'tomorrow', 'week', 'all'].map(key => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-4 py-2 rounded 
                ${filter === key ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        {key === 'today' ? 'Hoje'
                            : key === 'tomorrow' ? 'Amanhã'
                                : key === 'week' ? 'Semana'
                                    : 'Todos'}
                    </button>
                ))}
            </div>

            {/* Lista de Tarefas */}
            <ul className="space-y-3 mb-6">
                {tasks.length
                    ? tasks.map(t => (
                        <li key={t.id} className="p-4 border rounded">
                            <h3 className="font-medium">{t.title}</h3>
                            <p className="text-sm text-gray-600">
                                Vencimento: {new Date(t.due_date).toLocaleDateString()}
                            </p>
                        </li>
                    ))
                    : <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
                }
            </ul>

            {/* Botão Nova Tarefa */}
            <button
                onClick={() => navigate('/tasks/new')}
                className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full text-2xl"
            >
                +
            </button>
        </div>
    );
}