"use client";

import type { ReactNode } from "react";
import { MemoryPageShell } from "@/components/MemoryNav";
import type { MemoryNavKey } from "@/components/MemoryNav";

type MemoryToolShellProps = {
  active: MemoryNavKey;
  children: ReactNode;
};

/**
 * Thin layout wrapper for the `MemoryToolPage`-style pages. Just wraps the
 * page in `MemoryPageShell` (sidebar + mobile bottom nav) so the body
 * content (title row, list, form, hero card, ...) can be composed freely
 * by the caller. Extracted from the original `MemoryToolPage.tsx:91` to
 * let `AnniversaryPage` render its hero card alongside the list without
 * nesting two `MemoryPageShell`s.
 */
export function MemoryToolShell({ active, children }: MemoryToolShellProps) {
  return <MemoryPageShell active={active}>{children}</MemoryPageShell>;
}