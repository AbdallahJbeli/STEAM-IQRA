// src/components/dashboard/Navbar.tsx
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Menu } from "lucide-react";

const languages = [
  { code: "ar", label: "AR" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { i18n } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = i18n.language === "ar";

  return (
    <header
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-10"
      style={{
        background: "rgba(10,14,39,0.8)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* left — menu toggle on mobile */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg transition-colors md:hidden"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        <Menu size={20} />
      </button>

      {/* page title placeholder */}
      <div className="hidden md:block" />

      {/* right */}
      <div className="flex items-center gap-4" dir="ltr">
        {/* language switcher */}
        <div className="flex gap-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: i18n.language === lang.code ? "rgba(255,255,255,0.1)" : "transparent",
                color: i18n.language === lang.code ? "#ffffff" : "rgba(255,255,255,0.3)",
                border: i18n.language === lang.code ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* divider */}
        <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* user email */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #00d9ff, #ff2e7e)", color: "white" }}>
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm hidden md:block" style={{ color: "rgba(255,255,255,0.6)" }}>
            {user?.email}
          </span>
        </div>

        {/* logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-white/5"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <LogOut size={15} />
          <span className="hidden md:block">
            {isRTL ? "خروج" : i18n.language === "fr" ? "Déconnexion" : "Sign out"}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;