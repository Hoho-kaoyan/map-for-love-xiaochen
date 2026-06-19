"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const ONBOARDING_KEY = "mapofus:onboarded";

const STEPS = [
  {
    sprite: "/sprites/characters/couple-pointing.png",
    title: "点地图",
    body: "在地图上滑动，找你想去的城市",
  },
  {
    sprite: "/sprites/characters/couple-sitting.png",
    title: "点城市",
    body: "点开城市，添加日期、照片和一句话回忆",
  },
  {
    sprite: "/sprites/characters/couple-standing.png",
    title: "看时间线",
    body: "回到 Tab「回忆」，自动按城市和时间整理",
  },
  {
    sprite: "/sprites/characters/avatar-us.png",
    title: "改密码",
    body: "Tab「设置 → 密码」随时可改",
  },
  {
    sprite: "/sprites/characters/couple-pointing.png",
    title: "完成",
    body: "开始记录你们的故事吧 ✨",
  },
] as const;

export function OnboardingOverlay() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(ONBOARDING_KEY) !== "1") {
        setOpen(true);
      }
    } catch {
      // localStorage 不可用时默认显示引导
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // handleSkip 是稳定闭包，不需加入依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSkip = () => {
    try {
      window.localStorage.setItem(ONBOARDING_KEY, "1");
    } catch {
      // 写入失败也不影响关闭浮层
    }
    setOpen(false);
  };

  if (!mounted || !open) return null;

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  const content = (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleSkip();
        }}
      >
        <div className="relative w-[88vw] max-w-[420px] rounded-[16px] bg-[#FAFBF7] px-7 py-8 shadow-[0_18px_48px_rgba(90,102,112,0.18)]">
          <button
            type="button"
            aria-label="关闭"
            onClick={handleSkip}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-[#5A6670]/60 transition hover:bg-[#F5DCE0]/30"
          >
            ×
          </button>

          <Image
            src={current.sprite}
            width={140}
            height={140}
            unoptimized
            alt=""
            className="pixelated mx-auto pointer-events-none select-none"
          />

          <h2 className="mt-5 text-center text-[22px] font-semibold text-[#5A6670]">
            {current.title}
          </h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-[#5A6670]/64">
            {current.body}
          </p>

          <div className="mt-6 flex justify-center gap-2">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  i === step ? "bg-[#E8B8C2]" : "bg-[#D8DDD8]"
                }`}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            {!isLast ? (
              <button
                type="button"
                onClick={handleSkip}
                className="text-sm text-[#5A6670]/60 transition hover:text-[#5A6670]"
              >
                跳过
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="rounded-[8px] border border-[#D8DDD8] bg-[#FAFBF7] px-4 py-2 text-sm font-medium text-[#5A6670] transition hover:bg-[#F5DCE0]/30"
                >
                  上一步
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  isLast ? handleSkip() : setStep((s) => s + 1)
                }
                className="rounded-[8px] bg-[#E8B8C2] px-4 py-2 text-sm font-semibold text-[#FAFBF7] shadow-[0_6px_14px_rgba(232,184,194,0.32)] transition hover:bg-[#D6A6B0]"
              >
                {isLast ? "完成" : "下一步"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}