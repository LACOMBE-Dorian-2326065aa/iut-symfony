import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import api from '../api/axios';
import { type User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
            setUser(JSON.parse(userData));
        } else if (token) {
            setUser({ token, email: '', roles: [] }); 
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await api.post('/api/login', { email, password });
            const data = response.data;
            
            const token = data.token || 'mock-token-' + Date.now();
            
            const userObj = {
                ...data.user,
                token,
                roles: []
            };

            localStorage.setItem('token', token);
            localStorage.setItem('user_data', JSON.stringify(userObj));
            
            setUser(userObj);
            return true;
        } catch (error) {
            console.error("Erreur Auth", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};