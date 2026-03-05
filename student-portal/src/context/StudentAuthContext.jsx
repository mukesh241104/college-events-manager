import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, restore student from localStorage if token exists
    useEffect(() => {
        const token = localStorage.getItem('studentToken');
        const stored = localStorage.getItem('studentData');
        if (token && stored) {
            try {
                setStudent(JSON.parse(stored));
            } catch {
                localStorage.removeItem('studentToken');
                localStorage.removeItem('studentData');
            }
        }
        setLoading(false);
    }, []);

    const saveSession = (data) => {
        const { token, ...studentData } = data;
        localStorage.setItem('studentToken', token);
        localStorage.setItem('studentData', JSON.stringify(studentData));
        setStudent(studentData);
    };

    const signup = async (studentData) => {
        const response = await api.post('/public/signup', studentData);
        saveSession(response.data);
        return response.data;
    };

    const login = async (identifier, password) => {
        const response = await api.post('/public/login', { identifier, password });
        saveSession(response.data);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        setStudent(null);
    };

    return (
        <StudentAuthContext.Provider value={{ student, loading, signup, login, logout }}>
            {children}
        </StudentAuthContext.Provider>
    );
};

export const useStudentAuth = () => useContext(StudentAuthContext);
