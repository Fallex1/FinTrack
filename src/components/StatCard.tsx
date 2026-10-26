type StatCardProps = {
  label: string;
  value: string;
  change?: string;
  icon?: React.ReactNode;
  iconBg?: string;
};

export default function StatCard({
  label,
  value,
  change,
  icon,
  iconBg = "bg-primary/20",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-light shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className={`w-11 h-11 rounded-lg flex items-center justify-center ${iconBg} text-primary`}>
          {icon}
        </span>
        <span className="text-xs font-medium text-muted">{change || "—"}</span>
      </div>
      <p className="text-muted text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-dark">{value}</p>
    </div>
  );
}
