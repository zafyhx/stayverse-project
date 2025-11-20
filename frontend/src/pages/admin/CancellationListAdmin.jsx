// src/pages/admin/CancellationListAdmin.jsx
import { useState, useEffect } from 'react';
// Impor fungsi deleteCancellationRequest yang akan kita buat sebentar lagi
import { getCancellationRequests, updateCancellationStatus, deleteCancellationRequest } from '../../services/api';
import { Link } from 'react-router-dom';

function CancellationListAdmin() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await getCancellationRequests();
            setRequests(response.data);
        } catch (err) {
            setError('Gagal memuat pengajuan. Token Admin mungkin expired.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // FUNGSI UNTUK UPDATE STATUS (SETUJUI/TOLAK)
    const handleStatusUpdate = async (id, status) => {
        const action = status === 'approved' ? 'menyetujui' : 'menolak';
        if (window.confirm(`Yakin ingin ${action} pengajuan ini?`)) {
            try {
                await updateCancellationStatus(id, { status });
                alert(`Pengajuan berhasil di${action}.`);
                fetchRequests(); // Refresh list
            } catch (err) {
                console.error('Error updating status:', err);
                alert(`Gagal ${action} pengajuan. Cek konsol untuk detail error.`);
            }
        }
    };

    // FUNGSI BARU UNTUK HAPUS REQUEST
    const handleDeleteRequest = async (id) => {
        if (window.confirm('Yakin ingin menghapus pengajuan ini secara permanen?')) {
            try {
                // Panggil API Delete
                await deleteCancellationRequest(id);
                alert('Pengajuan berhasil dihapus.');
                fetchRequests(); // Refresh list
            } catch (err) {
                alert('Gagal menghapus pengajuan.');
            }
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-600">Memuat pengajuan pembatalan...</div>;
    if (error) return <div className="text-center py-12 text-red-600">Error: {error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cancellation Requests</h2>

            <div className="grid gap-6">
                {requests.map(req => (
                    <div key={req.id} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Booking #{req.Reservation?.id}
                                </h3>
                                <p className="text-gray-600">{req.Reservation?.Hotel?.name}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                                ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'}`}>
                                {req.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700"><strong>Reason:</strong> {req.reason}</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleStatusUpdate(req.id, 'approved')}
                                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(req.id, 'rejected')}
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleDeleteRequest(req.id)}
                                className="py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CancellationListAdmin;
