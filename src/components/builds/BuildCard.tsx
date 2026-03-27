import AnimatedCard from "@/components/ui/AnimatedCard";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";
import BuildStats from "@/components/builds/BuildStats";
import PartChip from "@/components/builds/PartChip";
import StatBar from "../ui/StatBar";

type BuildCardProps = {
  name: string;
  blade: string;
  ratchet: string;
  bit: string;
  type: string;
  visibility?: string;
  attack: number;
  defense: number;
  stamina: number;
  weight?: number;
  speed?: number;
  ownerName?: string | null;
  isOwner?: boolean;
  delay?: number;
};

export default function BuildCard({
  name,
  blade,
  ratchet,
  bit,
  type,
  visibility,
  attack,
  defense,
  stamina,
  weight,
  speed,
  ownerName,
  isOwner = false,
  delay = 0,
}: BuildCardProps) {
  return (
    <AnimatedCard delay={delay}>
      <GlassCard strong className="bey-card h-full p-8 md:p-10">
        <div className="flex h-full flex-col">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-extrabold text-white">{name}</h3>
              {ownerName ? (
                <p className="mt-1 text-sm text-slate-400">By {ownerName}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge value={type} />
              {visibility ? <StatusBadge value={visibility} /> : null}
              {isOwner ? (
                <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-200">
                  You
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <PartChip label="Blade" value={blade} />
            <PartChip label="Ratchet" value={ratchet} />
            <PartChip label="Bit" value={bit} />
          </div>

          <div className="mt-5">
            <BuildStats
              attack={attack}
              defense={defense}
              stamina={stamina}
              weight={weight}
              speed={speed}
            />
          </div>
        </div>
      </GlassCard>
    </AnimatedCard>
  );
}