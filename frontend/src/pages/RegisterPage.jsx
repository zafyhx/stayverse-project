// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

function RegisterPage() {
    // 2. Tambah 'name' di sini
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 3. Panggil API 'register'
            await register({ name, email, password });

            // 4. SUKSES! Lempar user ke halaman Login
            //    biar dia bisa login pakai akun barunya.
            navigate('/login');

        } catch (err) {
            // 5. GAGAL! Tampilkan error (mungkin email sudah dipakai)
            setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
            console.error("Register gagal:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-blue-600 to-orange-500">
            <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Create Account</h2>
                    <p className="text-gray-200 mt-2">Join StayVerse today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 6. TAMBAHAN FIELD 'NAME' */}
                    <div>
                        <label htmlFor="name" className="block text-white text-sm font-medium mb-2">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur
                                border-2 border-transparent focus:border-orange-500 transition-all"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-white text-sm font-medium mb-2">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur
                                border-2 border-transparent focus:border-orange-500 transition-all"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-white text-sm font-medium mb-2">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur
                                border-2 border-transparent focus:border-orange-500 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p className="text-red-300 text-sm text-center bg-red-500/20 rounded-lg p-2">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg
                            font-medium transition-colors transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                {/* 7. LINK UNTUK BALIK KE LOGIN */}
                <div className="mt-6 text-center">
                    <Link to="/login" className="text-white hover:text-orange-200 transition-colors">
                        Already have an account? Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
