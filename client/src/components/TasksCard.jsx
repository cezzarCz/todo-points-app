import React from 'react';

export default function TaskCard({ task, onEdit, onDelete, onComplete }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={task.status === 'concluída'}
          onChange={() => onComplete(task.id)}
          className="w-5 h-5"
          style={{ accentColor: task.status === 'concluída' ? '#a259ff' : '#7b3eff' }}
        />
        <div>
          <h4 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h4>
          <p className="text-sm text-gray-500">{task.description}</p>
        </div>
      </div>
      {/*Botões de editar e excluir tarefa*/}
      <div className="flex space-x-4">
        <button
          onClick={() => onEdit(task)}
          className="
            flex flex-col items-center
            text-blue-500 
            cursor-pointer
            shadow
            hover:shadow-lg
            transition-shadow
            focus:outline-none
            hover:text-blue-700">
          <span className='text-xl'>✏️</span>
          <span className='text-xs mt-1'>Editar</span>
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="
            flex flex-col items-center 
            text-red-500 
            cursor-pointer
            shadow
            hover:shadow-lg
            transition-shadow
            focus:outline-none 
            hover:text-red-700">
          <span className='text-xl'>🗑️</span>
          <span className='text-xs mt-1'>Excluir</span>
        </button>
      </div>
    </div>
  );
}