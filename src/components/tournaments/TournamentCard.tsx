import Link from "next/link";
import AnimatedCard from "@/components/ui/AnimatedCard";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";

type TournamentCardProps = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startDate: Date | string;
  status: string;
  registrationsCount: number;
  maxPlayers: number;
  createdByUsername?: string | null;
  delay?: number;
};

export default function TournamentCard({
  id,
  title,
  description,
  location,
  startDate,
  status,
  registrationsCount,
  maxPlayers,
  createdByUsername,
  delay = 0,
}: TournamentCardProps) {
  const date = new Date(startDate);
  const capacity = maxPlayers > 0 ? Math.min((registrationsCount / maxPlayers) * 100, 100) : 0;

  return (
    <AnimatedCard delay={delay}>
      <GlassCard strong className="bey-card h-full p-6">
        <div className="flex h-full flex-col">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-extrabold text-white">{title}</h3>
              <p className="mt-1 text-sm text-slate-400">
                {date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <StatusBadge value={status} />
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <p>{location || "Location TBA"}</p>
            {createdByUsername ? <p>Hosted by {createdByUsername}</p> : null}
          </div>

          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
            {description || "Get ready for intense matchups, custom combos, and a competitive stadium atmosphere."}
          </p>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-300">Bracket Capacity</span>
              <span className="font-bold text-white">
                {registrationsCount}/{maxPlayers}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-300 transition-all duration-300"
                style={{ width: `${capacity}%` }}
              />
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`/tournaments/${id}`}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-4 py-2 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5"
            >
              View Tournament
            </Link>
          </div>
        </div>
      </GlassCard>
    </AnimatedCard>
  );
}