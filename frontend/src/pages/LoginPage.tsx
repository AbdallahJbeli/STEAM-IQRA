import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const languages = [
  { code: "ar", label: "AR" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isRTL = i18n.language === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
    } catch {
      setError(t("login.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0e27 0%, #121629 60%, #0f1c3f 100%)" }}
    >
      {/* background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #00d9ff, transparent)" }} />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #ff2e7e, transparent)" }} />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
      </div>

      {/* language switcher — always top-right regardless of RTL */}
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">{t("login.title")}</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{t("login.subtitle")}</p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
              {t("login.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#00d9ff")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
              {t("login.password")}
            </label>
            {/* always ltr so eye button stays inside the input */}
            <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full py-3 rounded-xl outline-none transition-all duration-200"
                style={{...inputStyle, paddingLeft: isRTL ? "2.75rem" : "1rem", paddingRight: isRTL ? "1rem" : "2.75rem"}}
                onFocus={(e) => (e.target.style.borderColor = "#00d9ff")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 flex items-center transition-colors"
                style={{ color: "rgba(255,255,255,0.3)", left: isRTL ? "0.75rem" : "auto", right: isRTL ? "auto" : "0.75rem" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* error */}
          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm text-center"
              style={{
                background: "rgba(255,46,126,0.1)",
                border: "1px solid rgba(255,46,126,0.3)",
                color: "#ff2e7e",
              }}
            >
              {error}
            </div>
          )}

          {/* submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ background: "linear-gradient(90deg, #00d9ff, #ff2e7e)" }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("common.loading")}
              </span>
            ) : (
              t("login.submit")
            )}
          </button>
        </form>

        {/* divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          <span className="text-xs font-medium px-2" style={{ color: "rgba(255,255,255,0.3)" }}>
            STEAM-IQRA
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        </div>
      </div>

      {/* footer */}
      <p className="mt-6 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
        © 2024 STEAM-IQRA. All rights reserved.
      </p>
    </div>
  );
};

export default LoginPage;