require('dotenv').config();
const { sequelize } = require('./src/config/db');

// Import models
const Hotel = require('./src/models/hotelModel');
const Blog = require('./src/models/Blog');
const User = require('./src/models/userModel');

const hotels = [
    {
        name: "The Laguna, a Luxury Collection Hotel & Spa",
        location: "Nusa Dua, Bali",
        description: "A luxurious beachfront resort featuring Balinese architecture, world-class spa, and stunning ocean views. Perfect for honeymooners and luxury travelers.",
        price_per_night: 2500000,
        available_rooms: 150,
        imageUrl: "/hotels/hotel-laguna-1.jpg"
    },
    {
        name: "Ayodya Resort Bali",
        location: "Ubud, Bali",
        description: "Nestled in the heart of Ubud's rice terraces, this resort offers traditional Balinese villas with modern amenities and breathtaking valley views.",
        price_per_night: 1800000,
        available_rooms: 85,
        imageUrl: "/hotels/hotel-ayodya-resort-1.jpg"
    },
    {
        name: "Grand Hyatt Jakarta",
        location: "Jakarta Pusat, DKI Jakarta",
        description: "Jakarta's premier luxury hotel featuring stunning architecture, world-class dining, and proximity to business districts and shopping centers.",
        price_per_night: 1200000,
        available_rooms: 200,
        imageUrl: "/hotels/hotel-grand-hyatt-1.jpg"
    },
    {
        name: "Shangri-La Hotel Surabaya",
        location: "Surabaya, Jawa Timur",
        description: "A five-star hotel overlooking the city skyline, offering exceptional service, multiple dining options, and modern conference facilities.",
        price_per_night: 950000,
        available_rooms: 120,
        imageUrl: "/hotels/hotel-shangri-la-1.jpg"
    },
    {
        name: "Borobudur Marriott's Resort & Spa",
        location: "Magelang, Jawa Tengah",
        description: "Located near the iconic Borobudur Temple, this resort combines cultural heritage with modern luxury and stunning temple views.",
        price_per_night: 1100000,
        available_rooms: 95,
        imageUrl: "/hotels/hotel-borobudur-marriott-1.jpg"
    },
    {
        name: "Mandapa, a Ritz-Carlton Reserve",
        location: "Ubud, Bali",
        description: "A sanctuary of wellness and luxury in the jungle, featuring private villas, healing waters, and authentic Balinese experiences.",
        price_per_night: 3200000,
        available_rooms: 60,
        imageUrl: "/hotels/hotel-mandapa-ritz-carlton-1.jpg"
    },
    {
        name: "Hotel Tentrem Yogyakarta",
        location: "Yogyakarta, DIY",
        description: "A boutique hotel in the heart of Yogyakarta, offering traditional Javanese architecture and modern comfort near cultural sites.",
        price_per_night: 850000,
        available_rooms: 40,
        imageUrl: "/hotels/hotel-tentrem-1.jpg"
    },
    {
        name: "The Trans Luxury Hotel Bandung",
        location: "Bandung, Jawa Barat",
        description: "Luxury hotel in Bandung's shopping district, featuring modern design, spa facilities, and proximity to shopping centers.",
        price_per_night: 750000,
        available_rooms: 100,
        imageUrl: "/hotels/hotel-trans-luxury-1.jpg"
    },
    {
        name: "Hotel Ciputra Semarang",
        location: "Semarang, Jawa Tengah",
        description: "Business hotel with stunning city views, modern amenities, and convenient location for business travelers.",
        price_per_night: 650000,
        available_rooms: 80,
        imageUrl: "/hotels/hotel-ciputra-1.jpg"
    },
    {
        name: "Grand Aston City Hall Medan",
        location: "Medan, Sumatera Utara",
        description: "Upscale hotel in Medan's business district, offering comfortable rooms and excellent dining options.",
        price_per_night: 550000,
        available_rooms: 120,
        imageUrl: "/hotels/hotel-grand-aston-1.jpg"
    },
    {
        name: "Swiss-Belhotel Makassar",
        location: "Makassar, Sulawesi Selatan",
        description: "Modern hotel with ocean views, featuring international standard service and proximity to business areas.",
        price_per_night: 600000,
        available_rooms: 90,
        imageUrl: "/hotels/hotel-swiss-bel-1.jpg"
    },
    {
        name: "The Oberoi Lombok",
        location: "Lombok, Nusa Tenggara Barat",
        description: "Luxury beach resort on Lombok's pristine shores, offering villas, spa, and world-class dining.",
        price_per_night: 2800000,
        available_rooms: 50,
        imageUrl: "/hotels/hotel-oberoi-1.jpg"
    }
];

