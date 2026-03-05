import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ events: 0, clubs: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const eventsRes = await api.get('/events');

                let clubsCount = 0;
                if (user.role === 'superadmin') {
                    const clubsRes = await api.get('/admin/clubs');
                    clubsCount = clubsRes.data.length;
                }

                setStats({
                    events: eventsRes.data.length,
                    clubs: clubsCount,
                });
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Welcome back,</h1>
                <p className="text-slate-400 mt-1">Here's what's happening with your events today.</p>
            </header>

            {loading ? (
                <div className="h-40 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border rounded-2xl p-6 shadow-lg shadow-black/5"
                    >
                        <h3 className="text-slate-400 text-sm font-medium mb-2">Total Events</h3>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold text-primary">{stats.events}</span>
                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">Actively Managed</span>
                        </div>
                    </motion.div>

                    {user.role === 'superadmin' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card border border-border rounded-2xl p-6 shadow-lg shadow-black/5"
                        >
                            <h3 className="text-slate-400 text-sm font-medium mb-2">Platform Clubs</h3>
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-bold text-indigo-400">{stats.clubs}</span>
                                <span className="bg-indigo-400/10 text-indigo-400 text-xs px-2 py-1 rounded-full font-medium">Registered</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
