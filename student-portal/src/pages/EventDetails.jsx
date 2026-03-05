import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useStudentAuth } from '../context/StudentAuthContext';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { student } = useStudentAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Registration State
    const [showModal, setShowModal] = useState(false);
    const [regStatus, setRegStatus] = useState({ type: '', text: '', loading: false });

    // Computed Countdown State
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/public/events/${id}`);
                setEvent(res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Event not found");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (!event) return;

        const eventDate = new Date(event.date);

        const tick = () => {
            const now = new Date();
            const diff = eventDate - now;

            if (diff <= 0) {
                setTimeLeft('Event has started or ended');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

            if (days > 0) {
                setTimeLeft(`${days} day${days > 1 ? 's' : ''} left`);
            } else {
                setTimeLeft(`Starts in ${hours} hour${hours !== 1 ? 's' : ''}`);
            }
        };

        tick();
        const interval = setInterval(tick, 1000 * 60 * 60);
        return () => clearInterval(interval);
    }, [event]);

    const handleRegisterClick = () => {
        if (!student) {
            // Not logged in — redirect to login with a return path
            navigate('/login');
            return;
        }
        setShowModal(true);
    };

    const handleConfirmRegister = async () => {
        setRegStatus({ type: '', text: '', loading: true });
        try {
            await api.post('/public/events/register', { eventId: event._id });
            setRegStatus({ type: 'success', text: '🎉 Registration successful! See you there.', loading: false });
            setTimeout(() => {
                setShowModal(false);
                setRegStatus({ type: '', text: '', loading: false });
            }, 3000);
        } catch (err) {
            setRegStatus({
                type: 'error',
                text: err.response?.data?.message || 'Failed to register. Please try again.',
                loading: false
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center mt-32">
                <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="text-center mt-32">
                <h2 className="text-2xl text-red-400 font-bold mb-4">{error}</h2>
                <Link to="/events" className="text-primary hover:underline">← Back to events</Link>
            </div>
        );
    }

    const isPast = new Date(event.date) < new Date();

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/events" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium">
                ← Back to All Events
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
            >
                {/* Event Hero Area */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 border-b border-border">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 bg-primary/20 text-blue-300 font-bold rounded-full text-sm">
                            {new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </span>
                        {!isPast && (
                            <span className="px-4 py-1.5 bg-orange-500/20 text-orange-400 font-semibold rounded-full text-sm flex items-center gap-2">
                                ⏳ {timeLeft}
                            </span>
                        )}
                        {event.club && (
                            <span className="px-4 py-1.5 bg-slate-800 text-slate-300 font-medium rounded-full text-sm border border-slate-700">
                                Hosted by {event.club.name}
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                        {event.title}
                    </h1>
                </div>

                {/* Details Area */}
                <div className="p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">About this Event</h3>
                                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {event.description}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            <div className="p-6 bg-slate-900/50 rounded-2xl border border-border">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Location</h3>
                                <p className="text-white font-medium flex items-center gap-3">
                                    <span className="text-2xl">📍</span> {event.location}
                                </p>
                            </div>

                            <div className="p-6 bg-slate-900/50 rounded-2xl border border-border">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Time</h3>
                                <p className="text-white font-medium flex items-center gap-3">
                                    <span className="text-2xl">⏰</span>
                                    {new Date(event.date).toLocaleTimeString('en-US', {
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            <button
                                onClick={handleRegisterClick}
                                disabled={isPast}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${isPast
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-border'
                                    : 'bg-primary text-white hover:bg-blue-600 hover:-translate-y-1 hover:shadow-primary/25'
                                    }`}
                            >
                                {isPast ? 'Registrations Closed' : student ? 'Register Now' : 'Log In to Register'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Registration Confirmation Modal */}
            <AnimatePresence>
                {showModal && student && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-card w-full max-w-md border border-border rounded-3xl overflow-hidden shadow-2xl relative p-8"
                        >
                            <button
                                onClick={() => { setShowModal(false); setRegStatus({ type: '', text: '', loading: false }); }}
                                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                            >
                                ✕
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-1">Confirm Registration</h2>
                            <p className="text-slate-400 text-sm mb-6 truncate">{event.title}</p>

                            {regStatus.text && (
                                <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${regStatus.type === 'success'
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    {regStatus.text}
                                </div>
                            )}

                            {regStatus.type !== 'success' && (
                                <>
                                    {/* Show the logged-in student's info */}
                                    <div className="bg-slate-900/50 rounded-2xl border border-border p-5 mb-6 space-y-3">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Registering as</p>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Name</span>
                                            <span className="text-white font-medium">{student.name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Email</span>
                                            <span className="text-white font-medium">{student.email}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Roll Number</span>
                                            <span className="text-white font-medium">{student.rollNumber}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Department</span>
                                            <span className="text-white font-medium">{student.department}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Year</span>
                                            <span className="text-white font-medium">{student.year}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleConfirmRegister}
                                        disabled={regStatus.loading}
                                        className="w-full py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-colors shadow-lg disabled:opacity-50"
                                    >
                                        {regStatus.loading ? 'Processing...' : 'Confirm Registration'}
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventDetails;
