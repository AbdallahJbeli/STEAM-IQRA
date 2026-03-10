import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/auth.api";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

const ChangeCredentialsPage = () => {
  const { t, i18n } = useTranslation();
  const { logout, login } = useAuth();

  const [newEmail, setNewEmail] = useState("");
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
      await authApi.changeCredentials({ newEmail, password });
      // logout first to clear old token
      logout();
      // then login with new credentials
      await login(newEmail, password);
    } catch (err: any) {
      setError(err?.response?.data?.error || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden"
    >
      {/* background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500 opacity-10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 opacity-10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,179,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative w-full max-w-md mx-4">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-2xl opacity-20 blur" />

        <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-cyan-500 mb-4 shadow-lg shadow-violet-500/20">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {t("changeCredentials.title")}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {t("changeCredentials.subtitle")}
            </p>
          </div>

          {/* warning banner */}
          <div className="mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm text-center">
            {isRTL
              ? "هذه خطوة إلزامية لتأمين حسابك"
              : i18n.language === "fr"
              ? "Cette étape est obligatoire pour sécuriser votre compte"
              : "This step is mandatory to secure your account"}
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* new email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                {t("changeCredentials.newEmail")}
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                placeholder="admin@steam-iqra.com"
              />
            </div>

            {/* new password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                {t("changeCredentials.newPassword")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-violet-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("common.loading")}
                </span>
              ) : (
                t("changeCredentials.submit")
              )}
            </button>

            {/* logout link */}
            <button
              type="button"
              onClick={logout}
              className="w-full text-sm text-slate-500 hover:text-slate-300 transition-colors text-center"
            >
              {isRTL ? "تسجيل الخروج" : i18n.language === "fr" ? "Se déconnecter" : "Logout"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangeCredentialsPage;