import React, { createContext, useContext, useState } from 'react';

// AuthContextの作成
const AuthContext = createContext();

// AuthProviderの作成
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = (token) => {
        setToken(token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setToken(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ token, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuthフックの作成
export const useAuth = () => {
    return useContext(AuthContext);
};
