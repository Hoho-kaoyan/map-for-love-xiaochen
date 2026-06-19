"use client";

import type { MotionValue } from "framer-motion";
import type { PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import { LocalPrivacyBadge } from "@/components/LocalPrivacyImage";

type LoginStageShellProps = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  driftX: MotionValue<number>;
  reverseX: MotionValue<number>;
  children: React.ReactNode;
};

/**
 * The fixed full-screen login backdrop shared by mobile and desktop entry
 * experiences. Owns the `pointermove` listener (so we never double-bind) and
 * renders the parallax background layers (sun, clouds, paper, grid, badge).
 *
 * The two breakpoint-specific children are mounted inside via `children`, both
 * hidden by Tailwind `lg:` classes — only one is visible at a time.
 */
export function LoginStageShell({
  pointerX,
  pointerY,
  driftX,
  reverseX,
  children,
}: LoginStageShellProps) {
  return (
    <main
      className="login-stage relative h-[100dvh] overflow-hidden bg-[#FAFBF7] text-[#5A6670] selection:bg-[#F5DCE0] selection:text-[#5A6670]"
      onPointerMove={(event: ReactPointerEvent<HTMLElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
        pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
    >
      <LocalPrivacyBadge />
      <div className="login-paper absolute inset-0" />
      <motion.div className="login-sun" style={{ x: reverseX }} />
      <motion.div className="login-cloud login-cloud-a" style={{ x: driftX }} />
      <motion.div className="login-cloud login-cloud-b" style={{ x: reverseX }} />
      <div className="login-grid absolute inset-0" />
      {children}
    </main>
  );
}