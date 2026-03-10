import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

const mockStudents = [
  { id: 1, email: "student1@gmail.com", is_active: true, created_at: "2024-03-01" },
  { id: 2, email: "student2@gmail.com", is_active: true, created_at: "2024-03-05" },
  { id: 3, email: "student3@gmail.com", is_active: false, created_at: "2024-03-10" },
];

const StudentsPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [search, setSearch] = useState("");

  const filtered = mockStudents.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {isRTL ? "الطلاب" : i18n.language === "fr" ? "Étudiants" : "Students"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          {isRTL ? "عرض حسابات الطلاب" : i18n.language === "fr" ? "Voir les comptes étudiants" : "View student accounts"}
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>

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
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={(e) => (e.target.style.borderColor = "#ff2e7e")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>
        </div>

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
            {filtered.map((student, i) => (
              <tr key={student.id}
                className="transition-colors hover:bg-white/[0.02]"
                style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
              >
                <td className="px-5 py-4 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>{student.id}</td>
                <td className="px-5 py-4 text-sm text-white">{student.email}</td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: student.is_active ? "rgba(0,217,255,0.1)" : "rgba(255,46,126,0.1)",
                      color: student.is_active ? "#00d9ff" : "#ff2e7e",
                      border: `1px solid ${student.is_active ? "rgba(0,217,255,0.2)" : "rgba(255,46,126,0.2)"}`,
                    }}>
                    {student.is_active
                      ? isRTL ? "نشط" : i18n.language === "fr" ? "Actif" : "Active"
                      : isRTL ? "غير نشط" : i18n.language === "fr" ? "Inactif" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {student.created_at}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-sm"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  {isRTL ? "لا يوجد طلاب" : i18n.language === "fr" ? "Aucun étudiant" : "No students found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsPage;