import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus, Search } from "lucide-react";
import CreateTrainerModal from "../../components/dashboard/CreateTrainerModal";

// placeholder data — will come from user-service later
const mockTrainers = [
  { id: 1, email: "trainer1@steam-iqra.com", is_active: true, created_at: "2024-01-15" },
  { id: 2, email: "trainer2@steam-iqra.com", is_active: false, created_at: "2024-02-20" },
];

const TrainersPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = mockTrainers.filter((t) =>
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isRTL ? "المدربون" : i18n.language === "fr" ? "Formateurs" : "Trainers"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            {isRTL ? "إدارة حسابات المدربين" : i18n.language === "fr" ? "Gérer les comptes formateurs" : "Manage trainer accounts"}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(90deg, #00d9ff, #b366ff)" }}
        >
          <UserPlus size={16} />
          {isRTL ? "إضافة مدرب" : i18n.language === "fr" ? "Ajouter formateur" : "Add Trainer"}
        </button>
      </div>

      {/* search + table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>

        {/* search bar */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="relative max-w-xs">
            <Search size={15} className="absolute top-1/2 -translate-y-1/2 left-3"
              style={{ color: "rgba(255,255,255,0.3)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRTL ? "بحث..." : i18n.language === "fr" ? "Rechercher..." : "Search..."}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#00d9ff")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>
        </div>

        {/* table */}
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["#", isRTL ? "البريد الإلكتروني" : "Email", isRTL ? "الحالة" : "Status", isRTL ? "تاريخ الإنشاء" : "Created"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((trainer, i) => (
              <tr key={trainer.id}
                className="transition-colors hover:bg-white/[0.02]"
                style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
              >
                <td className="px-5 py-4 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>{trainer.id}</td>
                <td className="px-5 py-4 text-sm text-white">{trainer.email}</td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: trainer.is_active ? "rgba(0,217,255,0.1)" : "rgba(255,46,126,0.1)",
                      color: trainer.is_active ? "#00d9ff" : "#ff2e7e",
                      border: `1px solid ${trainer.is_active ? "rgba(0,217,255,0.2)" : "rgba(255,46,126,0.2)"}`,
                    }}>
                    {trainer.is_active
                      ? isRTL ? "نشط" : i18n.language === "fr" ? "Actif" : "Active"
                      : isRTL ? "غير نشط" : i18n.language === "fr" ? "Inactif" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {trainer.created_at}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-sm"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  {isRTL ? "لا يوجد مدربون" : i18n.language === "fr" ? "Aucun formateur" : "No trainers found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CreateTrainerModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default TrainersPage;