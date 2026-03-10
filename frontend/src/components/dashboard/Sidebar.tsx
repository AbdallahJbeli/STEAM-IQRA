// src/components/dashboard/Sidebar.tsx
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Users, GraduationCap, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, labelKey: "nav.dashboard", path: "/dashboard" },
  { icon: Users, labelKey: "nav.trainers", path: "/dashboard/trainers" },
  { icon: GraduationCap, labelKey: "nav.students", path: "/dashboard/students" },
  { icon: Settings, labelKey: "nav.settings", path: "/dashboard/settings" },
];

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 z-20"
      style={{
        width: collapsed ? "72px" : "240px",
        background: "rgba(255,255,255,0.03)",
        borderRight: isRTL ? "none" : "1px solid rgba(255,255,255,0.07)",
        borderLeft: isRTL ? "1px solid rgba(255,255,255,0.07)" : "none",
      }}
    >
      {/* logo */}
      <div className="flex items-center gap-3 px-4 py-5 mb-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <img src="/logo.png" alt="STEAM-IQRA" className="w-9 h-9 object-contain shrink-0" />
        {!collapsed && (
          <span className="text-white font-bold text-sm tracking-wide whitespace-nowrap">
            STEAM-IQRA
          </span>
        )}
      </div>

      {/* nav items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ icon: Icon, labelKey, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
              boxShadow: isActive ? "inset 0 0 0 1px rgba(255,255,255,0.08)" : "none",
            })}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className="shrink-0"
                  style={{ color: isActive ? "#00d9ff" : undefined }}
                />
                {!collapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {i18n.language === "ar"
                      ? { "nav.dashboard": "لوحة التحكم", "nav.trainers": "المدربون", "nav.students": "الطلاب", "nav.settings": "الإعدادات" }[labelKey]
                      : i18n.language === "fr"
                      ? { "nav.dashboard": "Tableau de bord", "nav.trainers": "Formateurs", "nav.students": "Étudiants", "nav.settings": "Paramètres" }[labelKey]
                      : { "nav.dashboard": "Dashboard", "nav.trainers": "Trainers", "nav.students": "Students", "nav.settings": "Settings" }[labelKey]
                    }
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* collapse toggle */}
      <div className="px-2 pb-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          {collapsed
            ? <ChevronRight size={16} />
            : <><ChevronLeft size={16} />{!collapsed && <span className="text-xs ml-2">Collapse</span>}</>
          }
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;