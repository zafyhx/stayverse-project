// src/pages/CheckInPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkInReservation, getMyReservations } from '../services/api';

function CheckInPage() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkingIn, setCheckingIn] = useState(false);
    const navigate = useNavigate();

    // Fetch eligible reservations for check-in
    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await getMyReservations();
            // Filter only confirmed reservations that can be checked in
            const eligibleReservations = response.data.filter(res => res.status === 'confirmed');
            setReservations(eligibleReservations);
        } catch (err) {
            setError(err.message);
            console.error("Failed to fetch reservations:", err);
        } finally {
            setLoading(false);
        }
    };

    // Handle check-in
    const handleCheckIn = async (reservationId) => {
        setCheckingIn(true);
        try {
            await checkInReservation({ reservationId });
            alert("Check-in successful! Welcome to your hotel.");
            navigate('/profile'); // Redirect to profile to see updated status
        } catch (err) {
            alert("Check-in failed: " + err.message);
        } finally {
            setCheckingIn(false);
        }
    };

    useState(() => {
        fetchReservations();
    }, []);

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
        <div className="min-h-screen bg-gradient-to-br from-orange-500 via-blue-600 to-orange-500 py-8">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8 shadow-2xl">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-2">Hotel Check-in</h1>
                        <p className="text-gray-200">Complete your check-in process for confirmed reservations</p>
                    </div>
                </div>

                {/* Check-in Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                    <h2 className="text-3xl font-bold text-white mb-6">Available for Check-in</h2>

                    {reservations.length > 0 ? (
                        <div className="space-y-6">
                            {reservations.map((res) => (
                                <div key={res.id} className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">{res.Hotel.name}</h3>
                                            <p className="text-gray-200 text-sm mb-1">{res.Hotel.location}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-400/30 rounded-full text-xs font-bold uppercase">
                                            Confirmed
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-200">Check-in Date</p>
                                            <p className="text-lg text-white">{res.check_in_date}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-200">Check-out Date</p>
                                            <p className="text-lg text-white">{res.check_out_date}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-200">Total Price</p>
                                            <p className="text-lg font-semibold text-orange-300">Rp{res.total_price?.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-300">
                                            Check-in is available on or after your check-in date
                                        </p>
                                        <button
                                            onClick={() => handleCheckIn(res.id)}
                                            disabled={checkingIn}
                                            className="px-6 py-3 bg-blue-500/80 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {checkingIn ? 'Processing...' : 'Check In Now'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-200 text-lg">No reservations available for check-in.</p>
                            <p className="text-gray-300 text-sm mt-2">Make sure you have confirmed reservations that are ready for check-in.</p>
                            <button
                                onClick={() => navigate('/profile')}
                                className="mt-4 px-6 py-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                            >
                                View My Reservations
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CheckInPage;
