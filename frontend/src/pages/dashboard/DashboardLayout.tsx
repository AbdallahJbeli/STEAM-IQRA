import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import Navbar from "../../components/dashboard/Navbar";
import { useTranslation } from "react-i18next";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div
      className="flex min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ background: "linear-gradient(135deg, #0a0e27 0%, #121629 60%, #0f1c3f 100%)" }}
    >
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setCollapsed(!collapsed)} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;