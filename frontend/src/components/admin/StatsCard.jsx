// src/components/admin/StatsCard.jsx

function StatsCard({ title, value, trend, icon, bgColor = 'bg-orange-50' }) {
    const isPositiveTrend = trend?.startsWith('+');

    return (
        <div className={`${bgColor} rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}>
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-white shadow-md">
                    <div className="text-2xl">
                        {icon}
                    </div>
                </div>
                {trend && (
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold
                        ${isPositiveTrend ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {trend}
                    </span>
                )}
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
            <p className="text-sm font-medium text-gray-700">{title}</p>

            <div className="mt-6 pt-4 border-t border-gray-200/50">
                <a href="#" className="text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors flex items-center">
                    View Details
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

export default StatsCard;
