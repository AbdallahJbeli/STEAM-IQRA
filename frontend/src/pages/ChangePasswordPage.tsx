import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/auth.api";
import { TriangleAlert } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

const languages = [
  { code: "ar", label: "AR" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

const ChangePasswordPage = () => {
  const { t, i18n } = useTranslation();
  const { logout, user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isRTL = i18n.language === "ar";

  const inputStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError(
        isRTL ? "كلمات المرور غير متطابقة"
        : i18n.language === "fr" ? "Les mots de passe ne correspondent pas"
        : "Passwords do not match"
      );
      return;
    }

    setIsLoading(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.response?.data?.error || t("changePassword.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordField = ({
    value, onChange, show, onToggle,
  }: {
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
  }) => (
    <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder="Enter your password"
        className="w-full py-3 rounded-xl outline-none transition-all duration-200"
        style={{
          ...inputStyle,
          paddingLeft: isRTL ? "2.75rem" : "1rem",
          paddingRight: isRTL ? "1rem" : "2.75rem",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#b366ff")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 flex items-center transition-colors"
        style={{
          color: "rgba(255,255,255,0.3)",
          left: isRTL ? "0.75rem" : "auto",
          right: isRTL ? "auto" : "0.75rem",
        }}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0e27 0%, #121629 60%, #0f1c3f 100%)" }}
    >
      {/* background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #b366ff, transparent)" }} />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #00d9ff, transparent)" }} />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
      </div>

      {/* language switcher */}
      <div className="absolute top-5 right-5 flex gap-1" dir="ltr">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
            style={{
              background: i18n.language === lang.code ? "rgba(255,255,255,0.15)" : "transparent",
              color: i18n.language === lang.code ? "#ffffff" : "rgba(255,255,255,0.4)",
              border: i18n.language === lang.code ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
            }}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* card */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="STEAM-IQRA" className="h-20 w-20 object-contain" />
        </div>

        {/* title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">{t("changePassword.title")}</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            {t("changePassword.subtitle")}
          </p>
          {user && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#b366ff" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{user.email}</span>
            </div>
          )}
        </div>

        {/* warning banner */}
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl mb-6"
          style={{ background: "rgba(179,102,255,0.1)", border: "1px solid rgba(179,102,255,0.3)" }}
        >
          <TriangleAlert size={16} className="mt-0.5 shrink-0" style={{ color: "#b366ff" }} />
          <p className="text-sm" style={{ color: "#b366ff" }}>
            {isRTL ? "يجب تغيير كلمة المرور المؤقتة قبل المتابعة"
              : i18n.language === "fr" ? "Vous devez changer votre mot de passe temporaire avant de continuer"
              : "For your security — Please create a strong new password"}
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
              {t("changePassword.currentPassword")}
            </label>
            <PasswordField value={currentPassword} onChange={setCurrentPassword} show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
              {t("changePassword.newPassword")}
            </label>
            <PasswordField value={newPassword} onChange={setNewPassword} show={showNew} onToggle={() => setShowNew(!showNew)} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
              {isRTL ? "تأكيد كلمة المرور" : i18n.language === "fr" ? "Confirmer le mot de passe" : "Confirm Password"}
            </label>
            <PasswordField value={confirmPassword} onChange={setConfirmPassword} show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm text-center"
              style={{ background: "rgba(255,46,126,0.1)", border: "1px solid rgba(255,46,126,0.3)", color: "#ff2e7e" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ background: "linear-gradient(90deg, #b366ff, #00d9ff)" }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("common.loading")}
              </span>
            ) : t("changePassword.submit")}
          </button>
        </form>

        {/* divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          <span className="text-xs font-medium px-2" style={{ color: "rgba(255,255,255,0.3)" }}>FIRST LOGIN</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-4 w-full text-sm transition-colors text-center"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          ← {isRTL ? "تسجيل الخروج" : i18n.language === "fr" ? "Se déconnecter" : "Sign Out"}
        </button>
      </div>

      <p className="mt-6 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
        © 2024 STEAM-IQRA. All rights reserved.
      </p>
    </div>
  );
};

export default ChangePasswordPage;