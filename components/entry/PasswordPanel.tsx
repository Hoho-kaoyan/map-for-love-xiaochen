"use client";

import { motion } from "framer-motion";
import { ArrowRight, Delete, KeyRound, LockKeyhole, Heart } from "lucide-react";
import {
  KEYS,
  PASSCODE_LENGTH,
  type LoginKey,
  type LoginStatus,
} from "@/hooks/useLoginSubmit";

function KeyLabel({ value }: Readonly<{ value: LoginKey }>) {
  if (value === "delete") return <Delete className="h-4 w-4" />;
  if (value === "clear") return <span className="text-xs font-semibold">清空</span>;
  return <span>{value}</span>;
}

type PasswordPanelProps = {
  code: string;
  status: LoginStatus;
  pressKey: (key: LoginKey) => void;
};

/**
 * Controlled 4-digit password keypad. `code`, `status`, and `pressKey` are
 * owned by the parent (mobile or desktop entry experience) so the same state
 * can drive the brand badge in the header and the desktop "opening map"
 * overlay in addition to the keypad's own status text and CTA.
 *
 * Visuals are lifted verbatim from the original `EntryExperience.tsx:293-374`.
 */
export function PasswordPanel({ code, status, pressKey }: PasswordPanelProps) {
  const ctaLabel =
    status === "checking"
      ? "正在核对"
      : status === "open"
        ? "解锁中"
        : "解锁地图";

  return (
    <motion.section
      className="relative z-30 mx-auto w-full max-w-md px-5 pt-6 pb-32 sm:px-8 sm:pt-10 lg:ml-[6%] lg:mr-auto lg:max-w-[460px] lg:px-0 lg:pt-12 lg:pb-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.58, delay: 0.04 }}
    >
      <motion.div
        animate={status === "wrong" ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.34 }}
        className="rounded-[10px] border border-[#D8DDD8]/72 bg-[#FEFCF5]/78 p-4 shadow-[0_22px_56px_rgba(91,71,50,0.08)] backdrop-blur sm:p-6"
        style={
          status === "wrong"
            ? { boxShadow: "0 0 0 4px rgba(232, 132, 90, 0.25)" }
            : undefined
        }
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#5A6670]/72">
            <KeyRound className="h-4 w-4 text-[#E8B8C2]" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              anniversary code
            </span>
          </div>
          <span className="text-xs font-semibold text-[#5A6670]/58">
            {status === "wrong"
              ? "密码没对上，再试一次"
              : status === "checking"
                ? "核对中…"
                : status === "open"
                  ? "正在打开"
                  : "输入 4 位纪念日"}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          {Array.from({ length: PASSCODE_LENGTH }).map((_, index) => {
            const isFilled = code.length > index;
            return (
              <motion.div
                key={index}
                initial={false}
                animate={{ scale: isFilled ? [1, 1.25, 1] : 1 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className={`h-4 w-4 rounded-full transition-all sm:h-[18px] sm:w-[18px] ${
                  isFilled
                    ? "bg-[#E8B8C2] ring-2 ring-[#E8B8C2] ring-offset-2 ring-offset-[#FEFCF5]"
                    : "border border-[#D8DDD8] bg-[#FAFBF7]"
                }`}
              />
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => pressKey(key)}
              disabled={status === "checking" || status === "open"}
              className="login-key flex h-12 items-center justify-center rounded-[8px] border border-[#D8DDD8]/72 bg-[#FAFBF7]/82 text-base font-semibold text-[#5A6670] shadow-[0_4px_10px_rgba(90,102,112,0.05)] transition active:scale-[0.97] disabled:opacity-60 sm:h-14 sm:text-lg"
            >
              <KeyLabel value={key} />
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={
            code.length < PASSCODE_LENGTH ||
            status === "checking" ||
            status === "open"
          }
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#E8B8C2] px-5 py-3 text-sm font-semibold text-[#FAFBF7] shadow-[0_8px_18px_rgba(232,184,194,0.34)] transition hover:bg-[#D6A6B0] disabled:cursor-not-allowed disabled:bg-[#D8DDD8] disabled:text-[#5A6670]/60 disabled:shadow-none sm:text-base"
          onClick={() => pressKey("clear")}
        >
          <LockKeyhole className="h-4 w-4" />
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-3 text-center text-[11px] font-medium text-[#5A6670]/46">
          <Heart className="mr-1 inline-block h-3 w-3 fill-[#F5DCE0] text-[#E8B8C2]" />
          提示：密码就是你们的纪念日（4 位数字）
        </p>
      </motion.div>
    </motion.section>
  );
}