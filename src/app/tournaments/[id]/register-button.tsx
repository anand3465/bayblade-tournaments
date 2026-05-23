"use client";

/**
 * Interactive form component for collecting user input and submitting the related workflow.
 */

import { useFormStatus } from "react-dom";

/**
 * Renders the tournament action button UI component.
 */
export default function TournamentActionButton({
  disabled,
  pendingText,
  idleText,
  variant = "primary",
  confirmMessage,
}: {
  disabled: boolean;
  pendingText: string;
  idleText: string;
  variant?: "primary" | "danger";
  confirmMessage?: string;
}) {
  const { pending } = useFormStatus();

  const styles =
    variant === "danger"
      ? "rounded-xl bg-red-600 px-4 py-2 font-medium hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      : "rounded-xl bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={styles}
      onClick={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {pending ? pendingText : idleText}
    </button>
  );
}
