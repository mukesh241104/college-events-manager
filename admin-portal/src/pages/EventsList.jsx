import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { user } = useAuth();

    // Delete confirmation modal state
    const [deleteTarget, setDeleteTarget] = useState(null); // event to delete
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events');
            setEvents(res.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const [registrations, setRegistrations] = useState([]);
    const [loadingRegs, setLoadingRegs] = useState(false);

    const fetchRegistrations = async (eventId) => {
        setLoadingRegs(true);
        try {
            const res = await api.get(`/events/${eventId}/registrations`);
            setRegistrations(res.data);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoadingRegs(false);
        }
    };

    useEffect(() => {
        if (selectedEvent) {
            fetchRegistrations(selectedEvent._id);
        } else {
            setRegistrations([]);
        }
    }, [selectedEvent]);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await api.delete(`/events/${deleteTarget._id}`);
            setEvents(events.filter((e) => e._id !== deleteTarget._id));
            setDeleteTarget(null);
        } catch (error) {
            console.error('Error deleting event:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        All Events
                    </h1>
                    <p className="text-slate-400 mt-1">Manage and track your upcoming activities.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {events.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-12 text-center text-slate-500 bg-card/30 rounded-2xl border border-dashed border-border"
                        >
                            No events found. Start by creating one!
                        </motion.div>
                    )}
                    {events.map((event, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            key={event._id}
                            onClick={() => setSelectedEvent(event)}
                            className="group cursor-pointer bg-card transition-all hover:bg-slate-800 border border-border rounded-2xl p-6 shadow-lg shadow-black/5 hover:shadow-primary/5 hover:border-primary/30 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(event); }}
                                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                >
                                    🗑️
                                </button>
                            </div>

                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    })}
                                </span>
                                <h2 className="text-xl font-bold text-white mb-2 leading-tight">
                                    {event.title}
                                </h2>
                                <p className="text-slate-400 text-sm line-clamp-2">
                                    {event.description}
                                </p>
                            </div>

                            <div className="pt-4 mt-4 border-t border-border flex flex-col gap-2 text-sm text-slate-300">
                                <div className="flex items-center gap-2">
                                    <span>📍</span> {event.location}
                                </div>
                                {user.role === 'superadmin' && event.club && (
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <span>🏛️</span> {event.club.name}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* ── Delete Confirmation Modal ── */}
            <AnimatePresence>
                {deleteTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setDeleteTarget(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 16 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 16 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card w-full max-w-sm border border-border rounded-3xl p-8 shadow-2xl"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-3xl mx-auto mb-5">
                                🗑️
                            </div>

                            <h2 className="text-xl font-bold text-white text-center mb-2">Delete Event?</h2>
                            <p className="text-slate-400 text-sm text-center mb-1">You're about to permanently delete:</p>
                            <p className="text-white font-semibold text-center mb-6 truncate px-2">"{deleteTarget.title}"</p>

                            <p className="text-xs text-slate-500 text-center mb-6">This action cannot be undone.</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="flex-1 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-border transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deleteLoading}
                                    className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                                >
                                    {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Event Details Modal ── */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedEvent(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card w-full max-w-2xl border border-border rounded-3xl overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-8">
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>

                                <div className="space-y-6">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                                            {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                        <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                                        {user.role === 'superadmin' && selectedEvent.club && (
                                            <p className="text-indigo-400 font-medium">Hosted by {selectedEvent.club.name}</p>
                                        )}
                                    </div>

                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                                            {selectedEvent.description}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-border flex flex-col gap-3">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Event Details</h3>
                                        <div className="flex items-center gap-3 text-slate-300 bg-slate-900/50 p-4 rounded-xl">
                                            <span className="text-xl">📍</span>
                                            <div>
                                                <p className="text-xs text-slate-500 block">Location</p>
                                                <p className="font-medium">{selectedEvent.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Registrations Section */}
                                    <div className="pt-6 border-t border-border">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-white">Registered Students</h3>
                                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">
                                                {registrations.length} Total
                                            </span>
                                        </div>

                                        {loadingRegs ? (
                                            <div className="text-center py-8 text-slate-500 text-sm">Loading registrations...</div>
                                        ) : registrations.length === 0 ? (
                                            <div className="text-center py-8 bg-slate-900/50 rounded-xl border border-dashed border-border text-slate-500 text-sm">
                                                No students have registered yet.
                                            </div>
                                        ) : (
                                            <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
                                                {registrations.map(reg => (
                                                    <div key={reg._id} className="bg-slate-900/80 p-4 rounded-xl border border-border flex justify-between items-center">
                                                        <div>
                                                            <p className="text-white font-medium text-sm">{reg.student.name}</p>
                                                            <p className="text-slate-400 text-xs">{reg.student.email}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-indigo-400 font-mono text-xs">{reg.student.rollNumber}</p>
                                                            <p className="text-slate-500 text-xs">{reg.student.department} • {reg.student.year}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventsList;
