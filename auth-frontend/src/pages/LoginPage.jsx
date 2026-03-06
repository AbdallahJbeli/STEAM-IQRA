import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { saveToken, setUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await login(formData.email, formData.password);
            saveToken(data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <div className="auth-card">
                <div className="auth-card-header">
                    <div className="brand-logo">
                        <span className="brand-icon">⚡</span>
                        <span className="brand-name">STEAM IQRA</span>
                    </div>
                    <h1 className="auth-title">Bon retour !</h1>
                    <p className="auth-subtitle">Connectez-vous à votre compte</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="alert alert-error">
                            <span className="alert-icon">⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Adresse email
                        </label>
                        <div className="input-wrapper">
                            <span className="input-icon">✉</span>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="exemple@email.com"
                                className="form-input"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Mot de passe
                        </label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Votre mot de passe"
                                className="form-input"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Afficher/masquer le mot de passe"
                            >
                                {showPassword ? "🙈" : "👁"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`btn-primary ${loading ? "btn-loading" : ""}`}
                        disabled={loading}
                        id="login-submit-btn"
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                <span>Connexion en cours...</span>
                            </>
                        ) : (
                            "Se connecter"
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Pas encore de compte ?{" "}
                        <Link to="/register" className="auth-link">
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
