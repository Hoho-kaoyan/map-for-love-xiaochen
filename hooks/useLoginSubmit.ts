"use client";

import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { validateSitePassword } from "@/lib/client/auth";

export const PASSCODE_LENGTH = 4;

export const KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "clear",
  "0",
  "delete",
] as const;

export type LoginKey = (typeof KEYS)[number];
export type LoginStatus = "idle" | "checking" | "wrong" | "open";

type UseLoginSubmitArgs = {
  status: LoginStatus;
  setStatus: (next: LoginStatus) => void;
  setCode: Dispatch<SetStateAction<string>>;
};

/**
 * Encapsulates the 4-digit password submit + keypad interaction. Behavior is
 * intentionally identical to the original `EntryExperience.tsx:222-275`:
 * - Server-side `/api/auth/login` is tried first (Electron desktop path)
 * - 404 / 405 / network errors fall back to `validateSitePassword` (mobile /
 *   static export path)
 * - Success: `setStatus("open")`, push to `/map` after 720ms
 * - Failure: `setStatus("wrong")`, clear `code` and return to idle after 560ms
 */
export function useLoginSubmit({ status, setStatus, setCode }: UseLoginSubmitArgs) {
  const router = useRouter();

  const submitCode = async (nextCode: string) => {
    if (
      nextCode.length < PASSCODE_LENGTH ||
      status === "checking" ||
      status === "open"
    ) {
      return;
    }

    setStatus("checking");

    let ok = false;
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "site", password: nextCode }),
      });
      ok = response.ok;
      if (!ok && (response.status === 404 || response.status === 405)) {
        throw new Error("API not available");
      }
    } catch {
      ok = validateSitePassword(nextCode).ok;
    }

    if (ok) {
      setStatus("open");
      window.setTimeout(() => router.push("/map"), 720);
      return;
    }

    setStatus("wrong");
    window.setTimeout(() => {
      setCode("");
      setStatus("idle");
    }, 560);
  };

  const pressKey = (key: LoginKey) => {
    if (status === "checking" || status === "open") return;
    setCode((prev) => {
      if (key === "clear") return "";
      if (key === "delete") return prev.slice(0, -1);
      if (prev.length >= PASSCODE_LENGTH) return prev;
      const nextCode = prev + key;
      if (nextCode.length === PASSCODE_LENGTH) {
        void submitCode(nextCode);
      }
      return nextCode;
    });
  };

  return { submitCode, pressKey };
}