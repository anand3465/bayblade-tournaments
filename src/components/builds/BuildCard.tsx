import AnimatedCard from "@/components/ui/AnimatedCard";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";
import BuildStats from "@/components/builds/BuildStats";
import PartChip from "@/components/builds/PartChip";
import StatBar from "../ui/StatBar";
import Animated3DCard from "../ui/Animated3DCard";

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
    <Animated3DCard className="p-6">
      {/* TOP CONTENT */}
      <div className="bey-3d-layer-2">
        <h3 className="text-xl font-extrabold text-white">{name}</h3>

        {ownerName && (
          <p className="mt-1 text-sm text-slate-400">By {ownerName}</p>
        )}
      </div>

      {/* BADGES */}
      <div className="mt-3 flex flex-wrap gap-2 bey-3d-layer-2">
        <StatusBadge value={type} />
        {visibility && <StatusBadge value={visibility} />}
      </div>

      {/* STATS */}
      <div className="mt-5 space-y-3 bey-3d-layer-1">
        <StatBar label="Attack" value={attack} />
        <StatBar label="Defense" value={defense} />
        <StatBar label="Stamina" value={stamina} />
      </div>
    </Animated3DCard>
  );
}