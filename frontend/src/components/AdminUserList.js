import React, { useState, useEffect } from 'react';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [sortByOption, setSortByOption] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetch('/api/codigos')
      .then(res => res.json())
      .then(codes => {
        const usuarios = Object.entries(codes)
          .filter(([usuario, _]) => !usuario.startsWith('codigo_')) // descarta códigos no asignados
          .map(([usuario, codigo]) => ({
            id: usuario,
            name: usuario,
            code: codigo,
            weight: '-', // pendiente
            date: '-',   // pendiente
          }));
        setUsers(usuarios);
      });
  }, []);

  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split('-');
    setSortByOption(key);
    setSortDirection(direction);

    const sorted = [...users].sort((a, b) => {
      if (key === 'name') {
        return direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

    setUsers(sorted);
  };

  return (
    <div className="p-4 dark:text-gray-100">
      <div className="flex items-center mb-6 space-x-4">
        <label htmlFor="sort" className="text-gray-800 dark:text-gray-100">Ordenar por:</label>
        <select
          id="sort"
          className="px-4 py-2 rounded-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm dark:bg-gray-700 dark:bg-opacity-20 focus:outline-none"
          value={`${sortByOption}-${sortDirection}`}
          onChange={handleSortChange}
        >
          <option value="name-asc">Nombre (A-Z)</option>
          <option value="name-desc">Nombre (Z-A)</option>
        </select>
      </div>

      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-20 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Listado de Usuarios</h3>
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Código</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Peso</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-4 py-2 whitespace-nowrap text-gray-800 dark:text-gray-200">{user.name}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-800 dark:text-gray-200">{user.code}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-800 dark:text-gray-200">{user.weight}</td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-800 dark:text-gray-200">{user.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserList;
