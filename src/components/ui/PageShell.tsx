import type { ReactNode } from "react";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="page-shell">
      <div className="page-container">{children}</div>
    </main>
  );
}