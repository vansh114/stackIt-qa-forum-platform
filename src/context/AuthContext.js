import { createContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
    const [user, setUser] = useState(authToken ? jwtDecode(authToken) : null);

    useEffect(() => {
        if (authToken) {
            try {
                const decoded = jwtDecode(authToken);
                setUser(decoded.user);
            } catch {
                setAuthToken(null);
                setUser(null);
            }
        }
    }, [authToken]);

    const login = (token) => {
        localStorage.setItem('authToken', token);
        setAuthToken(token);
        setUser(jwtDecode(token).user);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;