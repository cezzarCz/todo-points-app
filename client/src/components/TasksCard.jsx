import React from 'react';

export default function TaskCard({ task, onEdit, onDelete, onComplete }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex justify-between items-start">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <input
          type="checkbox"
          checked={task.status === 'concluída'}
          onChange={() => onComplete(task.id)}
          className="w-5 h-5"
          style={{ accentColor: task.status === 'concluída' ? '#a259ff' : '#7b3eff' }}
        />
        <div className='flex-1 min-w-0 max-w-full'>
          <h4 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h4>
          <p className="text-sm text-gray-500 break-words whitespace-pre-line max-w-full">
            {task.description}
          </p>
        </div>
      </div>
      {/*Botões de editar e excluir tarefa (a)*/} 
      <div className="flex flex-col space-y-2 ml-4 flex-shrink-0">
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