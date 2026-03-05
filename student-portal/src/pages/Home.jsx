import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8 px-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl space-y-6"
            >
                <div className="inline-block px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium border border-indigo-500/20 mb-4">
                    🎉 Welcome to the Student Hub
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
                    Your One-Stop Platform for <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Campus Events</span>
                </h1>

                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Discover club activities, workshops, and hackathons all in one place. Register instantly and never miss out on campus life.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    <Link
                        to="/events"
                        className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-1"
                    >
                        Browse All Events
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
