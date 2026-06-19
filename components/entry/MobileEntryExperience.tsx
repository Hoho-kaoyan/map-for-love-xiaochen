"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Heart,
  LockKeyhole,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { LocalPrivacyImage } from "@/components/LocalPrivacyImage";
import { useLoginSubmit, type LoginStatus } from "@/hooks/useLoginSubmit";
import type { Stamp } from "@/hooks/useEntryExperienceState";
import type { AppSettings } from "@/data/appSettings";
import { daysTogether } from "@/lib/dateUtils";
import { PixelHeart } from "./PixelHeart";
import { PasswordPanel } from "./PasswordPanel";

type MobileEntryExperienceProps = {
  settings: AppSettings;
  activeId: string;
  setActiveId: (next: string) => void;
  activeStamp: Stamp;
  loginStamps: Stamp[];
  setPreviewStamp: (stamp: Stamp | null) => void;
};

/**
 * Mobile (< 1024px) login layout. Stacks top-to-bottom:
 *   1. Brand row (PixelHeart + Map for Love + status pill)
 *   2. Hero copy + `avatar-us.png` portrait
 *   3. Anniversary "together for N days" pill (uses `appSettings.anniversaryDate`)
 *   4. Shared PasswordPanel
 *   5. Horizontal-scroll stamp strip (mini stamp picker)
 *   6. Draggable floating photo card with collapse / expand
 */
