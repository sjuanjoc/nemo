import React, { useState, useEffect } from 'react';
import AuthLogin from './components/AuthLogin';
import AuthAdminLogin from './components/AuthAdminLogin';
import LayoutHeader from './components/LayoutHeader';
import ConversationInterface from './components/ConversationInterface';
import AdminPanel from './components/AdminPanel';
import { getStorage, setStorage } from './utils/storage';
import { getCurrentTheme, applyTheme } from './utils/theme';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(null); // inicia sin página
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());

  useEffect(() => {
    const storedUser = getStorage('currentUser', null);
    if (storedUser) {
      setCurrentUser(storedUser);
      if (storedUser.id === 'admin-1') {
        setCurrentPage('adminPanel');
      } else {
        setCurrentPage('conversation');
      }
    } else {
      setCurrentPage('login'); // forzar a login si no hay usuario
    }

    applyTheme(currentTheme);
    const interval = setInterval(() => {
      const newTheme = getCurrentTheme();
      if (newTheme !== currentTheme) {
        setCurrentTheme(newTheme);
        applyTheme(newTheme);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentTheme]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setStorage('currentUser', user);
    setCurrentPage('conversation');
  };

  const handleLogout = () => {
    setStorage('currentUser', null);
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleGoToAdminLogin = () => {
    setCurrentPage('adminLogin');
  };

  const handleAdminLogin = (user) => {
    setCurrentUser(user);
    setStorage('currentUser', user);
    setCurrentPage('adminPanel');
  };

  const handleGoBackToLogin = () => {
    setCurrentPage('login');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-black text-gray-100' : 'bg-white text-gray-900'}`}>
      {currentUser && <LayoutHeader user={currentUser} onLogout={handleLogout} />}

      <main className="flex-grow flex flex-col">
        {currentPage === 'login' && <AuthLogin onLogin={handleLogin} onGoToAdminLogin={handleGoToAdminLogin} />}
        {currentPage === 'adminLogin' && <AuthAdminLogin onLogin={handleAdminLogin} onGoBack={handleGoBackToLogin} />}
        {currentPage === 'conversation' && currentUser && <ConversationInterface />}
        {currentPage === 'adminPanel' && currentUser && <AdminPanel />}
      </main>
    </div>
  );
};

export default App;