const blogs = [
    {
        title: "Top 10 Luxury Hotels in Bali for 2024",
        content: `Bali continues to be Indonesia's premier luxury destination, offering world-class resorts that blend traditional Balinese architecture with modern amenities. Here are our top picks for the best luxury hotels in Bali this year:

1. **The Laguna, a Luxury Collection Hotel & Spa** - Nusa Dua's crown jewel with stunning beachfront location and award-winning spa.

2. **Mandapa, a Ritz-Carlton Reserve** - A wellness sanctuary in the jungle featuring private villas and healing waters.

3. **The St. Regis Bali Resort** - Ultra-luxury with butler service and direct beach access.

4. **Ayodya Resort Bali** - Traditional Balinese villas nestled in Ubud's rice terraces.

5. **Alila Manggis** - Eco-luxury surrounded by mangroves with contemporary design.

Each of these properties offers unique experiences, from wellness retreats to family-friendly luxury. Whether you're seeking romance, adventure, or pure relaxation, Bali's luxury hotels deliver exceptional service and unforgettable memories.`,
        imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
        author: "Travel Expert",
        category: "Hotel Reviews"
    },
    {
        title: "A Complete Guide to Ubud: Bali's Cultural Heart",
        content: `Ubud, often called the cultural heart of Bali, is a vibrant town nestled in the central highlands. Known for its stunning rice terraces, traditional markets, and thriving arts scene, Ubud offers visitors a perfect blend of culture, nature, and modern amenities.

**Why Visit Ubud?**
- World-class art museums and galleries
- Sacred Monkey Forest sanctuary
- Traditional dance performances
- Organic cafes and restaurants
- Yoga and wellness retreats

**Best Time to Visit:** April to September (dry season)
**Getting Around:** Rent a scooter or use ride-hailing apps
**Accommodation:** From budget guesthouses to luxury villas

Ubud is more than just a tourist destination—it's a place where ancient traditions meet contemporary creativity. Don't miss the daily offerings at temples, the vibrant art market, and the serene rice field walks.`,
        imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
        author: "Cultural Explorer",
        category: "Destinations"
    },
    {
        title: "Jakarta's Hidden Gems: Beyond the Tourist Trail",
        content: `Jakarta, Indonesia's bustling capital, is often overlooked by tourists rushing to Bali or other islands. However, this vibrant metropolis offers incredible experiences for those willing to explore beyond the surface.

**Must-Visit Attractions:**
1. **Istiqlal Mosque & Jakarta Cathedral** - A stunning example of religious harmony
2. **National Monument (Monas)** - Iconic symbol of Indonesian independence
3. **Taman Mini Indonesia Indah** - Cultural park showcasing all Indonesian cultures
4. **Jakarta Cathedral** - Beautiful neo-Gothic architecture
5. **Ancol Dreamland** - Entertainment complex with beaches and theme parks

**Local Food Scene:**
- Try authentic Indonesian cuisine at local warungs
- Visit food markets for street food adventures
- Experience fine dining at rooftop restaurants

**Transportation Tips:**
- Use MRT, LRT, and TransJakarta for efficient travel
- Grab bikes are perfect for short distances
- Traffic can be challenging, so plan accordingly

Jakarta offers a unique blend of modern skyscrapers, colonial architecture, and vibrant street life. Take time to explore the old town area and experience the city's rich history and culture.`,
        imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop",
        author: "City Guide",
        category: "Destinations"
    },
    {
        title: "Sustainable Travel: Eco-Friendly Hotels in Indonesia",
        content: `As travel becomes more conscious, many Indonesian hotels are embracing sustainable practices. Here are some eco-friendly options that prioritize environmental responsibility while offering luxury experiences.

**Green Hotel Features:**
- Solar power and energy-efficient systems
- Water conservation programs
- Local sourcing and organic dining
- Community support initiatives
- Waste reduction programs

**Top Sustainable Hotels:**
1. **Alila Manggis** - Uses solar power and supports local conservation
2. **The Trans Resort Bali** - Organic farm and zero-waste initiatives
3. **COMO Uma Ubud** - Wellness-focused with sustainable practices
4. **Six Senses Uluwatu** - Carbon-neutral operations
5. **AYodya Resort** - Traditional architecture with modern eco-features

These properties demonstrate that luxury and sustainability can coexist beautifully. By choosing eco-friendly accommodations, travelers contribute to preserving Indonesia's natural beauty for future generations.`,
        imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
        author: "Eco Traveler",
        category: "Travel Tips"
    },
    {
        title: "Borobudur Temple: A Journey Through Time",
        content: `Borobudur, located in Magelang, Central Java, is the world's largest Buddhist temple and a UNESCO World Heritage site. This magnificent 9th-century monument offers visitors a profound journey through Buddhist philosophy and history.

**Temple Facts:**
- Built between 778-850 AD during the Sailendra dynasty
- Contains 2,672 relief panels and 504 Buddha statues
- Represents the journey from worldly desires to enlightenment
- Largest Buddhist monument in the world

**Best Time to Visit:** Sunrise for magical lighting
**Nearby Accommodation:** Borobudur Marriott's Resort & Spa
**Guided Tours:** Essential for understanding the complex symbolism

The temple's design represents the Buddhist cosmology, with each level symbolizing different stages of enlightenment. Climbing to the top offers not just physical exercise but also a spiritual journey through Buddhist teachings.

**Practical Tips:**
- Wear comfortable shoes and modest clothing
- Bring water and sun protection
- Sunrise tickets must be booked in advance
- Guided tours provide valuable context

Borobudur is more than a tourist attraction—it's a living testament to Indonesia's rich cultural and religious heritage.`,
        imageUrl: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=800&h=600&fit=crop",
        author: "Heritage Guide",
        category: "Destinations"
    },
    {
        title: "Nusa Penida: Bali's Undiscovered Paradise",
        content: `Nusa Penida, a small island off Bali's southeast coast, offers pristine beaches, dramatic cliffs, and crystal-clear waters that rival the Maldives. This hidden gem is perfect for travelers seeking authentic experiences away from the crowds.

**Island Highlights:**
- **Crystal Bay** - Iconic viewpoint with stunning ocean vistas
- **Kelingking Beach** - T-rex shaped cliff and pristine white sand
- **Broken Beach** - Natural rock arch and turquoise waters
- **Angel Billabong** - Natural infinity pool
- **Atuh Beach** - Perfect for swimming and relaxation

**Getting There:** Fast boat from Sanur or Benoa (about 30-45 minutes)
**Best Time:** April to September (dry season)
**Activities:** Snorkeling, diving, hiking, and ATV tours

**Where to Stay:**
- The Trans Resort Bali - Eco-luxury with stunning views
- Local guesthouses for budget travelers
- Boutique villas for private experiences

Nusa Penida offers a peaceful retreat with world-class natural beauty. The island's rugged terrain and traditional villages provide authentic cultural experiences, while the marine life around the island makes it a diver's paradise.`,
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        author: "Island Explorer",
        category: "Destinations"
    },
    {
        title: "Authentic Indonesian Street Food Adventures",
        content: `Indonesia's street food scene is a culinary journey through diverse flavors and regional specialties. From the spicy sambals of Java to the aromatic curries of Sumatra, every corner offers a new taste experience.

**Must-Try Street Foods:**
1. **Nasi Goreng** - Indonesia's national dish, fried rice with various toppings
2. **Satay** - Grilled meat skewers served with peanut sauce
3. **Bakso** - Meatball soup with noodles and wontons
4. **Gado-Gado** - Mixed vegetables with peanut sauce
5. **Rendang** - Slow-cooked beef in coconut milk (UNESCO recognized)

**Street Food Safety Tips:**
- Choose busy stalls with fresh ingredients
- Watch how food is prepared
- Start with small portions when trying new foods
- Carry hand sanitizer and wet wipes

**Best Cities for Street Food:**
- Jakarta: Modern takes on traditional dishes
- Yogyakarta: Authentic Javanese specialties
- Bali: Fusion of local and international flavors
- Medan: Rich Sumatran cuisine

Indonesian street food is not just about eating—it's about experiencing the warmth of local culture and the joy of discovering new flavors.`,
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
        author: "Food Explorer",
        category: "Food & Dining"
    },
    {
        title: "Fine Dining in Southeast Asia: Michelin-Starred Experiences",
        content: `Southeast Asia's culinary scene has evolved dramatically, with world-class restaurants earning Michelin stars and international acclaim. From innovative fusion cuisine to traditional dishes elevated to art forms, the region offers exceptional dining experiences.

**Michelin-Starred Restaurants:**
1. **Odette (Singapore)** - French-Singaporean fusion by Chef Julien Royer
2. **The Chairman (Hong Kong)** - Cantonese fine dining
3. **Bo.Lan (Bangkok)** - Modern Thai cuisine
4. **Leroy (Singapore)** - French fine dining
5. **Sushi Azabu (Tokyo)** - Exceptional sushi experience

**Luxury Dining Experiences:**
- Private chef experiences in Bali villas
- Wine tastings in Singapore
- Royal Thai cuisine at Bangkok palaces
- Beachfront dining with sunset views
- Multi-course tasting menus featuring local ingredients

**Dining Etiquette:**
- Dress elegantly for fine dining establishments
- Learn basic local dining customs
- Be open to trying unfamiliar ingredients
- Make reservations well in advance

These culinary experiences showcase the region's growing sophistication while honoring traditional flavors and techniques.`,
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
        author: "Culinary Critic",
        category: "Food & Dining"
    }
];

