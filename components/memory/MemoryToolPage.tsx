import type { ToolConfig } from "./Shared";
import { MemoryToolShell } from "./MemoryToolShell";
import { MemoryToolList } from "./MemoryToolList";

/**
 * Thin back-compat wrapper for the four `kind` pages (favorites, anniversaries,
 * time-capsule, trips) that still render `<MemoryToolPage />`. Renders the
 * shared shell + the shared list body. Kept as `default export` so existing
 * consumers (`app/favorites/page.tsx`, `app/trips/page.tsx`,
 * `app/landmarks/page.tsx`, `app/time-capsule/page.tsx`) keep working without
 * any change.
 *
 * The new `/anniversaries` page no longer goes through this wrapper — see
 * `components/memory/AnniversaryPage.tsx` for the hero-card composition.
 */
export default function MemoryToolPage({
  config,
}: Readonly<{ config: ToolConfig }>) {
  return (
    <MemoryToolShell active={config.active}>
      <MemoryToolList config={config} />
    </MemoryToolShell>
  );
}