"use client";

/**
 * Interactive form component for collecting user input and submitting the related workflow.
 */

import GlassCard from "@/components/ui/GlassCard";
import type { PartType } from "./actions";
import {
  createBlade,
  createBit,
  createRatchet,
  updateBlade,
  updateBit,
  updateRatchet,
} from "./actions";

type BladeValues = {
  name: string;
  category: string;
  spin: string;
  attack: number;
  defense: number;
  stamina: number;
  weight: number | null;
  height: number | null;
  width: number | null;
  description: string | null;
};

type RatchetOrBitValues = {
  name: string;
  attack: number;
  defense: number;
  stamina: number;
  weight: number;
  speed: number;
  description: string | null;
};

type PartFormProps =
  | {
      partType: "blade";
      mode: "create" | "edit";
      partId?: string;
      defaultValues?: Partial<BladeValues>;
    }
  | {
      partType: "ratchet" | "bit";
      mode: "create" | "edit";
      partId?: string;
      defaultValues?: Partial<RatchetOrBitValues>;
    };

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-400/50";

const labelClass = "mb-2 block text-sm font-medium text-white";

/**
 * Renders the part form UI component.
 */
export default function PartForm(props: PartFormProps) {
  const { partType, mode, partId } = props;
  const defaults = props.defaultValues ?? {};

  const action =
    partType === "blade"
      ? mode === "create"
        ? createBlade
        : updateBlade
      : partType === "ratchet"
        ? mode === "create"
          ? createRatchet
          : updateRatchet
        : mode === "create"
          ? createBit
          : updateBit;

  const title =
    mode === "create"
      ? `Add ${partType.charAt(0).toUpperCase() + partType.slice(1)}`
      : `Edit ${partType.charAt(0).toUpperCase() + partType.slice(1)}`;

  return (
    <GlassCard strong className="mt-6 p-6">
      <h2 className="text-2xl font-extrabold text-white">{title}</h2>

      <form action={action} className="mt-6 space-y-5">
        {mode === "edit" && partId ? (
          <input type="hidden" name="id" value={partId} />
        ) : null}

        <div>
          <label className={labelClass}>Name</label>
          <input
            name="name"
            required
            defaultValue={defaults.name ?? ""}
            className={inputClass}
            placeholder="Part name"
          />
        </div>

        {partType === "blade" ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Category</label>
                <input
                  name="category"
                  required
                  defaultValue={
                    (defaults as Partial<BladeValues>).category ?? ""
                  }
                  className={inputClass}
                  placeholder="ATTACK, DEFENSE, BALANCE..."
                />
              </div>
              <div>
                <label className={labelClass}>Spin</label>
                <input
                  name="spin"
                  required
                  defaultValue={(defaults as Partial<BladeValues>).spin ?? ""}
                  className={inputClass}
                  placeholder="R or L"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Attack</label>
                <input
                  name="attack"
                  type="number"
                  required
                  defaultValue={
                    (defaults as Partial<BladeValues>).attack ?? ""
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Defense</label>
                <input
                  name="defense"
                  type="number"
                  required
                  defaultValue={
                    (defaults as Partial<BladeValues>).defense ?? ""
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Stamina</label>
                <input
                  name="stamina"
                  type="number"
                  required
                  defaultValue={
                    (defaults as Partial<BladeValues>).stamina ?? ""
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Weight (optional)</label>
                <input
                  name="weight"
                  type="number"
                  step="any"
                  defaultValue={
                    (defaults as Partial<BladeValues>).weight ?? ""
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Height (optional)</label>
                <input
                  name="height"
                  type="number"
                  step="any"
                  defaultValue={
                    (defaults as Partial<BladeValues>).height ?? ""
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Width (optional)</label>
                <input
                  name="width"
                  type="number"
                  step="any"
                  defaultValue={
                    (defaults as Partial<BladeValues>).width ?? ""
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label className={labelClass}>Attack</label>
              <input
                name="attack"
                type="number"
                required
                defaultValue={
                  (defaults as Partial<RatchetOrBitValues>).attack ?? ""
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Defense</label>
              <input
                name="defense"
                type="number"
                required
                defaultValue={
                  (defaults as Partial<RatchetOrBitValues>).defense ?? ""
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Stamina</label>
              <input
                name="stamina"
                type="number"
                required
                defaultValue={
                  (defaults as Partial<RatchetOrBitValues>).stamina ?? ""
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Weight</label>
              <input
                name="weight"
                type="number"
                required
                defaultValue={
                  (defaults as Partial<RatchetOrBitValues>).weight ?? ""
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Speed</label>
              <input
                name="speed"
                type="number"
                required
                defaultValue={
                  (defaults as Partial<RatchetOrBitValues>).speed ?? ""
                }
                className={inputClass}
              />
            </div>
          </div>
        )}

        <div>
          <label className={labelClass}>Description (optional)</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={defaults.description ?? ""}
            className={inputClass}
            placeholder="Notes about this part..."
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 px-4 py-3 font-extrabold text-white transition hover:opacity-90"
        >
          {mode === "create" ? "Create part" : "Save changes"}
        </button>
      </form>
    </GlassCard>
  );
}
