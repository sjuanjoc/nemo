import React, { useState } from 'react';
import { setStorage } from '../utils/storage';

const AuthLogin = ({ onLogin, onGoToAdminLogin }) => {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  const handleLogin = async () => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('codigo', code);

    const res = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if (res.redirected) {
      const user = { name: username, code };
      setStorage('currentUser', user);
      onLogin(user);
      window.location.href = res.url;
    } else {
      const msg = await res.text();
      alert(msg || 'Error al iniciar sesión.');
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden dark:bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#556272] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-20 p-8 rounded-[2rem] shadow-2xl w-full max-w-sm">
        <input
          type="text"
          placeholder="Usuario"
          className="w-full px-4 py-3 mb-4 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition dark:focus:ring-[#556272] bg-white bg-opacity-0 focus:bg-opacity-10 dark:bg-gray-700 dark:bg-opacity-0 dark:focus:bg-opacity-10 backdrop-filter backdrop-blur-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Código"
          className="w-full px-4 py-3 mb-6 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition dark:focus:ring-[#556272] bg-white bg-opacity-0 focus:bg-opacity-10 dark:bg-gray-700 dark:bg-opacity-0 dark:focus:bg-opacity-10 backdrop-filter backdrop-blur-sm"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 text-white text-lg py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-lg dark:bg-[#556272] dark:hover:bg-[#4a5562]"
        >
          Entrar
        </button>
      </div>
      <button
        onClick={onGoToAdminLogin}
        className="relative z-10 mt-4 text-sm text-gray-700 dark:text-gray-300 hover:underline"
      >
        admin
      </button>
    </div>
  );
};

export default AuthLogin;
