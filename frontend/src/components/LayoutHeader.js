import React from 'react';

const LayoutHeader = ({ user, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-sm p-4 flex justify-between items-center z-10 dark:bg-black dark:bg-opacity-80 dark:text-white">
      <h1 className="text-xl font-semibold">Hola, {user.name}</h1>
      <button
        onClick={onLogout}
        className="text-sm text-orange-600 hover:underline transition-colors dark:text-[#556272]"
      >
        Salir
      </button>
    </header>
  );
};

export default LayoutHeader;

// DONE