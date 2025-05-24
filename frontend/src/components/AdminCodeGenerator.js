import React, { useState, useEffect } from 'react';

const AdminCodeGenerator = () => {
  const [codes, setCodes] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    fetch('/api/codigos')
      .then(res => res.json())
      .then(data => {
        const parsed = Object.entries(data).map(([user, code]) => ({
          id: user,
          code,
          status: user.startsWith('codigo_') ? 'disponible' : 'usado',
        }));
        setCodes(parsed);
      });
  }, []);

  const handleGenerateCode = () => {
    fetch('/api/nuevo_codigo', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        const newCode = data.nuevo_codigo;
        setGeneratedCode(newCode);
        setCodes(prev => [
          ...prev,
          { id: `codigo_${Date.now()}`, code: newCode, status: 'disponible' }
        ]);
      });
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Código copiado: ' + code);
  };

  return (
    <div className="p-4 dark:text-gray-100">
      <div className="flex items-center mb-6 space-x-4">
        <button
          onClick={handleGenerateCode}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors dark:bg-[#556272] dark:hover:bg-[#4a5562]"
        >
          GENERAR
        </button>
        <input
          type="text"
          value={generatedCode}
          readOnly
          className="flex-grow px-4 py-2 text-lg rounded-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm dark:bg-gray-700 dark:bg-opacity-20 focus:outline-none"
          placeholder="Código generado"
        />
      </div>

      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-20 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Listado de Códigos</h3>
        <ul className="space-y-3">
          {codes.map(codeItem => (
            <li key={codeItem.id} className="flex justify-between items-center bg-white bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 p-3 rounded-md">
              <span className={`font-semibold ${codeItem.status === 'disponible' ? 'text-green-500' : 'text-red-500'}`}>
                {codeItem.status.toUpperCase()}
              </span>
              <span className="font-mono text-lg">{codeItem.code}</span>
              <button
                onClick={() => handleCopyCode(codeItem.code)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
              >
                Copiar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminCodeGenerator;
