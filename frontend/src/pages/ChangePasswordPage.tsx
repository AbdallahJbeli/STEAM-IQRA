import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/auth.api";
import { Eye, EyeOff, KeyRound } from "lucide-react";

const ChangePasswordPage = () => {
  const { t, i18n } = useTranslation();
  const { logout, user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isRTL = i18n.language === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      // refresh page to re-evaluate mustChangeCredentials
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.response?.data?.error || t("changePassword.error"));
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
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 opacity-10 rounded-full blur-3xl" />
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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-20 blur" />

        <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 mb-4 shadow-lg shadow-emerald-500/20">
              <KeyRound size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {t("changePassword.title")}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {t("changePassword.subtitle")}
            </p>
            {/* show who is logged in */}
            {user && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700 border border-slate-600">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-300 text-xs">{user.email}</span>
              </div>
            )}
          </div>

          {/* warning banner */}
          <div className="mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm text-center">
            {isRTL
              ? "يجب تغيير كلمة المرور المؤقتة قبل المتابعة"
              : i18n.language === "fr"
              ? "Vous devez changer votre mot de passe temporaire avant de continuer"
              : "You must change your temporary password before continuing"}
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* current password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                {t("changePassword.currentPassword")}
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* new password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                {t("changePassword.newPassword")}
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("common.loading")}
                </span>
              ) : (
                t("changePassword.submit")
              )}
            </button>

            {/* logout */}
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

export default ChangePasswordPage;
