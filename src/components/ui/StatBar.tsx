type StatBarProps = {
  label: string;
  value: number;
  max?: number;
  color?: "attack" | "defense" | "stamina";
  showValue?: boolean; 
};

export default function StatBar({
  label,
  value,
  max = 100,
  color = "attack",
  showValue = true, 
}: StatBarProps) {
  const percent = Math.min((value / max) * 100, 100);

  const fillClass =
    color === "attack"
      ? "from-red-500 to-orange-400"
      : color === "defense"
      ? "from-blue-500 to-cyan-400"
      : "from-yellow-400 to-lime-400";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur">
        <div className="relative h-12 overflow-hidden rounded-2xl bg-slate-900/80">
            <div
            className={`absolute inset-y-0 left-0 rounded-2xl bg-gradient-to-r ${fillClass} transition-all duration-500`}
            style={{ width: `${percent}%` }}
            />

            <div className="relative z-10 grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-2">
            <span className="min-w-0 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 sm:text-xs">
                {label}
            </span>

            {showValue && (
                <span className="ml-4 min-w-[3.5rem] pr-1 text-right text-[15px] font-extrabold leading-none text-white/90">
                    {value}
                </span>
            )}
            </div>
        </div>
    </div>
  );
}