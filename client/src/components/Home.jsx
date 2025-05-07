import { useState, useEffect } from 'react';
import api from '../api/axios';
import TasksCard from '../components/TasksCard';
import ButtonPrimary from '../components/ButtonPrimary';

export default function Home() {
    const [allTasks, setAllTasks] = useState([]);
    const [filter, setFilter] = useState('today');

    const [weeklyPoints, setWeeklyPoints] = useState(0);
    const totalPoints = 100; // exemplo de meta semanal

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/api/tasks');
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

    const tasks = getFilteredTasks();

    // Cálculo de progresso semanal
    const progressPercent = Math.min((weeklyPoints / totalPoints) * 100, 100);

    return (
        <div className="min-h-screen flex flex-col
            bg-[linear-gradient(180deg,_#F8F9FA,_#D0D0D0)]">
            <div className="flex-1 px-6 py-4">
                {/* Card Meta Semanal */}
                <div className="rounded-2xl shadow-2xl p-5 mb-6 relative
                    bg-[radial-gradient(ellipse_at_top,_#F8F9FA,_#D0D0D0)] text-black">
                    <h3 className="text-lg font-medium mb-2">Meta Semanal</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        {weeklyPoints} / {totalPoints} pontos
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
                    {[
                        { key: 'today', label: 'Hoje' },
                        { key: 'tomorrow', label: 'Amanhã' },
                        { key: 'week', label: 'Semana' },
                        { key: 'all', label: 'Todos' },
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-4 py-2 rounded-full text-sm transition
                ${filter === f.key ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Lista de tarefas */}
                <div className="space-y-4 mb-6">
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Nenhuma tarefa encontrada.</p>
                    )}
                </div>

                {/* Botão Adicionar Tarefa */}
                <div className="flex justify-center">
                    <ButtonPrimary onClick={() => navigate('/tasks/new')} className="w-16 h-16 rounded-full text-4xl p-0 flex items-center justify-center">
                        +
                    </ButtonPrimary>
                </div>
            </div>
        </div>
    );
}
