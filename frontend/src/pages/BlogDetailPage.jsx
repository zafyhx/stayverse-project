// src/pages/BlogDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogPostById } from '../services/api';

function BlogDetailPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await getBlogPostById(id);
                setPost(response.data);
            } catch (err) {
                // Gagal memuat biasanya 404 jika ID-nya salah
                setError('Gagal memuat artikel. Artikel mungkin sudah dihapus.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div className="text-center py-12 text-gray-600">Memuat artikel...</div>;
    if (error) return <div className="text-center py-12 text-red-600">Error: {error}</div>;
    if (!post) return <div className="text-center py-12 text-gray-600">Artikel tidak ditemukan.</div>; // Ditampilkan jika API merespons 200 tapi data null

    return (
        <div className="pt-24 min-h-screen bg-gray-50">
            {/* Hero Image */}
            <div className="relative h-[50vh] overflow-hidden">
                <img
                    src={post?.imageUrl ? (post.imageUrl.startsWith('http') ? post.imageUrl : `http://localhost:5001${post.imageUrl}`) : 'https://source.unsplash.com/1600x900/?travel'}
                    alt={post?.title}
                    className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="container mx-auto max-w-4xl text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post?.title}</h1>
                        <div className="flex items-center space-x-4 text-gray-200">
                            <span>By {post?.author}</span>
                            <span>•</span>
                            <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto max-w-4xl px-6 py-12">
                <article className="prose prose-lg max-w-none bg-white rounded-xl shadow-lg p-8">
                    <div className="whitespace-pre-line text-gray-700">{post?.content}</div>
                </article>
            </div>
        </div>
    );
}

export default BlogDetailPage;
