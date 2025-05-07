import React from 'react';

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
      <div>
        <h4 className="font-medium">{task.title}</h4>
        <p className="text-sm text-gray-500">{task.description}</p>
      </div>
      <div className="space-x-2">
        <button onClick={onEdit} className="text-blue-500">✏️</button>
        <button onClick={onDelete} className="text-red-500">🗑️</button>
      </div>
    </div>
  );
}
