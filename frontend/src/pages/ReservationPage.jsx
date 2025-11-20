// src/pages/ReservationPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelById, createReservation } from '../services/api';
import {
  Hotel,
  User,
  CalendarDays,
  BedDouble,
  MessageSquare,
  Loader2
} from 'lucide-react';

// --- Helper Components (Moved Outside) ---

const StarIcon = () => (
  <svg className="w-4 h-4 fill-orange-400" viewBox="0 0 20 20">
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Main Page Component ---

function ReservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hotel Data State
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Form State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  // Guest Info Form State (Refactored from getElementById)
  const [guestInfo, setGuestInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  // Fetch Hotel Data
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const response = await getHotelById(id);
        setHotel(response.data);
      } catch (err) {
        setError('Gagal mengambil data hotel.');
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  // Controlled component handler
  const handleGuestInfoChange = (e) => {
    const { id, value } = e.target;
    setGuestInfo((prevInfo) => ({
      ...prevInfo,
      [id]: value
    }));
  };

  // --- Calculation Logic ---
  const calculateBookingDetails = () => {
    if (!checkIn || !checkOut || !hotel) return null;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) return null; // Prevent negative nights

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return null;

    const pricePerNight = hotel.discount_percentage > 0 ? hotel.discounted_price : hotel.price_per_night;
    const totalPrice = pricePerNight * nights * numberOfRooms; // Added numberOfRooms to calculation

    return {
      nights,
      price: totalPrice,
      pricePerNight
    };
  };

  const bookingDetails = calculateBookingDetails();

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError('Tanggal check-out harus setelah check-in.');
      setLoading(false);
      return;
    }

    if (!bookingDetails) {
      setError('Detail pemesanan tidak valid. Periksa kembali tanggal Anda.');
      setLoading(false);
      return;
    }

    try {
      const reservationData = {
        hotelId: hotel.id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        total_price: bookingDetails.price,
        number_of_rooms: numberOfRooms,
        number_of_guests: numberOfGuests,
        guest_name: guestInfo.fullName,
        guest_email: guestInfo.email,
        guest_phone: guestInfo.phone,
        special_request: guestInfo.specialRequests
      };

      await createReservation(reservationData);

      alert('Reservasi berhasil!');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Reservasi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // --- Loading & Error States ---

  if (loading && !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat data hotel...</p>
        </div>
      </div>
    );
  }

  if (error && !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  // --- Render JSX ---

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section (Text Dihapus) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 pt-24 pb-32 shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-blue-400 rounded-full -top-48 -right-48"></div>
          <div className="absolute w-96 h-96 bg-orange-400 rounded-full -bottom-48 -left-48"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Teks hero sengaja dikosongkan sesuai permintaan */}
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-20 relative z-20 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* --- Left Column: Hotel Card --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-32">
              {/* Hotel Image (Fixed) */}
              <img
                src={hotel.imageUrl || 'https://source.unsplash.com/800x600/?hotel'}
                alt={hotel?.name}
                className="w-full h-48 object-cover"
              />

              {/* Hotel Details */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{hotel?.name}</h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">4.8 (245 reviews)</span>
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl p-4 mb-6">
                  {hotel?.discount_percentage > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">Harga Diskon</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-orange-500">
                          Rp{hotel?.discounted_price?.toLocaleString()}
                        </span>
                        <span className="text-sm line-through text-slate-400">
                          Rp{hotel?.price_per_night?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-green-600">Hemat {hotel?.discount_percentage}%</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">Harga per Malam</p>
                      <p className="text-3xl font-bold text-orange-500">
                        Rp{hotel?.price_per_night?.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 text-sm">Fasilitas</h4>
                  <div className="space-y-2">
                    {['WiFi Gratis', 'AC', 'TV Kabel'].map((amenity, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckIcon />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Column: Form --- */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="bg-orange-100 text-orange-600 rounded-lg p-2 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </span>
                Informasi Pribadi
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={guestInfo.fullName}
                    onChange={handleGuestInfoChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-orange-500 focus:outline-none bg-slate-50 transition-colors"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={guestInfo.email}
                    onChange={handleGuestInfoChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-orange-500 focus:outline-none bg-slate-50 transition-colors"
                    placeholder="Masukkan email"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={guestInfo.phone}
                    onChange={handleGuestInfoChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-orange-500 focus:outline-none bg-slate-50 transition-colors"
                    placeholder="Masukkan nomor telepon"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Booking Dates Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="bg-blue-100 text-blue-600 rounded-lg p-2 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </span>
                Tanggal Menginap
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="checkIn" className="block text-sm font-semibold text-slate-700 mb-2">
                    Tanggal Check-in
                  </label>
                  <input
                    id="checkIn"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-orange-500 focus:outline-none bg-slate-50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="checkOut" className="block text-sm font-semibold text-slate-700 mb-2">
                    Tanggal Check-out
                  </label>
                  <input
                    id="checkOut"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-orange-500 focus:outline-none bg-slate-50 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Room Details Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="bg-orange-100 text-orange-600 rounded-lg p-2 flex items-center justify-center">
                  <BedDouble className="w-5 h-5" />
                </span>
                Jumlah Kamar & Tamu
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="numberOfRooms" className="block text-sm font-semibold text-slate-700 mb-2">
                    Jumlah Kamar
                  </label>
                  <input
                    id="numberOfRooms"
                    type="number"
                    min="1"
                    value={numberOfRooms}
                    onChange={(e) => setNumberOfRooms(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-orange-500 focus:outline-none bg-slate-50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="numberOfGuests" className="block text-sm font-semibold text-slate-700 mb-2">
                    Jumlah Tamu
                  </label>
                  <input
                    id="numberOfGuests"
                    type="number"
                    min="1"
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-orange-500 focus:outline-none bg-slate-50 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Special Requests Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="bg-blue-100 text-blue-600 rounded-lg p-2 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </span>
                Permintaan Khusus
              </h3>

              <label htmlFor="specialRequests" className="block text-sm font-semibold text-slate-700 mb-2">
                Catatan atau Permintaan Khusus (Opsional)
              </label>
              <textarea
                id="specialRequests"
                rows="4"
                value={guestInfo.specialRequests}
                onChange={handleGuestInfoChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-orange-500 focus:outline-none bg-slate-50 transition-colors resize-none"
                placeholder="Contoh: Ingin kamar dengan pemandangan, dll..."
              />
            </div>

            {/* Booking Summary */}
            {bookingDetails && (
              <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl p-8 border-2 border-orange-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Ringkasan Pemesanan</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Hotel</span>
                    <span className="font-semibold text-slate-900">{hotel?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Malam yang dipesan</span>
                    <span className="font-semibold text-slate-900">{bookingDetails.nights} malam</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Harga per malam</span>
                    <span className="font-semibold text-slate-900">
                      Rp{bookingDetails.pricePerNight?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Jumlah kamar</span>
                    <span className="font-semibold text-slate-900">{numberOfRooms}</span>
                  </div>
                </div>

                <div className="border-t-2 border-orange-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Total Harga</span>
                    <span className="text-3xl font-bold text-orange-500">
                      Rp{bookingDetails.price?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !bookingDetails}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Memproses...
                </span>
              ) : (
                'Konfirmasi Pemesanan'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReservationPage;