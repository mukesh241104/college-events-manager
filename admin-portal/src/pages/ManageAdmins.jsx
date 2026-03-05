import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';

const ManageAdmins = () => {
    const { user } = useAuth();
    const [clubs, setClubs] = useState([]);

    // Forms state
    const [clubName, setClubName] = useState('');
    const [clubDesc, setClubDesc] = useState('');

    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminClubId, setAdminClubId] = useState('');

    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            const { data } = await api.get('/admin/clubs');
            setClubs(data);
        } catch (error) {
            console.error('Error fetching clubs', error);
        }
    };

    const handleCreateClub = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/clubs', { name: clubName, description: clubDesc });
            setMessage({ type: 'success', text: 'Club created successfully!' });
            setClubName('');
            setClubDesc('');
            fetchClubs(); // refresh list
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error creating club' });
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/club-admins', {
                email: adminEmail,
                password: adminPassword,
                clubId: adminClubId
            });
            setMessage({ type: 'success', text: 'Club Admin created successfully!' });
            setAdminEmail('');
            setAdminPassword('');
            setAdminClubId('');
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error creating admin' });
        }
    };

    if (user?.role !== 'superadmin') {
        return <div className="text-center mt-20 text-red-400">Restricted Access. Superadmins only.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Platform Management
                </h1>
                <p className="text-slate-400 mt-1">Create clubs and assign club administrators.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Club Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/10"
                >
                    <h2 className="text-xl font-bold mb-4">Create New Club</h2>
                    <form onSubmit={handleCreateClub} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300">Club Name</label>
                            <input
                                type="text"
                                value={clubName}
                                onChange={(e) => setClubName(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 mt-1"
                                placeholder="E.g., Robotics Club"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300">Description</label>
                            <textarea
                                value={clubDesc}
                                onChange={(e) => setClubDesc(e.target.value)}
                                className="w-full bg-slate-900/50 border border-border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 mt-1 resize-none"
                                placeholder="Brief description..."
                                rows={3}
                            />
                        </div>
                        <button type="submit" className="w-full py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
                            Create Club
                        </button>
                    </form>
                </motion.div>

                {/* Create Admin Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/10"
                >
                    <h2 className="text-xl font-bold mb-4">Create Club Admin</h2>
                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300">Admin Email</label>
                            <input
                                type="email"
                                value={adminEmail}
                                onChange={(e) => setAdminEmail(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 mt-1"
                                placeholder="admin@robotics.edu"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-slate-900/50 border border-border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 mt-1"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300">Assign to Club</label>
                            <select
                                value={adminClubId}
                                onChange={(e) => setAdminClubId(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 mt-1 appearance-none"
                            >
                                <option value="" disabled>Select a club...</option>
                                {clubs.map((club) => (
                                    <option key={club._id} value={club._id}>{club.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors mt-2">
                            Create Club Admin
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ManageAdmins;
