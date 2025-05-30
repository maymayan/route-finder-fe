// src/context/AuthContext.tsx
import {createContext, ReactNode, useContext, useState} from 'react';

interface AuthContextProps {
    isAuthenticated: boolean;
    token: string | null;
    userRole: string | null;
    login: (token: string, role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [userRole, setUserRole] = useState<string | null>(() => localStorage.getItem('role'));

    const login = (token: string, role: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setToken(token);
        setUserRole(role);

    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUserRole(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{isAuthenticated, token, userRole, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("AuthContext not found");
    return ctx;
};
