import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import StatsCard from '../../components/admin/StatsCard';
import { getDashboardStats, getBookingLogs, getCancellationLogs, getChartData } from '../../services/api';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [bookingLogs, setBookingLogs] = useState([]);
    const [cancellationLogs, setCancellationLogs] = useState([]);
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('booking'); // 'booking' or 'cancellation'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, bookingRes, cancellationRes, chartRes] = await Promise.all([
                    getDashboardStats(),
                    getBookingLogs(),
                    getCancellationLogs(),
                    getChartData()
                ]);
                setStats(statsRes.data);
                setBookingLogs(bookingRes.data);
                setCancellationLogs(cancellationRes.data);
                setChartData(chartRes.data);
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Customer</p>
                                                    <p className="text-base font-bold text-gray-900 mt-1">{log.User?.name}</p>
                                                    <p className="text-sm text-gray-600">{log.User?.email}</p>
                                                    <div className="mt-3 pt-2 border-t border-gray-200">
                                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Booked</span>
                                                        <p className="text-sm font-semibold text-gray-800 mt-1">{new Date(log.createdAt).toLocaleDateString('id-ID')}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Hotel</p>
                                                    <p className="text-base font-bold text-gray-900 mt-1">{log.Hotel?.name}</p>
                                                    <p className="text-sm text-gray-600">{log.Hotel?.location}</p>
                                                    <div className="mt-3 pt-2 border-t border-gray-200">
                                                        <div className="grid grid-cols-2 gap-1">
                                                            <div>
                                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-in</span>
                                                                <p className="text-sm font-semibold text-gray-800 mt-1">{new Date(log.check_in_date).toLocaleDateString('id-ID')}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-out</span>
                                                                <p className="text-sm font-semibold text-gray-800 mt-1">{new Date(log.check_out_date).toLocaleDateString('id-ID')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-2">
                                                <div>
                                                    <span className="font-medium text-gray-600">Rooms:</span>
                                                    <p className="text-gray-800">{log.number_of_rooms}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Guests:</span>
                                                    <p className="text-gray-800">{log.number_of_guests}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-2">
                                                <div>
                                                    <span className="font-medium text-gray-600">Guest Name:</span>
                                                    <p className="text-gray-800">{log.guest_name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Guest Email:</span>
                                                    <p className="text-gray-800">{log.guest_email || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm mb-2">
                                                <span className="font-medium text-gray-600">Guest Phone:</span>
                                                <p className="text-gray-800">{log.guest_phone || 'N/A'}</p>
                                            </div>
                                            {log.special_request && (
                                                <div className="mt-2">
                                                    <p className="text-sm font-medium text-gray-600">Special Request:</p>
                                                    <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded mt-1">{log.special_request}</p>
                                                </div>
                                            )}
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Customer</p>
                                                    <p className="text-base font-bold text-gray-900 mt-1">{log.Reservation?.User?.name}</p>
                                                    <p className="text-sm text-gray-600">{log.Reservation?.User?.email}</p>
                                                    <div className="mt-3 pt-2 border-t border-gray-200">
                                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Requested</span>
                                                        <p className="text-sm font-semibold text-gray-800 mt-1">{new Date(log.createdAt).toLocaleDateString('id-ID')}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Hotel</p>
                                                    <p className="text-base font-bold text-gray-900 mt-1">{log.Reservation?.Hotel?.name}</p>
                                                    <p className="text-sm text-gray-600">{log.Reservation?.Hotel?.location}</p>
                                                    <div className="mt-3 pt-2 border-t border-gray-200">
                                                        <div className="grid grid-cols-2 gap-1">
                                                            <div>
                                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-in</span>
                                                                <p className="text-sm font-semibold text-gray-800 mt-1">{new Date(log.Reservation?.check_in_date).toLocaleDateString('id-ID')}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-out</span>
                                                                <p className="text-sm font-semibold text-gray-800 mt-1">{new Date(log.Reservation?.check_out_date).toLocaleDateString('id-ID')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">📊 Reservasi & Pembatalan Bulanan</h3>
                    {chartData.monthlyReservations && chartData.monthlyCancellations ? (
                        <Line
                            data={{
                                labels: chartData.monthlyReservations.map(item => item.month),
                                datasets: [
                                    {
                                        label: 'Reservasi',
                                        data: chartData.monthlyReservations.map(item => item.reservations),
                                        borderColor: 'rgb(59, 130, 246)',
                                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                        tension: 0.4,
                                    },
                                    {
                                        label: 'Pembatalan',
                                        data: chartData.monthlyCancellations.map(item => item.cancellations),
                                        borderColor: 'rgb(239, 68, 68)',
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                    ) : (
                        <p className="text-gray-500">Loading chart data...</p>
                    )}
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">💰 Pendapatan Bulanan</h3>
                    {chartData.monthlyRevenue ? (
                        <Line
                            data={{
                                labels: chartData.monthlyRevenue.map(item => item.month),
                                datasets: [
                                    {
                                        label: 'Pendapatan (Rp)',
                                        data: chartData.monthlyRevenue.map(item => item.revenue),
                                        borderColor: 'rgb(34, 197, 94)',
                                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: function (value) {
                                                return 'Rp' + value.toLocaleString();
                                            }
                                        }
                                    },
                                },
                            }}
                        />
                    ) : (
                        <p className="text-gray-500">Loading revenue data...</p>
                    )}
                </div>
            </div>

            {/* Additional Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">📈 Reservasi Harian (30 Hari Terakhir)</h3>
                    {chartData.dailyReservations ? (
                        <Line
                            data={{
                                labels: chartData.dailyReservations.map(item => new Date(item.date).toLocaleDateString()),
                                datasets: [
                                    {
                                        label: 'Reservasi Harian',
                                        data: chartData.dailyReservations.map(item => item.reservations),
                                        borderColor: 'rgb(147, 51, 234)',
                                        backgroundColor: 'rgba(147, 51, 234, 0.1)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                    ) : (
                        <p className="text-gray-500">Loading daily data...</p>
                    )}
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">📊 Distribusi Status Reservasi</h3>
                    {stats.reservationStatusBreakdown && Object.keys(stats.reservationStatusBreakdown).length > 0 ? (
                        <Doughnut
                            data={{
                                labels: Object.keys(stats.reservationStatusBreakdown),
                                datasets: [
                                    {
                                        data: Object.values(stats.reservationStatusBreakdown),
                                        backgroundColor: [
                                            'rgba(34, 197, 94, 0.8)', // confirmed - green
                                            'rgba(251, 191, 36, 0.8)', // pending - yellow
                                            'rgba(239, 68, 68, 0.8)', // cancelled - red
                                            'rgba(156, 163, 175, 0.8)', // other - gray
                                        ],
                                        borderColor: [
                                            'rgb(34, 197, 94)',
                                            'rgb(251, 191, 36)',
                                            'rgb(239, 68, 68)',
                                            'rgb(156, 163, 175)',
                                        ],
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                    },
                                },
                            }}
                        />
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">No reservation data available</p>
                            <p className="text-gray-400 text-sm mt-1">Chart will appear when reservations are made</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
