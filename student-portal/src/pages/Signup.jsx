import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStudentAuth } from '../context/StudentAuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rollNumber: '',
        department: 'Computer Science',
        year: '1st Year',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup, student } = useStudentAuth();
    const navigate = useNavigate();

    if (student) return <Navigate to="/events" replace />;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signup(formData);
            navigate('/events');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card w-full max-w-lg p-8 rounded-3xl border border-border shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Join Student Hub</h1>
                    <p className="text-slate-400">Create your account to register for events</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-slate-900 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-white"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-slate-900 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-white"
                            placeholder="john.doe@university.edu"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Roll Number</label>
                        <input
                            name="rollNumber"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-slate-900 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-white"
                            placeholder="e.g. CS2024"
                            value={formData.rollNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Department</label>
                        <select
                            name="department"
                            className="w-full px-4 py-3 bg-slate-900 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-white appearance-none cursor-pointer"
                            value={formData.department}
                            onChange={handleChange}
                        >
                            <option>Computer Science</option>
                            <option>Electronics</option>
                            <option>Mechanical</option>
                            <option>Civil</option>
                            <option>Business</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Year</label>
                        <select
                            name="year"
                            className="w-full px-4 py-3 bg-slate-900 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-white appearance-none cursor-pointer"
                            value={formData.year}
                            onChange={handleChange}
                        >
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-slate-900 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-white"
                            placeholder="Minimum 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="md:col-span-2 py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-8 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Log In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
