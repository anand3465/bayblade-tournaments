"use client";

/**
 * Interactive form component for collecting user input and submitting the related workflow.
 */

import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { submitEmployeeApplication } from "./actions";
import type { TournamentEntryInput } from "./actions";

export type InitialEntry = TournamentEntryInput & { id?: string };

const roleOptions = [
  { value: "PARTICIPANT", label: "Participant" },
  { value: "VOLUNTEER", label: "Volunteer" },
  { value: "ORGANIZER", label: "Organizer" },
  { value: "OTHER", label: "Other" },
] as const;

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-sky-400/50";

/**
 * Creates a blank tournament experience entry for the employee application form.
 */
function emptyEntry(): InitialEntry {
  return {
    tournamentName: "",
    eventDate: "",
    location: "",
    roleAtEvent: "PARTICIPANT",
    placementOrResult: "",
    organizerOrVenue: "",
    notes: "",
    isPlatformEvent: false,
  };
}

/**
 * Formats a saved date value for an HTML date input.
 */
function toDateInputValue(isoOrDate: string) {
  if (!isoOrDate) return "";
  const d = new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Renders the application form UI component.
 */
export default function ApplicationForm({
  initialEntries,
}: {
  initialEntries: InitialEntry[];
}) {
  const [entries, setEntries] = useState<InitialEntry[]>(
    initialEntries.length > 0 ? initialEntries : [emptyEntry()]
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateEntry(index: number, patch: Partial<InitialEntry>) {
    setEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...patch } : e))
    );
  }

  function addEntry() {
    setEntries((prev) => [...prev, emptyEntry()]);
  }

  function removeEntry(index: number) {
    setEntries((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("tournamentEntries", JSON.stringify(entries));

    try {
      await submitEmployeeApplication(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <GlassCard strong className="p-6 space-y-5">
        <h2 className="text-xl font-extrabold text-white">Cover letter</h2>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Why do you want to be staff? *
          </label>
          <textarea
            name="message"
            required
            minLength={20}
            rows={5}
            className={inputClass}
            placeholder="Tell us why you'd be a great fit..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Relevant experience (optional)
          </label>
          <textarea
            name="experience"
            rows={3}
            className={inputClass}
            placeholder="Volunteer work, organizing events, etc."
          />
        </div>
      </GlassCard>

      <GlassCard strong className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-white">Tournament history *</h2>
          <button
            type="button"
            onClick={addEntry}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-sky-400/10"
          >
            + Add tournament
          </button>
        </div>
        <p className="text-sm text-slate-400">
          List events you attended. In-app registrations are pre-filled; add others manually.
        </p>

        {entries.map((entry, index) => (
          <div
            key={index}
            className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-sky-300">
                Tournament {index + 1}
                {entry.isPlatformEvent ? (
                  <span className="ml-2 text-xs text-slate-400">(platform)</span>
                ) : null}
              </span>
              {entries.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeEntry(index)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              ) : null}
            </div>

            <input
              type="hidden"
              value={entry.registrationId || ""}
              readOnly
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-slate-400">Tournament name *</label>
                <input
                  required
                  value={entry.tournamentName}
                  onChange={(e) => updateEntry(index, { tournamentName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">Event date *</label>
                <input
                  type="date"
                  required
                  value={toDateInputValue(entry.eventDate)}
                  onChange={(e) => updateEntry(index, { eventDate: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">Your role *</label>
                <select
                  required
                  value={entry.roleAtEvent}
                  onChange={(e) =>
                    updateEntry(index, {
                      roleAtEvent: e.target.value as InitialEntry["roleAtEvent"],
                    })
                  }
                  className={inputClass}
                >
                  {roleOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">Location</label>
                <input
                  value={entry.location || ""}
                  onChange={(e) => updateEntry(index, { location: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">Placement / result</label>
                <input
                  value={entry.placementOrResult || ""}
                  onChange={(e) =>
                    updateEntry(index, { placementOrResult: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Top 8, 4-1, etc."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">Organizer / venue</label>
                <input
                  value={entry.organizerOrVenue || ""}
                  onChange={(e) =>
                    updateEntry(index, { organizerOrVenue: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-slate-400">Notes</label>
                <textarea
                  rows={2}
                  value={entry.notes || ""}
                  onChange={(e) => updateEntry(index, { notes: e.target.value })}
                  className={inputClass}
                  placeholder="Conduct, reliability, contributions..."
                />
              </div>
            </div>
          </div>
        ))}
      </GlassCard>

      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 px-4 py-3 font-extrabold text-white disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
