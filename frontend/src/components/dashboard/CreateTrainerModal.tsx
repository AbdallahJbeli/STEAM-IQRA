// src/components/dashboard/CreateTrainerModal.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { authApi } from "../../services/auth.api";
import { X, UserPlus, Copy, Check } from "lucide-react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTrainerModal = ({ onClose, onSuccess }: Props) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ email: string; tempPassword: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await authApi.createTrainer(email);
      setResult(data.credentials);
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create trainer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Email: ${result.email}\nPassword: ${result.tempPassword}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          background: "#121629",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(0,217,255,0.1)", color: "#00d9ff" }}>
              <UserPlus size={16} />
            </div>
            <h2 className="text-white font-semibold">
              {isRTL ? "إضافة مدرب جديد" : i18n.language === "fr" ? "Ajouter un formateur" : "Create Trainer"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.4)" }}>
            <X size={16} />
          </button>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                {isRTL ? "البريد الإلكتروني" : i18n.language === "fr" ? "Adresse e-mail" : "Email address"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="trainer@steam-iqra.com"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 text-white"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#00d9ff")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                {isRTL ? "سيتم إنشاء كلمة مرور مؤقتة تلقائياً"
                  : i18n.language === "fr" ? "Un mot de passe temporaire sera généré automatiquement"
                  : "A temporary password will be generated automatically"}
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(255,46,126,0.1)", border: "1px solid rgba(255,46,126,0.2)", color: "#ff2e7e" }}>
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                {isRTL ? "إلغاء" : i18n.language === "fr" ? "Annuler" : "Cancel"}
              </button>
              <button type="submit" disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(90deg, #00d9ff, #b366ff)" }}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </span>
                ) : isRTL ? "إنشاء" : i18n.language === "fr" ? "Créer" : "Create"}
              </button>
            </div>
          </form>
        ) : (
          // success state — show credentials
          <div className="space-y-4">
            <div className="px-4 py-3 rounded-xl text-sm"
              style={{ background: "rgba(0,217,255,0.08)", border: "1px solid rgba(0,217,255,0.2)", color: "#00d9ff" }}>
              {isRTL ? "✓ تم إنشاء حساب المدرب بنجاح"
                : i18n.language === "fr" ? "✓ Compte formateur créé avec succès"
                : "✓ Trainer account created successfully"}
            </div>

            <div className="rounded-xl p-4 space-y-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                {isRTL ? "بيانات الدخول المؤقتة" : i18n.language === "fr" ? "Identifiants temporaires" : "Temporary credentials"}
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Email</span>
                  <span className="text-sm text-white font-medium">{result.email}</span>
                </div>
                <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {isRTL ? "كلمة المرور" : "Password"}
                  </span>
                  <span className="text-sm font-mono" style={{ color: "#00d9ff" }}>{result.tempPassword}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-center" style={{ color: "rgba(255,46,126,0.8)" }}>
              {isRTL ? "⚠ احفظ هذه البيانات — لن تظهر مرة أخرى"
                : i18n.language === "fr" ? "⚠ Sauvegardez ces informations — elles ne seront plus affichées"
                : "⚠ Save these credentials — they won't be shown again"}
            </p>

            <div className="flex gap-3">
              <button onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied
                  ? isRTL ? "تم النسخ" : "Copied!"
                  : isRTL ? "نسخ" : i18n.language === "fr" ? "Copier" : "Copy"}
              </button>
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(90deg, #00d9ff, #b366ff)" }}>
                {isRTL ? "إغلاق" : i18n.language === "fr" ? "Fermer" : "Done"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTrainerModal;