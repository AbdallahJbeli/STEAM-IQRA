import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/dashboard/StatCard";
import { Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react";

const DashboardPage = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === "ar";

  const greeting = isRTL ? "مرحباً بعودتك" : i18n.language === "fr" ? "Bon retour" : "Welcome back";

  return (
    <div className="space-y-8">
      {/* header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {greeting}, <span style={{ color: "#00d9ff" }}>{user?.email?.split("@")[0]}</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          {isRTL ? "إليك نظرة عامة على المنصة"
            : i18n.language === "fr" ? "Voici un aperçu de votre plateforme"
            : "Here's an overview of your platform"}
        </p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label={isRTL ? "إجمالي المدربين" : i18n.language === "fr" ? "Total formateurs" : "Total Trainers"}
          value="—"
          accent="#00d9ff"
          icon={<Users size={18} />}
          sub={isRTL ? "قادم قريباً" : "Coming soon"}
        />
        <StatCard
          label={isRTL ? "إجمالي الطلاب" : i18n.language === "fr" ? "Total étudiants" : "Total Students"}
          value="—"
          accent="#ff2e7e"
          icon={<GraduationCap size={18} />}
          sub={isRTL ? "قادم قريباً" : "Coming soon"}
        />
        <StatCard
          label={isRTL ? "الدورات النشطة" : i18n.language === "fr" ? "Cours actifs" : "Active Courses"}
          value="—"
          accent="#b366ff"
          icon={<BookOpen size={18} />}
          sub={isRTL ? "قادم قريباً" : "Coming soon"}
        />
      </div>

      {/* placeholder content */}
      <div className="rounded-2xl p-8 flex flex-col items-center justify-center text-center"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", minHeight: "300px" }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "rgba(0,217,255,0.08)" }}>
          <TrendingUp size={28} style={{ color: "#00d9ff" }} />
        </div>
        <h3 className="text-white font-semibold mb-2">
          {isRTL ? "التحليلات قادمة قريباً" : i18n.language === "fr" ? "Analyses bientôt disponibles" : "Analytics coming soon"}
        </h3>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          {isRTL ? "ستظهر هنا الإحصائيات التفصيلية بعد ربط الخدمات"
            : i18n.language === "fr" ? "Les statistiques détaillées apparaîtront ici après la connexion des services"
            : "Detailed stats will appear here after connecting services"}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;