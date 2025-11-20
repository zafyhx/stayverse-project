// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { getMyReservations, requestCancellation, getProfile, updateProfile, getMyCancellationRequests } from '../services/api'; // ⬅️ IMPORT WAJIB

function ProfilePage() {
    const [reservations, setReservations] = useState([]);
    const [cancellationRequests, setCancellationRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', email: '' });
    const [saving, setSaving] = useState(false);

    // 1. FUNGSI FETCH DIPISAHKAN
    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await getMyReservations();
            setReservations(response.data);
        } catch (err) {
            setError(err.message);
            console.error("Gagal fetch reservasi:", err);
        } finally {
            setLoading(false);
        }
    };

    // 2. FUNGSI HANDLE CANCELLATION DI LUAR useEffect
    const handleCancellation = async (reservationId) => {
        const reason = window.prompt("Mohon masukkan alasan pembatalan:");

        if (reason) {
            try {
                await requestCancellation({ reservationId, reason });
                alert("Pengajuan pembatalan berhasil diajukan.");
                fetchReservations(); // Refresh list setelah pengajuan
            } catch (err) {
                alert("Pengajuan gagal. Pastikan reservasi belum pernah dibatalkan.");
                console.error("Gagal mengajukan pembatalan:", err);
            }
        }
    };


    // 3. FUNGSI FETCH PROFILE
    const fetchProfile = async () => {
        try {
            const response = await getProfile();
            setProfile(response.data);
            setEditForm({ name: response.data.name, email: response.data.email });
        } catch (err) {
            console.error("Gagal fetch profile:", err);
        }
    };

    // 4. FUNGSI HANDLE EDIT PROFILE
    const handleEditProfile = async () => {
        setSaving(true);
        try {
            await updateProfile(editForm);
            setProfile(editForm);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Failed to update profile: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    // 5. FUNGSI FETCH CANCELLATION REQUESTS
    const fetchCancellationRequests = async () => {
        try {
            const response = await getMyCancellationRequests();
            setCancellationRequests(response.data);
        } catch (err) {
            console.error("Gagal fetch cancellation requests:", err);
        }
    };

    // 6. useEffect hanya bertugas memuat data awal
    useEffect(() => {
        fetchReservations();
        fetchProfile();
        fetchCancellationRequests();
    }, []);

    // ... (kode loading/error display) ...

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 via-blue-600 to-orange-500 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="text-white text-center">Loading your reservations...</div>
            </div>
        </div>
    );
    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 via-blue-600 to-orange-500 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="text-red-300 text-center">Error: {error}</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 via-blue-600 to-orange-500 pt-24 pb-8">
            <div className="max-w-6xl mx-auto px-6">
                {/* User Info Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
                            <p className="text-gray-200">Manage your reservations and account</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-6 py-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                        >
                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </button>
                    </div>

                    {/* Profile Display/Edit Form */}
                    {isEditing ? (
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30">
                            <h3 className="text-xl font-bold text-white mb-4">Edit Personal Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleEditProfile}
                                        disabled={saving}
                                        className="px-6 py-2 bg-green-500/80 hover:bg-green-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditForm({ name: profile.name, email: profile.email });
                                        }}
                                        className="px-6 py-2 bg-gray-500/80 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30">
                            <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-200">Full Name</p>
                                    <p className="text-lg text-white">{profile.name || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-200">Email Address</p>
                                    <p className="text-lg text-white">{profile.email || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Reservations Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl mb-8">
                    <h2 className="text-3xl font-bold text-white mb-6">My Reservations</h2>

                    {reservations.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {reservations.map((res) => (
                                <div key={res.id} className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 relative shadow-xl hover:bg-white/30 transition-all duration-300">
                                    {/* ... (detail reservasi) ... */}
                                    <h3 className="text-xl font-bold text-white mb-3">{res.Hotel.name}</h3>
                                    <div className="space-y-2 mb-4">
                                        <p className="text-gray-200 text-sm">
                                            <span className="font-medium">Check-in:</span> {res.check_in_date}
                                        </p>
                                        <p className="text-gray-200 text-sm">
                                            <span className="font-medium">Check-out:</span> {res.check_out_date}
                                        </p>
                                        <p className="text-lg font-semibold text-orange-300">Total: Rp{res.total_price?.toLocaleString()}</p>
                                    </div>

                                    {/* 4. TAMPILAN STATUS & TOMBOL */}
                                    <div className="flex justify-between items-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${res.status === 'confirmed'
                                            ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                                            : res.status === 'cancelled'
                                                ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                                                : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                                            }`}>
                                            {res.status}
                                        </span>

                                        {/* Tombol hanya muncul jika status masih 'confirmed' */}
                                        {res.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleCancellation(res.id)}
                                                className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-200 text-lg">You haven't made any reservations yet.</p>
                            <p className="text-gray-300 text-sm mt-2">Start exploring amazing hotels!</p>
                        </div>
                    )}
                </div>

                {/* Cancellation Requests Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                    <h2 className="text-3xl font-bold text-white mb-6">My Cancellation Requests</h2>

                    {cancellationRequests.length > 0 ? (
                        <div className="space-y-4">
                            {cancellationRequests.map((request) => (
                                <div key={request.id} className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-xl">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {request.Reservation?.Hotel?.name}
                                            </h3>
                                            <div className="space-y-1 mb-3">
                                                <p className="text-gray-200 text-sm">
                                                    <span className="font-medium">Check-in:</span> {request.Reservation?.check_in_date}
                                                </p>
                                                <p className="text-gray-200 text-sm">
                                                    <span className="font-medium">Check-out:</span> {request.Reservation?.check_out_date}
                                                </p>
                                                <p className="text-gray-200 text-sm">
                                                    <span className="font-medium">Reason:</span> {request.reason}
                                                </p>
                                                <p className="text-gray-200 text-sm">
                                                    <span className="font-medium">Requested:</span> {new Date(request.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                                            ${request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                                                request.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                                                    'bg-red-500/20 text-red-300 border border-red-400/30'}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-200 text-lg">No cancellation requests found.</p>
                            <p className="text-gray-300 text-sm mt-2">Your cancellation request history will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