export function MobileEntryExperience({
  settings,
  activeId,
  setActiveId,
  activeStamp,
  loginStamps,
  setPreviewStamp,
}: MobileEntryExperienceProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [collapsed, setCollapsed] = useState(false);
  const { pressKey } = useLoginSubmit({ status, setStatus, setCode });

  const together = daysTogether(settings.anniversaryDate);
  const anniversaryLabel =
    settings.anniversaryLabel ?? settings.loginPhotoTexts?.["hangzhou"]?.label;

  return (
    <section className="relative z-10 flex h-full min-h-0 flex-col lg:hidden">
      {/* 1. Brand row */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-6 sm:px-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <PixelHeart />
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-[#5A6670]">
              我们的时光地图
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#5A6670]/46">
              private map
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D8DDD8]/72 bg-[#FEFCF5]/78 px-3 py-2 text-xs font-semibold text-[#5A6670]/72 shadow-[0_10px_24px_rgba(90,102,112,0.06)] backdrop-blur">
          {status === "open" ? (
            <Heart className="h-4 w-4 fill-[#F5DCE0] text-[#E8B8C2]" />
          ) : (
            <LockKeyhole className="h-4 w-4 text-[#E8B8C2]" />
          )}
          <span>{status === "open" ? "已解锁" : "私密地图"}</span>
        </div>
      </div>

      {/* 2. Hero copy + portrait */}
      <div className="relative z-10 mt-3 flex items-end justify-between gap-3 px-5 sm:mt-5 sm:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-[clamp(32px,9vw,46px)] font-semibold leading-[1.02] text-[#5A6670]">
            输入
            <span className="block text-[#E8B8C2]">纪念日</span>
          </h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-[#5A6670]/62">
            一扇只给我们的地图门，
            <br className="sm:hidden" />
            用那 4 位数字轻轻推开。
          </p>
        </div>
        <img
          src="/sprites/characters/avatar-us.png"
          alt=""
          width={88}
          height={88}
          className="pixelated pointer-events-none select-none drop-shadow-[0_8px_18px_rgba(91,71,50,0.16)]"
        />
      </div>

      {/* 3. Anniversary pill */}
      <div className="relative z-10 mx-auto mt-4 w-full max-w-md px-5 sm:px-8">
        {together ? (
          <div className="flex items-center gap-2 rounded-[8px] border border-[#F5DCE0]/78 bg-[#FEFCF5]/82 px-3 py-2 shadow-[0_10px_24px_rgba(90,102,112,0.05)] backdrop-blur">
            <Heart className="h-4 w-4 shrink-0 fill-[#F5DCE0] text-[#E8B8C2]" />
            <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[#5A6670]">
              {anniversaryLabel ?? "我们在一起"}
              <span className="ml-2 text-[#E8B8C2]">{together.days} 天</span>
            </p>
            <p className="shrink-0 text-[11px] font-medium text-[#5A6670]/46">
              {settings.anniversaryDate}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-[8px] border border-dashed border-[#D8DDD8]/72 bg-[#FAFBF7]/62 px-3 py-2 text-[12px] font-medium text-[#5A6670]/52">
            <Heart className="h-3.5 w-3.5 fill-[#F5DCE0] text-[#E8B8C2]" />
            在「设置 → 纪念日」填一个日期，这里会显示在一起的天数
          </div>
        )}
      </div>

      {/* 4. Password keypad */}
      <PasswordPanel code={code} status={status} pressKey={pressKey} />

      {/* 5. Horizontal-scroll stamp strip */}
      <div className="relative z-10 mx-auto mt-3 w-full max-w-md px-5 pb-4 sm:px-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5A6670]/46">
          城市印戳
        </p>
        <div
          className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
          role="tablist"
        >
          {loginStamps.map((stamp) => {
            const isActive = stamp.id === activeId;
            return (
              <button
                key={stamp.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(stamp.id)}
                className={`flex shrink-0 snap-start flex-col items-center gap-1 rounded-[6px] border px-1.5 py-1.5 transition ${
                  isActive
                    ? "border-[#E8B8C2] bg-[#FEFCF5] shadow-[0_6px_14px_rgba(232,184,194,0.28)]"
                    : "border-[#D8DDD8]/72 bg-[#FAFBF7]/72"
                }`}
              >
                <LocalPrivacyImage
                  className="h-10 w-14 rounded-[4px] object-cover"
                  src={stamp.photo}
                  alt=""
                  width={56}
                  height={40}
                />
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? "text-[#D86F82]" : "text-[#5A6670]/64"
                  }`}
                >
                  {stamp.city}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Floating draggable photo card */}
      <div className="lg:hidden">
        {!collapsed ? (
          <motion.div
            drag
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={0.18}
            dragMomentum={false}
            whileDrag={{ scale: 1.04, cursor: "grabbing" }}
            initial={{ x: 0, y: 0, rotate: -1.5 }}
            animate={{ x: 0, y: 0, rotate: -1.5 }}
            className="absolute bottom-10 left-5 z-20 w-[140px] cursor-grab select-none sm:left-8 sm:w-[170px]"
          >
            <div className="overflow-hidden rounded-[8px] border border-[#F5DCE0]/88 bg-[#FEFCF5] p-2 shadow-[0_18px_36px_rgba(91,71,50,0.18)]">
              <div className="flex items-center justify-between px-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5A6670]/58">
                <span className="inline-flex items-center gap-1">
                  <Camera className="h-3 w-3 text-[#E8B8C2]" />
                  旅行小拍
                </span>
                <button
                  type="button"
                  aria-label="收起相册"
                  onClick={() => setCollapsed(true)}
                  className="grid h-5 w-5 place-items-center rounded-full text-[#5A6670]/46 hover:bg-[#F5DCE0]/30"
                >
                  <Minimize2 className="h-3 w-3" />
                </button>
              </div>
              <div className="relative mt-1 aspect-[4/3] overflow-hidden rounded-[6px] bg-[#D6E8F0]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStamp.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.42 }}
                    className="absolute inset-0"
                    onDoubleClick={() => setPreviewStamp(activeStamp)}
                  >
                    <LocalPrivacyImage
                      className="h-full w-full object-cover"
                      src={activeStamp.photo}
                      alt={`${activeStamp.city} 旅行照片`}
                      fill
                      sizes="170px"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#15212A]/58 to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex items-end justify-between gap-2 px-1 pb-1 pt-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-none text-[#273846]">
                    {activeStamp.city}
                  </p>
                  <p className="mt-1 truncate text-[10px] font-medium text-[#5A6670]/58">
                    {activeStamp.label}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="展开相册"
                  onClick={() => setCollapsed(false)}
                  className="grid h-6 w-6 place-items-center rounded-full text-[#5A6670]/40 hover:bg-[#F5DCE0]/30"
                >
                  <Maximize2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="展开相册"
            className="absolute bottom-6 left-5 z-30 grid h-12 w-12 place-items-center rounded-full border border-[#F5DCE0]/88 bg-[#FEFCF5]/92 text-[#5A6670]/72 shadow-[0_12px_28px_rgba(91,71,50,0.18)] backdrop-blur hover:bg-[#FEFCF5] sm:left-8"
          >
            <Camera className="h-5 w-5 text-[#E8B8C2]" />
          </button>
        )}
      </div>
    </section>
  );
}