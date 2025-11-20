// src/pages/admin/UserForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUsers, updateUser } from '../../services/api'; // Kita pakai getUsers karena kita belum punya API get user by ID

function UserForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    // Kita cek apakah ada ID di URL
    const isEditMode = !!id;

    // State untuk form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Efek: Mengambil data user lama (hanya Edit Mode)
    useEffect(() => {
        if (isEditMode) {
            const fetchUserData = async () => {
                try {
                    setLoading(true);
                    // Kita ambil semua user, lalu filter user yang kita mau
                    const response = await getUsers();
                    const userData = response.data.find(u => u.id === parseInt(id));

                    if (userData) {
                        setName(userData.name);
                        setEmail(userData.email);
                        setRole(userData.role);
                    } else {
                        setError('User tidak ditemukan.');
                    }
                } catch (err) {
                    setError('Gagal memuat data user untuk edit. Cek token Admin.');
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        }
    }, [id, isEditMode]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isEditMode) {
            try {
                // 2. Siapkan data yang mau di-update
                const userData = { name, email, role };
                await updateUser(id, userData); // 3. Panggil API PUT

                alert(`User ${name} berhasil diupdate!`);
                navigate('/admin/users'); // Balik ke list

            } catch (err) {
                setError(err.response?.data?.message || 'Update gagal. Cek konsol.');
            } finally {
                setLoading(false);
            }
        }
    };

    // 4. Handle Loading Screen
    if (loading && isEditMode) return <div className="text-center py-12 text-gray-600">Memuat data untuk edit...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center py-8">
            <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-purple-500/20">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">{isEditMode ? `Edit User: ${name}` : 'Add New User (Not Active)'}</h2>
                    <p className="text-purple-200 mt-2">Admin User Management</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Field 1: Name */}
                    <div>
                        <label htmlFor="name" className="block text-white text-sm font-medium mb-2">User Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur
                                border-2 border-purple-500/30 focus:border-purple-400 transition-all text-white placeholder-gray-300"
                            placeholder="Enter user name"
                            required
                        />
                    </div>

                    {/* Field 2: Email (Readonly) */}
                    <div>
                        <label htmlFor="email" className="block text-white text-sm font-medium mb-2">Email</label>
                        {/* Email dibuat readOnly agar tidak bisa diubah di mode edit */}
                        <input
                            id="email"
                            type="email"
                            value={email}
                            readOnly={isEditMode}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur
                                border-2 border-purple-500/30 focus:border-purple-400 transition-all text-white placeholder-gray-300 disabled:opacity-50"
                            placeholder="Enter email address"
                            required
                        />
                    </div>

                    {/* Field 3: Role/Level */}
                    <div>
                        <label htmlFor="role" className="block text-white text-sm font-medium mb-2">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur
                                border-2 border-purple-500/30 focus:border-purple-400 transition-all text-white"
                            required
                        >
                            <option value="user" className="bg-gray-800">Regular User</option>
                            <option value="admin" className="bg-gray-800">Admin</option>
                        </select>
                    </div>

                    {error && <p className="text-red-300 text-sm text-center bg-red-500/20 rounded-lg p-2">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg
                            font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UserForm;
