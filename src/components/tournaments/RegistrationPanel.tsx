"use client";

/**
 * Tournament presentation component for event discovery, detail, and registration flows.
 */

import { useState, useTransition } from "react";
import BeyButton from "@/components/ui/BeyButton";
import GlassCard from "@/components/ui/GlassCard";

type RegistrationPanelProps = {
  isRegistered: boolean;
  isFull: boolean;
  isClosed?: boolean;
  isSignedIn: boolean;
  onRegister?: () => Promise<void> | void;
  onDrop?: () => Promise<void> | void;
};

/**
 * Renders the registration panel UI component.
 */
export default function RegistrationPanel({
  isRegistered,
  isFull,
  isClosed = false,
  isSignedIn,
  onRegister,
  onDrop,
}: RegistrationPanelProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleRegister = () => {
    if (!onRegister) return;
    startTransition(async () => {
      await onRegister();
    });
  };

  const handleDrop = () => {
    if (!onDrop) return;
    startTransition(async () => {
      await onDrop();
      setShowConfirm(false);
    });
  };

  return (
    <GlassCard strong className="p-6">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300/80">
        Registration
      </p>

      <h3 className="mt-3 text-2xl font-extrabold text-white">
        {isRegistered
          ? "You are registered"
          : isClosed
          ? "Registration closed"
          : "Join this tournament"}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {isRegistered
          ? isClosed
            ? "This tournament has started, so registrations can no longer be changed."
            : "You can drop from this tournament if your plans changed."
          : isClosed
          ? "Sign-ups closed when this tournament started."
          : isFull
          ? "This tournament is currently full."
          : "Secure your place in the bracket and get ready to battle."}
      </p>

      <div className="mt-5">
        {isClosed && !isRegistered ? (
          <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200">
            Registration Closed
          </span>
        ) : !isSignedIn ? (
          <BeyButton href="/sign-in">Sign In to Register</BeyButton>
        ) : isRegistered ? (
          isClosed ? (
            <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200">
              Registration Locked
            </span>
          ) : (
          <>
            {!showConfirm ? (
              <BeyButton
                variant="danger"
                onClick={() => setShowConfirm(true)}
                disabled={isPending}
              >
                Drop Tournament
              </BeyButton>
            ) : (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
                <p className="text-sm font-semibold text-white">
                  Are you sure you want to drop this tournament?
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Your registration spot will be removed.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <BeyButton
                    variant="danger"
                    onClick={handleDrop}
                    disabled={isPending}
                  >
                    {isPending ? "Dropping..." : "Yes, Drop"}
                  </BeyButton>

                  <BeyButton
                    variant="ghost"
                    onClick={() => setShowConfirm(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </BeyButton>
                </div>
              </div>
            )}
          </>
          )
        ) : (
          <BeyButton
            onClick={handleRegister}
            disabled={isPending || isFull}
          >
            {isPending ? "Registering..." : isFull ? "Tournament Full" : "Register Now"}
          </BeyButton>
        )}
      </div>
    </GlassCard>
  );
}
