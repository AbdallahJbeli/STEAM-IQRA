import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMe } from "../api/auth";

const roleConfig = {
    student: { label: "Étudiant", icon: "🎓", color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
    teacher: { label: "Enseignant", icon: "📚", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
    admin: { label: "Administrateur", icon: "⚙️", color: "#ec4899", bg: "rgba(236,72,153,0.15)" },
};

const DashboardPage = () => {
    const { user, logout, token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getMe();
                setProfile(data);
            } catch {
                logout();
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const role = profile?.role || user?.role || "student";
    const roleInfo = roleConfig[role] || roleConfig.student;

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Chargement du tableau de bord...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            {/* Background */}
            <div className="dashboard-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-3"></div>
            </div>

            {/* Navbar */}
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <span className="brand-icon">⚡</span>
                    <span className="brand-name">STEAM IQRA</span>
                </div>
                <div className="nav-actions">
                    <div className="nav-user">
                        <div className="user-avatar" style={{ background: roleInfo.bg, border: `1px solid ${roleInfo.color}` }}>
                            {roleInfo.icon}
                        </div>
                        <span className="user-email">{profile?.email || user?.email || "Utilisateur"}</span>
                    </div>
                    <button id="logout-btn" className="btn-logout" onClick={handleLogout}>
                        <span>Déconnexion</span>
                        <span>→</span>
                    </button>
                </div>
            </nav>

            {/* Contenu principal */}
            <main className="dashboard-main">
                {/* En-tête de bienvenue */}
                <div className="welcome-section">
                    <div className="welcome-badge" style={{ background: roleInfo.bg, border: `1px solid ${roleInfo.color}` }}>
                        <span>{roleInfo.icon}</span>
                        <span style={{ color: roleInfo.color }}>{roleInfo.label}</span>
                    </div>
                    <h1 className="welcome-title">
                        Bienvenue sur votre tableau de bord
                    </h1>
                    <p className="welcome-subtitle">
                        Vous êtes connecté en tant que <strong>{roleInfo.label}</strong> sur la plateforme STEAM IQRA.
                    </p>
                </div>

                {/* Cartes statistiques */}
                <div className="stats-grid">
                    <div className="stat-card stat-card-1">
                        <div className="stat-icon">🔐</div>
                        <div className="stat-content">
                            <span className="stat-label">Statut</span>
                            <span className="stat-value">
                                {profile?.is_active ? (
                                    <span className="badge-active">✓ Actif</span>
                                ) : (
                                    <span className="badge-inactive">✗ Inactif</span>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="stat-card stat-card-2">
                        <div className="stat-icon">👤</div>
                        <div className="stat-content">
                            <span className="stat-label">ID Utilisateur</span>
                            <span className="stat-value">#{profile?.id || "—"}</span>
                        </div>
                    </div>

                    <div className="stat-card stat-card-3">
                        <div className="stat-icon">📅</div>
                        <div className="stat-content">
                            <span className="stat-label">Membre depuis</span>
                            <span className="stat-value stat-value-sm">{formatDate(profile?.created_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Carte profil détaillée */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <h2 className="profile-card-title">📋 Informations du profil</h2>
                        <div className="profile-token-badge">JWT Authentifié ✓</div>
                    </div>
                    <div className="profile-card-body">
                        <div className="profile-field">
                            <label className="field-label">Email</label>
                            <div className="field-value">{profile?.email || "—"}</div>
                        </div>
                        <div className="profile-field">
                            <label className="field-label">Rôle</label>
                            <div className="field-value">
                                <span className="role-pill" style={{ background: roleInfo.bg, color: roleInfo.color }}>
                                    {roleInfo.icon} {roleInfo.label}
                                </span>
                            </div>
                        </div>
                        <div className="profile-field">
                            <label className="field-label">Compte actif</label>
                            <div className="field-value">{profile?.is_active ? "Oui ✓" : "Non ✗"}</div>
                        </div>
                        <div className="profile-field">
                            <label className="field-label">Créé le</label>
                            <div className="field-value">{formatDate(profile?.created_at)}</div>
                        </div>
                    </div>
                </div>

                {/* Token JWT info */}
                <div className="token-card">
                    <div className="token-card-header">
                        <h2 className="token-card-title">🔑 Token d'authentification</h2>
                        <span className="token-status">Actif</span>
                    </div>
                    <div className="token-value">
                        {token ? `${token.substring(0, 60)}...` : "Aucun token"}
                    </div>
                    <p className="token-hint">Valable 24 heures · JWT signé avec RS256</p>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
