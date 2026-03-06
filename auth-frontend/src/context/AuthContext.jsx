import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    // Charger l'utilisateur depuis l'API au démarrage si un token existe
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const userData = await getMe();
                    setUser(userData);
                } catch {
                    // Token invalide ou expiré
                    localStorage.removeItem("token");
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    // Sauvegarder le token et charger l'user
    const saveToken = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    // Déconnexion
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, saveToken, logout, loading, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé dans un AuthProvider");
    }
    return context;
};
