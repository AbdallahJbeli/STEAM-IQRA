// src/components/dashboard/StatCard.tsx
interface StatCardProps {
  label: string;
  value: number | string;
  accent: string;
  icon: React.ReactNode;
  sub?: string;
}

const StatCard = ({ label, value, accent, icon, sub }: StatCardProps) => (
  <div
    className="relative rounded-2xl p-6 overflow-hidden"
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    {/* glow */}
    <div
      className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-20"
      style={{ background: accent }}
    />

    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
          {label}
        </p>
        <p className="text-3xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>}
      </div>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}20`, color: accent }}
      >
        {icon}
      </div>
    </div>

    {/* bottom accent line */}
    <div
      className="absolute bottom-0 left-0 right-0 h-0.5"
      style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
    />
  </div>
);

export default StatCard;