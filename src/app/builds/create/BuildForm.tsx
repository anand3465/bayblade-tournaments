"use client";

import { useMemo, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { createBuild } from "./actions";
import StatBar from "@/components/ui/StatBar";

type Blade = {
  id: string;
  name: string;
  createdAt: Date;
  description: string | null;
  category: string;
  spin: string;
  attack: number;
  defense: number;
  stamina: number;
  weight: number | null;
  height: number | null;
  width: number | null;
};

type Ratchet = {
  id: string;
  name: string;
  createdAt: Date;
  description: string | null;
  attack: number;
  defense: number;
  stamina: number;
  weight: number;
  speed: number;
};

type Bit = {
  id: string;
  name: string;
  createdAt: Date;
  description: string | null;
  attack: number;
  defense: number;
  stamina: number;
  weight: number;
  speed: number;
};

function getBuildType(stats: {
  attack: number;
  defense: number;
  stamina: number;
}) {
  const { attack, defense, stamina } = stats;

  const sorted = [attack, defense, stamina].sort((a, b) => b - a);

  if (sorted[0] - sorted[1] <= 2) return "Balance";
  if (attack >= defense && attack >= stamina) return "Attack";
  if (defense >= attack && defense >= stamina) return "Defense";
  return "Stamina";
}

function StatTile({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-extrabold text-white">{value}</p>
    </div>
  );
}

export default function BuildForm({
  blades,
  ratchets,
  bits,
}: {
  blades: Blade[];
  ratchets: Ratchet[];
  bits: Bit[];
}) {
  const [bladeId, setBladeId] = useState("");
  const [ratchetId, setRatchetId] = useState("");
  const [bitId, setBitId] = useState("");

  const selectedBlade = useMemo(
    () => blades.find((blade) => blade.id === bladeId) ?? null,
    [blades, bladeId]
  );

  const selectedRatchet = useMemo(
    () => ratchets.find((ratchet) => ratchet.id === ratchetId) ?? null,
    [ratchets, ratchetId]
  );

  const selectedBit = useMemo(
    () => bits.find((bit) => bit.id === bitId) ?? null,
    [bits, bitId]
  );

  const totals = useMemo(() => {
    const attack =
      (selectedBlade?.attack ?? 0) +
      (selectedRatchet?.attack ?? 0) +
      (selectedBit?.attack ?? 0);

    const defense =
      (selectedBlade?.defense ?? 0) +
      (selectedRatchet?.defense ?? 0) +
      (selectedBit?.defense ?? 0);

    const stamina =
      (selectedBlade?.stamina ?? 0) +
      (selectedRatchet?.stamina ?? 0) +
      (selectedBit?.stamina ?? 0);

    const weight =
      (selectedBlade?.weight ?? 0) +
      (selectedRatchet?.weight ?? 0) +
      (selectedBit?.weight ?? 0);

    const speed =
      (selectedRatchet?.speed ?? 0) +
      (selectedBit?.speed ?? 0);

    const type =
      selectedBlade && selectedRatchet && selectedBit
        ? getBuildType({ attack, defense, stamina })
        : "—";

    return { attack, defense, stamina, weight, speed, type };
  }, [selectedBlade, selectedRatchet, selectedBit]);

  return (
    <form
      action={createBuild}
      className="grid gap-6 lg:grid-cols-[1fr_0.9fr]"
    >
      <GlassCard strong className="space-y-5 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">Title</label>
          <input
            name="title"
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
            placeholder="Phoenix Wing Rush"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">Blade</label>
          <select
            name="bladeId"
            value={bladeId}
            onChange={(e) => setBladeId(e.target.value)}
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
          >
            <option value="">Select Blade</option>
            {blades.map((blade) => (
              <option key={blade.id} value={blade.id}>
                {blade.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">Ratchet</label>
          <select
            name="ratchetId"
            value={ratchetId}
            onChange={(e) => setRatchetId(e.target.value)}
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
          >
            <option value="">Select Ratchet</option>
            {ratchets.map((ratchet) => (
              <option key={ratchet.id} value={ratchet.id}>
                {ratchet.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">Bit</label>
          <select
            name="bitId"
            value={bitId}
            onChange={(e) => setBitId(e.target.value)}
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
          >
            <option value="">Select Bit</option>
            {bits.map((bit) => (
              <option key={bit.id} value={bit.id}>
                {bit.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
            placeholder="Why this combo works..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Visibility
          </label>
          <select
            name="visibility"
            defaultValue="PUBLIC"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-5 py-3 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5"
        >
          Create Build
        </button>
      </GlassCard>

      <GlassCard strong className="space-y-5 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300/80">
              Live Build Stats
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-white">
              Combo Preview
            </h2>
          </div>

          <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-200">
            Type: {totals.type}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <StatBar label="Attack" value={totals.attack} max={150} color="attack" />
          <StatBar label="Defense" value={totals.defense} max={150} color="defense" />
          <StatBar label="Stamina" value={totals.stamina} max={150} color="stamina" />

          <StatBar label="Weight" value={totals.weight} max={60} />
          <StatBar label="Speed" value={totals.speed} max={60} />
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Blade</p>
            <p className="mt-1 font-semibold text-white">
              {selectedBlade?.name ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ratchet</p>
            <p className="mt-1 font-semibold text-white">
              {selectedRatchet?.name ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Bit</p>
            <p className="mt-1 font-semibold text-white">
              {selectedBit?.name ?? "—"}
            </p>
          </div>
        </div>
      </GlassCard>
    </form>
  );
}