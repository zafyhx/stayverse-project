// src/pages/admin/BlogListAdmin.jsx
import { useState, useEffect } from 'react';
import { getBlogPosts, deleteBlogPost } from '../../services/api';
import { Link } from 'react-router-dom';

function BlogListAdmin() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Fungsi fetchPosts dipisahkan agar bisa dipanggil ulang
    const fetchPosts = async () => {
        try {
            const response = await getBlogPosts();
            setPosts(response.data);
        } catch (err) {
            setError('Gagal memuat data blog. Token Admin mungkin expired.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id, title) => {
        if (window.confirm(`Yakin ingin menghapus artikel: ${title}?`)) {
            try {
                await deleteBlogPost(id);
                alert(`Artikel '${title}' berhasil dihapus.`);
                fetchPosts(); // Refresh list
            } catch (err) {
                alert('Gagal menghapus artikel. Cek konsol.');
                console.error("Delete Blog Gagal:", err);
            }
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    if (loading) return <div className="text-center py-12 text-gray-600">Memuat daftar artikel...</div>;
    if (error) return <div className="text-center py-12 text-red-600">Error: {error}</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Manajemen Artikel Blog</h2>
                <Link to="/admin/blog/add"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg 
                    hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg">
                    + Tulis Artikel Baru
                </Link>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[240px]">
                    <input
                        type="search"
                        placeholder="Cari artikel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                </select>
            </div>

            {/* List Artikel */}
            <div className="grid gap-4">
                {filteredPosts.map(post => (
                    <div key={post.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 
                        overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-48 h-32 md:h-auto bg-gray-200 flex items-center justify-center">
                            {post.imageUrl ? (
                                <img
                                    src={post.imageUrl.startsWith('http') ? post.imageUrl : `http://localhost:5001${post.imageUrl}`}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <span className="text-gray-400 text-sm">No Image</span>
                            )}
                        </div>
                        <div className="flex-1 p-6">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        Oleh {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/admin/blog/edit/${post.id}`}
                                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(post.id, post.title)}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BlogListAdmin;
