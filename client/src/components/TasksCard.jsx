import React from 'react';

export default function TaskCard({ task, onEdit, onDelete, onComplete }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onComplete(task.id)}
          className="w-5 h-5"
          style={{ accentColor: task.completed ? '#a259ff' : '#7b3eff' }}
        />
        <div>
          <h4 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h4>
          <p className="text-sm text-gray-500">{task.description}</p>
        </div>
      </div>
      <div className="space-x-2">
        <button onClick={() => onEdit(task)} className="text-blue-500">✏️</button>
        <button onClick={() => onDelete(task.id)} className="text-red-500">🗑️</button>
      </div>
    </div>
  );
}