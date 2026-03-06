import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";

const ROLES = [
    { value: "student", label: "🎓 Étudiant", desc: "Accéder aux cours et formations" },
    { value: "teacher", label: "📚 Enseignant", desc: "Créer et gérer des cours" },
    { value: "admin", label: "⚙️ Administrateur", desc: "Gérer la plateforme" },
];

const RegisterPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "", role: "student" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (formData.password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            setLoading(false);
            return;
        }

        try {
            await register(formData.email, formData.password, formData.role);
            setSuccess("Compte créé avec succès ! Redirection vers la connexion...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = () => {
        const pwd = formData.password;
        if (pwd.length === 0) return { level: 0, label: "", color: "" };
        if (pwd.length < 6) return { level: 1, label: "Trop court", color: "#ef4444" };
        if (pwd.length < 8) return { level: 2, label: "Faible", color: "#f97316" };
        if (pwd.length < 12) return { level: 3, label: "Moyen", color: "#eab308" };
        return { level: 4, label: "Fort", color: "#22c55e" };
    };

    const strength = passwordStrength();

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <div className="auth-card auth-card-wide">
                <div className="auth-card-header">
                    <div className="brand-logo">
                        <span className="brand-icon">⚡</span>
                        <span className="brand-name">STEAM IQRA</span>
                    </div>
                    <h1 className="auth-title">Créer un compte</h1>
                    <p className="auth-subtitle">Rejoignez la plateforme STEAM IQRA</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="alert alert-error">
                            <span className="alert-icon">⚠</span>
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success">
                            <span className="alert-icon">✅</span>
                            <span>{success}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="reg-email" className="form-label">
                            Adresse email
                        </label>
                        <div className="input-wrapper">
                            <span className="input-icon">✉</span>
                            <input
                                id="reg-email"
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
                        <label htmlFor="reg-password" className="form-label">
                            Mot de passe
                        </label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                id="reg-password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 6 caractères"
                                className="form-input"
                                required
                                autoComplete="new-password"
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
                        {formData.password.length > 0 && (
                            <div className="password-strength">
                                <div className="strength-bars">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className="strength-bar"
                                            style={{
                                                backgroundColor: strength.level >= level ? strength.color : "rgba(255,255,255,0.1)",
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="strength-label" style={{ color: strength.color }}>
                                    {strength.label}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Rôle</label>
                        <div className="role-grid">
                            {ROLES.map((role) => (
                                <label
                                    key={role.value}
                                    className={`role-card ${formData.role === role.value ? "role-card-active" : ""}`}
                                    htmlFor={`role-${role.value}`}
                                >
                                    <input
                                        type="radio"
                                        id={`role-${role.value}`}
                                        name="role"
                                        value={role.value}
                                        checked={formData.role === role.value}
                                        onChange={handleChange}
                                        className="role-radio"
                                    />
                                    <span className="role-label">{role.label}</span>
                                    <span className="role-desc">{role.desc}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`btn-primary ${loading ? "btn-loading" : ""}`}
                        disabled={loading}
                        id="register-submit-btn"
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                <span>Création en cours...</span>
                            </>
                        ) : (
                            "Créer mon compte"
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Déjà un compte ?{" "}
                        <Link to="/login" className="auth-link">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
