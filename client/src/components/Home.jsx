import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TasksCard from '../components/TasksCard';
import ButtonPrimary from '../components/ButtonPrimary';
import logo from '../assets/logo.png'; // Importando a logo

export default function Home() {
    const [allTasks, setAllTasks] = useState([]);
    const [filter, setFilter] = useState('today');
    const [weeklyPoints, setWeeklyPoints] = useState(0);
    const [totalPoints, setTotalPoints] = useState(100);
    const [editingGoal, setEditingGoal] = useState(false);
    const navigate = useNavigate();

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/api/tasks');
            console.log('Tarefas recebidas:', data); // Log para depuração
            setAllTasks(data);
            // calcular pontos semanais
            const now = new Date();
            const weekFromNow = new Date(now);
            weekFromNow.setDate(now.getDate() + 7);
            const weekTasks = data.filter(task => {
                const due = new Date(task.due_date);
                return due >= now && due <= weekFromNow;
            });
            const points = weekTasks.reduce((sum, t) => sum + (t.points || 0), 0);
            setWeeklyPoints(points);
        } catch (err) {
            console.error('Erro ao buscar tarefas', err);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    // Retorna tarefas segundo filtro
    const getFilteredTasks = () => {
        const now = new Date();
        const tom = new Date(now);
        tom.setDate(now.getDate() + 1);
        const weekFromNow = new Date(now);
        weekFromNow.setDate(now.getDate() + 7);

        return allTasks.filter(task => {
            const due = new Date(task.due_date);
            switch (filter) {
                case 'today':
                    return due.toDateString() === now.toDateString();
                case 'tomorrow':
                    return due.toDateString() === tom.toDateString();
                case 'week':
                    return due >= now && due <= weekFromNow;
                case 'all':
                default:
                    return true;
            }
        });
    };

    // Função para atualizar o status da tarefa
    const handleComplete = async (taskId) => {
        try {
            const task = allTasks.find(t => t.id === taskId);
            const updatedStatus = task.status === 'pendente' ? 'concluída' : 'pendente';

            // Enviar requisição para atualizar o status
            await api.put(`/api/tasks/${taskId}`, { status: updatedStatus });

            // Atualizar o estado local
            setAllTasks(allTasks.map(t => (t.id === taskId ? { ...t, status: updatedStatus } : t)));
        } catch (err) {
            console.error('Erro ao atualizar tarefa:', err);
        }
    };


    const tasks = getFilteredTasks();

    // Cálculo de progresso semanal
    const progressPoints = allTasks
        .filter(task => task.status === 'concluída')
        .reduce((sum, t) => sum + (t.points || 0), 0);

    const progressPercent = totalPoints > 0 ? (progressPoints / totalPoints) * 100 : 0;

    return (
        <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,_#F8F9FA,_#D0D0D0)]">
            {/* Logo */}
            <div className="flex justify-center items-center py-6">
                <img
                    src={logo}
                    alt="EzTo-Do"
                    className="w-24 h-24 rounded-full shadow-black/70 shadow-lg"
                />
            </div>

            <div className="flex-1 px-6 py-4">
                {/* Card Meta Semanal */}
                <div className="rounded-2xl shadow-2xl p-5 mb-6 relative bg-[radial-gradient(ellipse_at_top,_#F8F9FA,_#D0D0D0)] text-black">
                    <h3 className="text-lg font-medium mb-2">Meta Semanal</h3>
                    <p className="text-sm text-purple-600 mb-4 flex items-center gap-2">
                        {progressPoints} /
                        {editingGoal ? (
                            <input
                                type="number"
                                min={1}
                                max={1000}
                                placeholder="Defina sua meta"
                                value={totalPoints}
                                autoFocus
                                onChange={(e) => setTotalPoints(Number(e.target.value))}
                                onBlur={() => setEditingGoal(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setEditingGoal(false);
                                    }
                                }}
                                className="w-20 px-2 py-1 rounded border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                        ) : (
                            <span
                                className="font-bold cursor-pointer underline underline-offset-2"
                                title='Clique para editar sua meta'
                                onClick={() => setEditingGoal(true)}
                            >
                                {totalPoints}
                            </span>
                        )}
                        pontos
                    </p>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full"
                            style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #a259ff, #7b3eff)' }}
                        />
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold">
                        {Math.round(progressPercent)}%
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex space-x-4 mb-4">
                    {[{ key: 'today', label: 'Hoje' }, { key: 'tomorrow', label: 'Amanhã' }, { key: 'week', label: 'Semana' }, { key: 'all', label: 'Todos' }].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-4 py-2 rounded-full text-sm transition ${filter === f.key ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Lista de tarefas */}
                <h2 className="text-lg font-medium mb-4">Suas Tarefas {
                    filter === 'today' ? 'para hoje' :
                        filter === 'tomorrow' ? 'para amanhã' :
                            filter === 'week' ? 'para esta semana' :
                                filter === 'all' ? '' : `para ${filter} `}
                </h2>
                <div className="space-y-4 mb-6 flex flex-col">
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <TasksCard
                                key={task.id}
                                task={task}
                                onComplete={handleComplete}
                                onEdit={(task) => navigate('/tasks/new', { state: { task } })}
                                onDelete={async (taskId) => {
                                    try {
                                        await api.delete(`/api/tasks/${taskId}`);
                                        setAllTasks(allTasks.filter(t => t.id !== taskId));
                                    } catch (err) {
                                        console.error('Erro ao excluir tarefa:', err);
                                    }
                                }}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Nenhuma tarefa encontrada.</p>
                    )}
                </div>

                {/* Botao de adicionar tarefas */}
                <div className="flex justify-center">
                    <ButtonPrimary
                        onClick={() => navigate('/tasks/new')}
                        className="w-16 h-16 rounded-full text-4xl p-0 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
                    >
                        +
                    </ButtonPrimary>
                </div>
            </div>
        </div>
    );
}
