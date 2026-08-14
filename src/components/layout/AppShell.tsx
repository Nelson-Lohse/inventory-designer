import type { ReactNode } from 'react';

interface Props {
  sidebar: ReactNode;
  children: ReactNode;
}

/**
 * Sidebar stacks below the canvas on narrow viewports via CSS (see
 * index.css) rather than a real drawer/bottom-sheet interaction — that's a
 * known simplification for this MVP pass, not the final tablet UX. See
 * ARCHITECTURE.md section 4.
 */
export default function AppShell({ sidebar, children }: Props) {
  return (
    <div className="app-shell">
      <main className="app-shell-main">{children}</main>
      <aside className="app-shell-sidebar">{sidebar}</aside>
    </div>
  );
}
