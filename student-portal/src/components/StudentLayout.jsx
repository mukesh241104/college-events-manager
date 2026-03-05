import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStudentAuth } from '../context/StudentAuthContext';

const StudentLayout = () => {
    const { student, loading, logout } = useStudentAuth();

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                                S
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-white hidden sm:block">
                                StudentHub
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8 mr-auto ml-12">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) => `text-sm font-semibold transition-colors ${isActive ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/events"
                                className={({ isActive }) => `text-sm font-semibold transition-colors ${isActive ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
                            >
                                All Events
                            </NavLink>
                        </nav>

                        <div className="flex items-center gap-4">
                            {!loading && (student ? (
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:flex flex-col items-end mr-2">
                                        <span className="text-white text-sm font-bold">{student.name}</span>
                                        <span className="text-slate-500 text-xs">{student.rollNumber}</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl border border-border transition-all"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-5 py-2.5 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-5 py-2.5 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
                >
                    <Outlet />
                </motion.div>
            </main>

            <footer className="py-6 border-t border-border text-center text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} University Inter-Club Platform. Built for Students.
            </footer>
        </div>
    );
};

export default StudentLayout;
