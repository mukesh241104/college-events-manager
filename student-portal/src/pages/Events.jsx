import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('upcoming'); // 'upcoming' | 'all'

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/public/events');
                setEvents(res.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
        );
    }

    const now = new Date();
    const filteredEvents = filter === 'upcoming'
        ? events.filter(e => new Date(e.date) >= now)
        : events;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        {filter === 'upcoming' ? 'Upcoming Events' : 'All Events'}
                    </h1>
                    <p className="mt-2 text-slate-400 text-lg">Discover and register for activities across the university.</p>
                </div>
                {/* Filter Toggle */}
                <div className="flex items-center gap-1 bg-slate-900 border border-border rounded-xl p-1 self-start">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${filter === 'upcoming' ? 'bg-primary text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${filter === 'all' ? 'bg-primary text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        All Events
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-dashed border-border px-4">
                        <span className="text-2xl block mb-2">🎈</span>
                        {filter === 'upcoming' ? 'No upcoming events scheduled at the moment.' : 'No events found.'}
                    </div>
                ) : (
                    filteredEvents.map((event, index) => {
                        const eventDate = new Date(event.date);
                        const isPast = eventDate < now;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={event._id}
                                className={`flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors shadow-xl shadow-black/20 ${isPast ? 'opacity-60 grayscale-[0.8]' : ''}`}
                            >
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isPast ? 'bg-slate-700 text-slate-300' : 'bg-primary/20 text-blue-300'}`}>
                                            {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        {event.club && (
                                            <span className="text-xs font-medium text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                                                {event.club.name}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.title}</h2>
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-1">
                                        {event.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                                        <div className="text-sm font-medium text-slate-300 truncate pr-4">
                                            📍 {event.location}
                                        </div>
                                        <Link
                                            to={`/events/${event._id}`}
                                            className={`shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isPast
                                                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                : 'bg-primary text-white hover:bg-blue-600'
                                                }`}
                                        >
                                            {isPast ? 'View Details' : 'Register Now'}
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Events;
