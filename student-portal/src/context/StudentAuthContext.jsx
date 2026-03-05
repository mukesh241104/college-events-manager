import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await api.get('/public/me');
            setStudent(res.data);
        } catch (err) {
            setStudent(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const signup = async (studentData) => {
        const response = await api.post('/public/signup', studentData);
        setStudent(response.data);
        return response.data;
    };

    const login = async (identifier, password) => {
        const response = await api.post('/public/login', { identifier, password });
        setStudent(response.data);
        return response.data;
    };

    const logout = async () => {
        await api.get('/public/logout');
        setStudent(null);
    };

    return (
        <StudentAuthContext.Provider value={{ student, loading, signup, login, logout }}>
            {children}
        </StudentAuthContext.Provider>
    );
};

export const useStudentAuth = () => useContext(StudentAuthContext);
