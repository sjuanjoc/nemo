import React, { useState } from 'react';
import AdminCodeGenerator from './AdminCodeGenerator';
import AdminUserList from './AdminUserList';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('codes'); // 'codes', 'users'

  return (
    <div className="flex flex-col h-full pt-16">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('codes')}
          className={`relative px-6 py-3 text-sm font-medium transition-colors focus:outline-none ${
            activeTab === 'codes'
              ? 'text-orange-600 dark:text-[#556272] border-b-2 border-orange-600 dark:border-[#556272]'
              : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Generador de Códigos
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`relative px-6 py-3 text-sm font-medium transition-colors focus:outline-none ${
            activeTab === 'users'
              ? 'text-orange-600 dark:text-[#556272] border-b-2 border-orange-600 dark:border-[#556272]'
              : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Usuarios
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {activeTab === 'codes' && <AdminCodeGenerator />}
        {activeTab === 'users' && <AdminUserList />}
      </div>
    </div>
  );
};

export default AdminPanel;