// src/components/ButtonPrimary.jsx
import React from 'react';

export default function ButtonPrimary({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`bg-gradient-to-r from-purple-600 to-purple-400 text-white font-medium py-3 px-6 rounded-2xl shadow-lg hover:opacity-90 transition-opacity ${className}`}
    >
      {children}
    </button>
  );
}
