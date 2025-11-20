// src/pages/ContactPage.jsx
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Map, CheckCircle, MessageCircle } from 'lucide-react';

function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 2000);
    };

    const contactInfo = [
        {
            icon: <MapPin className="w-12 h-12 text-orange-500" />,
            title: "Address",
            details: ["123 Travel Street", "Jakarta, Indonesia 12345"]
        },
        {
            icon: <Phone className="w-12 h-12 text-orange-500" />,
            title: "Phone",
            details: ["+62 21 1234 5678", "+62 812 3456 7890"]
        },
        {
            icon: <Mail className="w-12 h-12 text-orange-500" />,
            title: "Email",
            details: ["info@stayverse.com", "support@stayverse.com"]
        },
        {
            icon: <Clock className="w-12 h-12 text-orange-500" />,
            title: "Business Hours",
            details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat - Sun: 10:00 AM - 4:00 PM"]
        }
    ];

    const faqs = [
        {
            question: "How do I make a reservation?",
            answer: "You can make a reservation by browsing our hotel listings, selecting your preferred dates, and completing the booking form. You'll receive a confirmation email with all the details."
        },
        {
            question: "What is your cancellation policy?",
            answer: "Our cancellation policy varies by hotel. Generally, you can cancel free of charge up to 24 hours before check-in. Please check the specific hotel's policy during booking."
        },
        {
            question: "Do you offer travel insurance?",
            answer: "Yes, we partner with leading insurance providers to offer comprehensive travel insurance that covers trip cancellations, medical emergencies, and lost luggage."
        },
        {
            question: "How can I contact customer support?",
            answer: "You can reach our customer support team via email at support@stayverse.com, phone at +62 21 1234 5678, or through our live chat feature available 24/7."
        }
    ];

    return (
        <div className="pt-24 min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-20">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/hero-background.jpg')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-orange-900/30"></div>
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                </div>
                <div className="relative container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Get In Touch
                    </h1>
                    <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                        Have questions? We're here to help you plan your perfect stay
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 space-y-20 py-16">
                {/* Contact Info Cards */}
                <section className="bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                                <div className="flex justify-center mb-4">{info.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                                {info.details.map((detail, i) => (
                                    <p key={i} className="text-gray-600 text-sm">{detail}</p>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Form & Map */}
                <section className="bg-white">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                            {submitted ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-green-600 mb-2">Message Sent!</h3>
                                    <p className="text-gray-600">Thank you for contacting us. We'll get back to you soon.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="What's this about?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                            placeholder="Tell us how we can help you..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Us</h2>
                            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-6">
                                <div className="text-center">
                                    <Map className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600">Interactive Map</p>
                                    <p className="text-sm text-gray-500">123 Travel Street, Jakarta</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">Getting Here</h3>
                                <div className="text-gray-600 space-y-2">
                                    <p><strong>By Car:</strong> Take the main highway and exit at Travel Street. We're located 2 blocks from the exit.</p>
                                    <p><strong>By Public Transport:</strong> Take the blue line metro to Central Station, then transfer to bus route 45.</p>
                                    <p><strong>By Airport:</strong> Jakarta International Airport is 45 minutes away. Airport shuttle service available.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="bg-white">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold mb-3 text-green-600">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-2xl p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">
                        Need Immediate Help?
                    </h2>
                    <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                        Our customer support team is available 24/7 to assist you with any questions or concerns.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="tel:+622112345678" className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                            <Phone className="w-5 h-5" />
                            Call Now: +62 21 1234 5678
                        </a>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-colors flex items-center justify-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            Start Live Chat
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ContactPage;