/**
 * Reusable presentation component used to keep shared UI styling consistent across the app.
 */
import type { ReactNode } from "react";

/**
 * Renders the page shell UI component.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="page-shell">
      <div className="page-container">{children}</div>
    </main>
  );
}