const users = [
    {
        name: "Admin User",
        email: "admin@stayverse.com",
        password: "$2a$10$hashedpassword", // This will be properly hashed
        role: "admin"
    },
    {
        name: "Demo User",
        email: "user@stayverse.com",
        password: "$2a$10$hashedpassword", // This will be properly hashed
        role: "user"
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data (in correct order to avoid foreign key constraints)
        // Note: We need to import the models first
        const Reservation = require('./src/models/reservationModel');
        const Cancellation = require('./src/models/CancellationRequest');

        try {
            await Reservation.destroy({ where: {} });
        } catch (e) {
            console.log('Reservation table not found, skipping...');
        }
        try {
            await Cancellation.destroy({ where: {} });
        } catch (e) {
            console.log('Cancellation table not found, skipping...');
        }
        try {
            await Hotel.destroy({ where: {} });
        } catch (e) {
            console.log('Hotel table not found, skipping...');
        }
        try {
            await Blog.destroy({ where: {} });
        } catch (e) {
            console.log('Blog table not found, skipping...');
        }
        try {
            await User.destroy({ where: {} });
        } catch (e) {
            console.log('User table not found, skipping...');
        }

        console.log('🧹 Cleared existing data');

        // Seed hotels
        await Hotel.bulkCreate(hotels);
        console.log(`✅ Seeded ${hotels.length} hotels`);

        // Seed blogs
        await Blog.bulkCreate(blogs);
        console.log(`✅ Seeded ${blogs.length} blog posts`);

        // Seed users (with proper password hashing)
        const bcrypt = require('bcryptjs');
        for (const user of users) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await User.create({
                ...user,
                password: hashedPassword
            });
        }
        console.log(`✅ Seeded ${users.length} users`);

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Demo Accounts:');
        console.log('Admin: admin@stayverse.com / password123');
        console.log('User: user@stayverse.com / password123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        process.exit();
    }
}

// Run seeder
seedDatabase();
