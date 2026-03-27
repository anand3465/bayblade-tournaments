import StatBar from "@/components/ui/StatBar";

type BuildStatsProps = {
  attack: number;
  defense: number;
  stamina: number;
  weight?: number;
  speed?: number;
};

export default function BuildStats({
  attack,
  defense,
  stamina,
  weight,
  speed,
}: BuildStatsProps) {
  return (

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-2">
            <StatBar label="Attack" value={attack} max={150} color="attack" />
            <StatBar label="Defense" value={defense} max={150} color="defense" />
            <StatBar label="Stamina" value={stamina} max={150} color="stamina" />

            {typeof weight === "number" ? (
            <StatBar label="Weight" value={weight} max={20} />
            ) : null}

            {typeof speed === "number" ? (
            <StatBar label="Speed" value={speed} max={20} />
            ) : null}
        </div>
    );
}