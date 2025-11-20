// src/pages/admin/BlogForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

function BlogForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    // State untuk form
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('Admin');
    const [category, setCategory] = useState('Travel Tips');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. useEffect: Mengambil data lama jika dalam mode Edit
    useEffect(() => {
        if (isEditMode) {
            const fetchPostData = async () => {
                try {
                    setLoading(true);
                    const response = await api.get(`/admin/blogs/${id}`);
                    const postData = response.data;

                    // Isi state dengan data lama
                    setTitle(postData.title);
                    setContent(postData.content);
                    setAuthor(postData.author || 'Admin');
                    setCategory(postData.category || 'Travel Tips');
                    if (postData.imageUrl) {
                        setImagePreview(postData.imageUrl.startsWith('http') ? postData.imageUrl : `http://localhost:5001${postData.imageUrl}`);
                    }
                } catch (err) {
                    setError('Gagal memuat data artikel untuk edit.');
                } finally {
                    setLoading(false);
                }
            };
            fetchPostData();
        }
    }, [id, isEditMode]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!title || !content) {
            setError('Judul dan Konten wajib diisi.');
            setLoading(false);
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('title', title);
            submitData.append('content', content);
            submitData.append('author', author);
            submitData.append('category', category);
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            if (isEditMode) {
                // Mode EDIT: Panggil API PUT
                await api.put(`/admin/blogs/${id}`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert(`Artikel '${title}' berhasil diupdate!`);
            } else {
                // Mode TAMBAH: Panggil API POST
                await api.post('/admin/blogs', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert(`Artikel '${title}' berhasil diterbitkan!`);
            }

            navigate('/admin/blog'); // Balik ke halaman list

        } catch (err) {
            setError(err.response?.data?.message || 'Operasi gagal. Cek konsol.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) return <div className="text-center py-12 text-gray-600">Memuat data untuk edit...</div>;


    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? 'Edit Article' : 'Create New Article'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter article title"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Author</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter author name"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter category"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    />
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="mt-2 rounded-lg h-48 object-cover" />
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="12"
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your article content here..."
                        required
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/blog')}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                            disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Save Article'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BlogForm;
