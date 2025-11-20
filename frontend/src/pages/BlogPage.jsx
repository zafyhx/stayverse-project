// src/pages/BlogPage.jsx
import React, { useState, useEffect } from 'react';
import { getBlogPosts } from '../services/api';
import { Link } from 'react-router-dom';
import {
  Backpack,
  DollarSign,
  Map as MapIcon,
  Globe,
  Building,
  Shield,
  Home,
  AlertTriangle,
  Lightbulb,
  UtensilsCrossed,
  Store,
  ChefHat,
  Coffee,
  Building2
} from 'lucide-react';

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getBlogPosts();
        setPosts(response.data || []);
      } catch (err) {
        setError('Gagal memuat artikel blog.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categories = [
    'All',
    'Travel Tips',
    'Hotel Reviews',
    'Destinations',
    'Food & Dining'
  ];

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);

    // Smooth scroll to the appropriate section based on category
    setTimeout(() => {
      let targetSection = null;
      switch (categoryName) {
        case 'Travel Tips':
          targetSection = document.getElementById('travel-tips-section');
          break;
        case 'Hotel Reviews':
          targetSection = document.getElementById('hotel-reviews-section');
          break;
        case 'Destinations':
          targetSection = document.getElementById('destinations-section');
          break;
        case 'Food & Dining':
          targetSection = document.getElementById('food-dining-section');
          break;
        default:
          targetSection = document.getElementById('blog-grid-section');
      }

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const filteredPosts =
    activeCategory === 'All'
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  const featuredPost = posts.length > 0 ? posts[0] : null;

  const travelTips = [
    {
      title: "Real Talk: What I Wish I Knew Before My First Bali Trip",
      description:
        "Don't believe the hype about 'cheap' Bali - I spent $50 on a taxi from airport because I didn't know about Grab. Always download the app first! Pro tip: Book airport transfer in advance, it's worth every penny.",
      icon: <Backpack className="w-10 h-10 text-orange-500" />,
      readTime: '5 min read'
    },
    {
      title: 'Hotel Horror Stories & How to Avoid Them',
      description:
        "Booked a 'luxury resort' online, arrived to find cockroaches in the bathroom. Always check recent reviews from the last month, not just the average rating. Pay extra for verified reviews.",
      icon: <DollarSign className="w-10 h-10 text-orange-500" />,
      readTime: '7 min read'
    },
    {
      title: 'Monsoon Madness: When to Actually Visit Southeast Asia',
      description:
        "Went to Thailand in September thinking it was shoulder season. Rained every day for 2 weeks! Next time I'm checking actual weather data, not just tourist brochures.",
      icon: <MapIcon className="w-10 h-10 text-orange-500" />,
      readTime: '6 min read'
    }
  ];

  if (loading) return <div className="text-center py-12 text-gray-600">Memuat artikel...</div>;
  if (error) return <div className="text-center py-12 text-red-600">Error: {error}</div>;

  return (
    // Background utama halaman adalah bg-gray-50
    <div className="pt-24 min-h-screen bg-gray-50">
      {/* Hero Section (kept as-is per request) */}
      <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/hero-background.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-orange-900/30" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Travel Stories & Insights</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8">
            Discover travel tips, hotel reviews, destination guides, and insider knowledge from our expert travelers
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${activeCategory === category ? 'bg-white text-orange-600' : 'bg-orange-700/50 text-orange-100 hover:bg-orange-700/70'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page content wrapper (consistent horizontal spacing like dashboard) */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 py-12 space-y-16">
        {/* Featured Post */}
        {/* Biarkan ini tetap bg-white karena ini adalah kartu 'featured' khusus */}
        {featuredPost && (
          <section>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.imageUrl ? (featuredPost.imageUrl.startsWith('http') ? featuredPost.imageUrl : `http://localhost:5001${featuredPost.imageUrl}`) : 'https://source.unsplash.com/800x600/?travel'}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Featured</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">{featuredPost.content?.substring(0, 200)}...</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">{featuredPost.author?.charAt(0)?.toUpperCase()}</div>
                      <div>
                        <p className="font-medium text-gray-900">{featuredPost.author}</p>
                        <p className="text-sm text-gray-500">
                          {featuredPost.createdAt && new Date(featuredPost.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Link to={`/blog/${featuredPost.id}`} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium">Read More →</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Travel Tips Section -- bg-white DIHAPUS */}
        <section id="travel-tips-section" className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Travel Tips</h2>
          {/* Kartu-kartu ini tetap bg-white */}
          <div className="grid md:grid-cols-3 gap-8">
            {travelTips.map((tip, index) => (
              <article key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                <div className="mb-4">{tip.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{tip.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-3">{tip.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{tip.readTime}</span>
                  <button className="text-orange-600 hover:text-orange-700 font-medium">Read More →</button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Essential Travel Tips for Southeast Asia</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Kartu-kartu ini tetap bg-white */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2"><Globe className="w-6 h-6 text-orange-500" />Visa & Entry Requirements</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Check visa requirements for each country</li>
                  <li>• Some countries offer visa-on-arrival</li>
                  <li>• Keep digital copies of your passport</li>
                  <li>• Plan for border crossings between countries</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2"><DollarSign className="w-6 h-6 text-orange-500" />Currency & Money Matters</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• USD is widely accepted in tourist areas</li>
                  <li>• Use ATMs for best exchange rates</li>
                  <li>• Carry small denominations for tips</li>
                  <li>• Credit cards accepted in major hotels</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2"><Building className="w-6 h-6 text-orange-500" />Accommodation Tips</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Book in advance during peak season</li>
                  <li>• Use reputable booking platforms</li>
                  <li>• Check hotel reviews thoroughly</li>
                  <li>• Consider location vs. price balance</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2"><Shield className="w-6 h-6 text-orange-500" />Health & Safety</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Get necessary vaccinations</li>
                  <li>• Drink bottled water only</li>
                  <li>• Use mosquito repellent</li>
                  <li>• Keep valuables secure</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Hotel Reviews Section -- bg-white DIHAPUS */}
        <section id="hotel-reviews-section" className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Real Guest Reviews</h2>
          <div className="max-w-6xl mx-auto">
            {/* Kartu-kartu ini punya background sendiri (gradient biru/hijau) */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Building2 className="w-6 h-6 text-orange-500" />Bali Luxury Resort Reviews</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Ayodya Resort Bali</span>
                      <div className="flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐ <span className="text-gray-600 ml-1">4.8</span></div>
                    </div>
                    <p className="text-sm text-gray-600 italic mb-2">"The infinity pool overlooking the rice terraces is absolutely stunning. Staff remembered our names and preferences. Only complaint: the WiFi was spotty in our villa." - Emma, London</p>
                    <p className="text-xs text-gray-500">Stayed: March 2024 • Room: Deluxe Villa</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">St. Regis Bali Resort</span>
                      <div className="flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐ <span className="text-gray-600 ml-1">4.6</span></div>
                    </div>
                    <p className="text-sm text-gray-600 italic mb-2">"Butcher's table breakfast was incredible - fresh tropical fruits and Balinese coffee. Butler service was attentive but not intrusive. Beach could be cleaner." - David, New York</p>
                    <p className="text-xs text-gray-500">Stayed: January 2024 • Room: Ocean Suite</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Home className="w-6 h-6 text-orange-500" />Budget & Boutique Hotel Reviews</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Uma Ubud</span>
                      <div className="flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐ <span className="text-gray-600 ml-1">4.7</span></div>
                    </div>
                    <p className="text-sm text-gray-600 italic mb-2">"Hidden gem in the jungle! The treehouse villas are magical. Yoga classes at sunrise were the highlight. Mosquitoes were bad though - bring strong repellent." - Sarah, Melbourne</p>
                    <p className="text-xs text-gray-500">Stayed: February 2024 • Room: Treehouse Villa</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Alila Manggis</span>
                      <div className="flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐ <span className="text-gray-600 ml-1">4.5</span></div>
                    </div>
                    <p className="text-sm text-gray-600 italic mb-2">"Perfect balance of luxury and sustainability. Mangrove walks were amazing. Food was outstanding but portions were small for the price. Worth it for the location." - James, Singapore</p>
                    <p className="text-xs text-gray-500">Stayed: April 2024 • Room: Beachfront Villa</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-500" />Common Complaints We Hear</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li><strong>WiFi Issues:</strong> "Internet was terrible in our room" - Multiple guests</li>
                  <li><strong>Beach Quality:</strong> "Beach had too much seaweed/debris" - Bali resorts</li>
                  <li><strong>Food Portions:</strong> "Amazing food but tiny portions" - Luxury hotels</li>
                  <li><strong>Mosquitoes:</strong> "Bring industrial strength repellent" - Jungle areas</li>
                  <li><strong>Hidden Fees:</strong> "Extra charges for airport transfer" - Budget hotels</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-orange-500" />Pro Tips from Real Travelers</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li><strong>Book Direct:</strong> "Got 20% discount by booking directly" - Emma</li>
                  <li><strong>Request High Floor:</strong> "Better views and less noise upstairs" - David</li>
                  <li><strong>Check Reviews Monthly:</strong> "Hotel quality can change quickly" - Sarah</li>
                  <li><strong>Negotiate Everything:</strong> "Talked price down $50/night" - James</li>
                  <li><strong>Arrive Early:</strong> "Got upgraded to better room" - Multiple guests</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Read hundreds more real guest reviews and find your perfect stay!</p>
              <Link to="/hotels" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">View All Hotel Reviews →</Link>
            </div>
          </div>
        </section>

        {/* Destinations Section -- bg-white DIHAPUS (sebelumnya bg-gray-100) */}
        <section id="destinations-section" className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Popular Destinations</h2>
          {/* Kartu-kartu ini tetap bg-white */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: 'https://source.unsplash.com/800x600/?bali', title: 'Bali, Indonesia', price: 'From $800', badge: 'Most Popular' },
              { img: 'https://source.unsplash.com/800x600/?thailand', title: 'Thailand', price: 'From $600', badge: 'Budget Friendly' },
              { img: 'https://source.unsplash.com/800x600/?vietnam', title: 'Vietnam', price: 'From $500', badge: 'Cultural' }
            ].map((d) => (
              <div key={d.title} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                <img src={d.img} alt={d.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{d.title}</h3>
                  <p className="text-gray-600 mb-4">{d.title === 'Bali, Indonesia' ? 'The Island of Gods offers stunning beaches, ancient temples, and vibrant culture.' : d.title === 'Thailand' ? "Experience Bangkok's bustling streets and the serene beauty of Phuket islands." : "From Hanoi's ancient quarters to Hoi An's charming old town."}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{d.price}</span>
                    <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-medium border border-gray-300">{d.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Food & Dining Section -- bg-white DIHAPUS */}
        <section id="food-dining-section" className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Indonesian Food & Authentic Drinks</h2>
          <div className="max-w-6xl mx-auto">
            {/* Kartu-kartu ini punya background sendiri (gradient oranye/merah) */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><UtensilsCrossed className="w-6 h-6 text-orange-500" />Iconic Indonesian Dishes</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Nasi Padang (Padang, Sumatra)', note: "The best nasi padang I've ever had! Rendang was so tender it melted in my mouth." },
                    { title: 'Sate Ayam Madura (Madura)', note: 'Street food perfection! The peanut sauce was rich and creamy.' },
                    { title: 'Gado-Gado (Jakarta)', note: "Fresh vegetables, perfect peanut dressing, and that crunch from krupuk." },
                    { title: 'Bakso Malang (Malang, East Java)', note: 'Meatballs were so juicy and flavorful! The broth was rich.' }
                  ].map((item) => (
                    <div key={item.title} className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600 italic mb-2">"{item.note}"</p>
                      <p className="text-xs text-gray-500">⭐ 4.7-4.9 • Price varies</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Store className="w-6 h-6 text-orange-500" />Traditional Indonesian Restaurants</h3>
                <div className="space-y-4">
                  {['Sunda Kelapa (Jakarta)', 'Bebek Tepi Sawah (Bandung)', 'Warung Pasta (Yogyakarta)', 'Ayam Goreng Suharti (Solo)'].map((r) => (
                    <div key={r} className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">{r}</h4>
                      <p className="text-sm text-gray-600 italic mb-2">"Authentic and highly recommended."</p>
                      <p className="text-xs text-gray-500">⭐ 4.7-4.9 • Price varies</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><ChefHat className="w-5 h-5 text-orange-500" />Must-Try Indonesian Dishes</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li><strong>Rendang (Padang):</strong> Slow-cooked beef in coconut milk - UNESCO recognized!</li>
                  <li><strong>Nasi Gudeg (Yogyakarta):</strong> Young jackfruit rice with coconut milk & spices</li>
                  <li><strong>Ayam Taliwang (Lombok):</strong> Spicy grilled chicken with sambal matah</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><Coffee className="w-5 h-5 text-orange-500" />Authentic Indonesian Drinks</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li><strong>Es Teh Manis:</strong> Sweet iced tea - Indonesia's national drink</li>
                  <li><strong>Jamu:</strong> Traditional herbal medicine drinks</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Discover Indonesia's incredible culinary diversity - from spicy Padang food to sweet Sundanese dishes.</p>
              <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">Explore Indonesian Food Guide →</button>
            </div>
          </div>
        </section>

        {/* Blog Grid -- bg-white DIHAPUS */}
        <section id="blog-grid-section" className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Latest Articles</h2>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-600">Tidak ada artikel untuk kategori ini.</div>
          ) : (
            // Kartu-kartu ini tetap bg-white
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, idx) => (
                <Link key={post.id || idx} to={`/blog/${post.id}`} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  <div className="relative aspect-w-16 aspect-h-9 overflow-hidden">
                    <img
                      src={post.imageUrl ? (post.imageUrl.startsWith('http') ? post.imageUrl : `http://localhost:5001${post.imageUrl}`) : 'https://source.unsplash.com/800x600/?travel'}
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">{post.category || 'Travel'}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{post.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.content?.substring(0, 150)}...</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">{post.author?.charAt(0)?.toUpperCase()}</div>
                        <span>By {post.author}</span>
                      </div>
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Signup (Tetap dengan background gradient) */}
        <section className="py-12 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with Travel Tips</h2>
            <p className="text-lg text-orange-100 mb-6">Subscribe to our newsletter and get the latest travel insights, exclusive deals, and destination guides delivered to your inbox.</p>
            <div className="max-w-md mx-auto flex gap-4">
              <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white" />
              <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Subscribe</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BlogPage;