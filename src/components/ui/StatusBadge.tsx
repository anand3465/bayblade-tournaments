type StatusBadgeProps = {
  value: string;
};

function getClasses(value: string) {
  const key = value.toUpperCase();

  switch (key) {
    case "ACTIVE":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "UPCOMING":
      return "border-sky-400/30 bg-sky-400/10 text-sky-300";
    case "COMPLETED":
      return "border-slate-400/20 bg-slate-400/10 text-slate-300";
    case "PUBLIC":
      return "border-cyan-400/30 bg-cyan-400/10 text-cyan-300";
    case "PRIVATE":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300";
    case "ATTACK":
      return "border-red-400/30 bg-red-400/10 text-red-300";
    case "DEFENSE":
      return "border-sky-400/30 bg-sky-400/10 text-sky-300";
    case "STAMINA":
      return "border-amber-300/30 bg-amber-300/10 text-amber-200";
    case "BALANCE":
      return "border-violet-400/30 bg-violet-400/10 text-violet-300";
    case "ADMIN":
      return "border-amber-300/30 bg-amber-300/10 text-amber-200";
    default:
      return "border-white/10 bg-white/5 text-slate-200";
  }
}

export default function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getClasses(
        value
      )}`}
    >
      {value}
    </span>
  );
}