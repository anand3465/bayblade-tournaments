import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  strong?: boolean;
};

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