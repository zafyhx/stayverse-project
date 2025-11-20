// src/pages/admin/UserListAdmin.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../../services/api';

function UserListAdmin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all, admin, user

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            setUsers(response.data);
        } catch (err) {
            setError('Gagal mengambil data user. Token Admin mungkin expired.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Yakin ingin menghapus user: ${name}?`)) {
            try {
                await deleteUser(id);
                alert(`User '${name}' berhasil dihapus.`);
                fetchUsers();
            } catch (err) {
                alert('Gagal menghapus user. Cek konsol.');
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || user.role === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) return <div className="text-center py-12 text-gray-600">Memuat data user...</div>;
    if (error) return <div className="text-center py-12 text-red-600">Error: {error}</div>;

    return (
        <div className="p-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manajemen User</h2>

                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="search"
                            placeholder="Cari pengguna..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                            focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Semua Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">Pengguna Biasa</option>
                    </select>
                </div>
            </div>

            {/* Daftar Pengguna */}
            <div className="grid gap-4">
                {filteredUsers.map(user => (
                    <div key={user.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                                <p className="text-gray-500">{user.email}</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {user.role}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    to={`/admin/users/edit/${user.id}`}
                                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    Edit
                                </Link>
                                {user.role !== 'admin' && (
                                    <button
                                        onClick={() => handleDelete(user.id, user.name)}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserListAdmin;
