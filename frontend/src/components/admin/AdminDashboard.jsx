import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import StatsCard from './StatsCard';
import { getDashboardStats, getBookingLogs, getCancellationLogs } from '../../services/api';

function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [bookingLogs, setBookingLogs] = useState([]);
    const [cancellationLogs, setCancellationLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('booking'); // 'booking' or 'cancellation'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, bookingRes, cancellationRes] = await Promise.all([
                    getDashboardStats(),
                    getBookingLogs(),
                    getCancellationLogs()
                ]);
                setStats(statsRes.data);
                setBookingLogs(bookingRes.data);
                setCancellationLogs(cancellationRes.data);
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error('Dashboard error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center py-12">Loading dashboard...</div>;
    if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

    return (
        <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers || 0}
                    trend="+5.2%"
                    icon="👥"
                />
                <StatsCard
                    title="Total Hotels"
                    value={stats.totalHotels || 0}
                    trend="+2.1%"
                    icon="🏨"
                />
                <StatsCard
                    title="Total Reservations"
                    value={stats.totalReservations || 0}
                    trend="+8.7%"
                    icon="📅"
                />
                <StatsCard
                    title="Approved Cancellations"
                    value={stats.totalCancellations || 0}
                    trend="-1.3%"
                    icon="❌"
                />
            </div>

            {/* Tab Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('booking')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'booking'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        📋 Log Reservasi
                    </button>
                    <button
                        onClick={() => setActiveTab('cancellation')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'cancellation'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        🚫 Log Pembatalan
                    </button>
                </div>

                {/* Booking Logs */}
                {activeTab === 'booking' && (
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-gray-800">📋 Recent Booking Logs</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {bookingLogs.length > 0 ? bookingLogs.map((log) => (
                                <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Customer</p>
                                                    <p className="font-semibold text-gray-800">{log.User?.name}</p>
                                                    <p className="text-sm text-gray-600">{log.User?.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Hotel</p>
                                                    <p className="font-semibold text-gray-800">{log.Hotel?.name}</p>
                                                    <p className="text-sm text-gray-600">{log.Hotel?.location}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-600">Check-in:</span>
                                                    <p className="text-gray-800">{log.check_in_date}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Check-out:</span>
                                                    <p className="text-gray-800">{log.check_out_date}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Booked:</span>
                                                    <p className="text-gray-800">{new Date(log.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block
                                                ${log.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    log.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                {log.status}
                                            </span>
                                            <p className="text-lg font-bold text-green-600 mt-1">
                                                Rp{log.total_price?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-lg">No recent bookings found</p>
                                    <p className="text-gray-400 text-sm mt-1">Booking logs will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Cancellation Logs */}
                {activeTab === 'cancellation' && (
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-gray-800">🚫 Cancellation Request Logs</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {cancellationLogs.length > 0 ? cancellationLogs.map((log) => (
                                <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Customer</p>
                                                    <p className="font-semibold text-gray-800">{log.Reservation?.User?.name}</p>
                                                    <p className="text-sm text-gray-600">{log.Reservation?.User?.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Hotel</p>
                                                    <p className="font-semibold text-gray-800">{log.Reservation?.Hotel?.name}</p>
                                                    <p className="text-sm text-gray-600">{log.Reservation?.Hotel?.location}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-2">
                                                <div>
                                                    <span className="font-medium text-gray-600">Check-in:</span>
                                                    <p className="text-gray-800">{log.Reservation?.check_in_date}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Check-out:</span>
                                                    <p className="text-gray-800">{log.Reservation?.check_out_date}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Requested:</span>
                                                    <p className="text-gray-800">{new Date(log.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <p className="text-sm font-medium text-gray-600">Cancellation Reason:</p>
                                                <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded mt-1">{log.reason}</p>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                                                ${log.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    log.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {log.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-lg">No cancellation requests found</p>
                                    <p className="text-gray-400 text-sm mt-1">Cancellation logs will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Charts Section - Placeholder for now */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Bookings Overview</h3>
                    <p className="text-gray-500">Chart implementation pending...</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue Chart</h3>
                    <p className="text-gray-500">Chart implementation pending...</p>
                </div>
            </div>
        </div>
    );
}
