import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
            ? 'bg-primary text-foreground'
            : 'text-slate-400 hover:bg-slate-800 hover:text-foreground'
        }`;

    return (
        <div className="min-h-screen flex bg-background text-foreground">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col hidden md:flex"
            >
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        Admin Portal
                    </h1>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                        {user?.role === 'superadmin' ? 'Super Admin' : 'Club Admin'}
                    </p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavLink to="/" className={navClasses}>
                        <span>📊</span> Dashboard
                    </NavLink>
                    <NavLink to="/events" className={navClasses}>
                        <span>📅</span> Events
                    </NavLink>
                    <NavLink to="/events/create" className={navClasses}>
                        <span>✨</span> Create Event
                    </NavLink>
                    {user?.role === 'superadmin' && (
                        <NavLink to="/manage" className={navClasses}>
                            <span>⚙️</span> Manage Platform
                        </NavLink>
                    )}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                        <p className="text-sm font-medium truncate">{user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="h-16 border-b border-border bg-background/80 backdrop-blur flex items-center px-8 md:hidden">
                    <span className="font-bold">Admin Portal</span>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-6xl mx-auto h-full"
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
