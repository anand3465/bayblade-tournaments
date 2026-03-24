"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Blade, Ratchet, Bit } from "@prisma/client";
import { createBuild } from "./actions";

function getBuildType(stats: {
  attack: number;
  defense: number;
  stamina: number;
}) {
  const { attack, defense, stamina } = stats;

  if (attack >= defense && attack >= stamina) return "Attack";
  if (defense >= attack && defense >= stamina) return "Defense";
  return "Stamina";
}

function getTypeStyles(type: string) {
  switch (type) {
    case "Attack":
      return "from-red-500/20 to-orange-500/20 text-red-300 border-red-500/30";
    case "Defense":
      return "from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30";
    case "Stamina":
      return "from-yellow-400/20 to-lime-400/20 text-yellow-300 border-yellow-400/30";
    default:
      return "from-zinc-500/10 to-zinc-400/10 text-zinc-300 border-zinc-700";
  }
}

function StatBar({
  label,
  value,
  max = 150,
  glowClass,
}: {
  label: string;
  value: number;
  max?: number;
  glowClass: string;
}) {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-300">{label}</span>
        <span className="font-semibold text-white">{value}</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`h-full rounded-full ${glowClass}`}
        />
      </div>
    </div>
  );
}

function PartPreviewCard({
  title,
  name,
  subtitle,
}: {
  title: string;
  name: string;
  subtitle?: string | null;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-[0_0_20px_rgba(255,255,255,0.03)]"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{title}</p>
      <p className="mt-2 text-lg font-semibold text-white">{name || "—"}</p>
      {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
    </motion.div>
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

    const speed = selectedBit?.speed ?? 0;

    const type =
      selectedBlade && selectedRatchet && selectedBit
        ? getBuildType({ attack, defense, stamina })
        : "—";

    return { attack, defense, stamina, weight, speed, type };
  }, [selectedBlade, selectedRatchet, selectedBit]);

  const typeStyles = getTypeStyles(totals.type);

  return (
    <motion.form
      action={createBuild}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-8 overflow-hidden rounded-[28px] border border-zinc-800 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_30%),linear-gradient(to_bottom,rgba(24,24,27,0.96),rgba(9,9,11,0.98))] p-6 shadow-[0_0_40px_rgba(59,130,246,0.08)]"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Beyblade Builder
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Assemble your combo
          </h2>
        </div>

        <motion.div
          layout
          className={`rounded-full border bg-gradient-to-r px-4 py-2 text-sm font-semibold ${typeStyles}`}
        >
          Type: {totals.type}
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Build Title
            </label>
            <input
              name="title"
              required
              placeholder="Phoenix Wing Rush Combo"
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/90 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
            />
          </div>

          <div className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">
                Blade
              </label>
              <select
                name="bladeId"
                value={bladeId}
                onChange={(e) => setBladeId(e.target.value)}
                required
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/90 px-4 py-3 text-white outline-none transition focus:border-red-400"
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
              <label className="mb-2 block text-sm font-medium text-zinc-200">
                Ratchet
              </label>
              <select
                name="ratchetId"
                value={ratchetId}
                onChange={(e) => setRatchetId(e.target.value)}
                required
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/90 px-4 py-3 text-white outline-none transition focus:border-blue-400"
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
              <label className="mb-2 block text-sm font-medium text-zinc-200">
                Bit
              </label>
              <select
                name="bitId"
                value={bitId}
                onChange={(e) => setBitId(e.target.value)}
                required
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/90 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
              >
                <option value="">Select Bit</option>
                {bits.map((bit) => (
                  <option key={bit.id} value={bit.id}>
                    {bit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Fast opening hits, solid stamina, and good pressure in the pocket."
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/90 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Visibility
            </label>
            <select
              name="visibility"
              defaultValue="PUBLIC"
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/90 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
        </div>

        <div className="space-y-5">
          <AnimatePresence mode="popLayout">
            <div className="grid gap-3">
              <PartPreviewCard
                title="Blade"
                name={selectedBlade?.name ?? "Not selected"}
                subtitle={selectedBlade?.description ?? null}
              />
              <PartPreviewCard
                title="Ratchet"
                name={selectedRatchet?.name ?? "Not selected"}
                subtitle={selectedRatchet?.description ?? null}
              />
              <PartPreviewCard
                title="Bit"
                name={selectedBit?.name ?? "Not selected"}
                subtitle={selectedBit?.description ?? null}
              />
            </div>
          </AnimatePresence>

          <motion.div
            layout
            className="rounded-[24px] border border-zinc-800 bg-zinc-950/80 p-5 shadow-[0_0_30px_rgba(59,130,246,0.06)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Live Stats
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Performance Profile
                </h3>
              </div>

              <div className="text-right">
                <p className="text-xs text-zinc-500">Speed</p>
                <p className="text-lg font-semibold text-white">{totals.speed}</p>
              </div>
            </div>

            <div className="space-y-4">
              <StatBar
                label="Attack"
                value={totals.attack}
                glowClass="bg-gradient-to-r from-red-500 to-orange-400 shadow-[0_0_14px_rgba(239,68,68,0.45)]"
              />
              <StatBar
                label="Defense"
                value={totals.defense}
                glowClass="bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_14px_rgba(59,130,246,0.45)]"
              />
              <StatBar
                label="Stamina"
                value={totals.stamina}
                glowClass="bg-gradient-to-r from-yellow-400 to-lime-400 shadow-[0_0_14px_rgba(250,204,21,0.45)]"
              />
              <StatBar
                label="Weight"
                value={totals.weight}
                glowClass="bg-gradient-to-r from-fuchsia-500 to-violet-400 shadow-[0_0_14px_rgba(168,85,247,0.45)]"
              />
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.985 }}
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.35)] transition"
          >
            Create Build
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
}