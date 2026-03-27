import StatusBadge from "@/components/ui/StatusBadge";

type TournamentHeroProps = {
  title: string;
  description?: string | null;
  location?: string | null;
  startDate: Date | string;
  status: string;
  registrationsCount: number;
  maxPlayers: number;
};

export default function TournamentHero({
  title,
  description,
  location,
  startDate,
  status,
  registrationsCount,
  maxPlayers,
}: TournamentHeroProps) {
  const date = new Date(startDate);
  const percentage = maxPlayers > 0 ? Math.min((registrationsCount / maxPlayers) * 100, 100) : 0;

  return (
    <section className="glass-panel-strong relative overflow-hidden p-8 sm:p-10">
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatusBadge value={status} />
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-300">
              {location || "Location TBA"}
            </span>
          </div>

          <h1 className="bey-title text-4xl text-white sm:text-5xl">{title}</h1>

          <p className="mt-3 text-base text-slate-300">
            {date.toLocaleString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>

          {description ? (
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        <div className="min-w-[280px] rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300/80">
            Bracket Status
          </p>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold text-white">{registrationsCount}</p>
              <p className="text-sm text-slate-400">Registered Players</p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-extrabold text-amber-200">{maxPlayers}</p>
              <p className="text-sm text-slate-400">Max Capacity</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
              <span>Capacity</span>
              <span>{registrationsCount}/{maxPlayers}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-300 shadow-[0_0_12px_rgba(56,189,248,0.22)] transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}