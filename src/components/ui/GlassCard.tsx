/**
 * Reusable presentation component used to keep shared UI styling consistent across the app.
 */
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  strong?: boolean;
};

/**
 * Renders the glass card UI component.
 */
export default function GlassCard({
  children,
  className = "",
  strong = false,
}: GlassCardProps) {
  return (
    <div className={`${strong ? "glass-panel-strong" : "glass-panel"} ${className}`}>
      {children}
    </div>
  );
}
