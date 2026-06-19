"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Heart,
  LockKeyhole,
  MapPinned,
  Maximize2,
} from "lucide-react";
import { LocalPrivacyImage } from "@/components/LocalPrivacyImage";
import { useLoginSubmit, type LoginStatus } from "@/hooks/useLoginSubmit";
import type { Stamp } from "@/hooks/useEntryExperienceState";
import { PixelHeart } from "./PixelHeart";
import { PasswordPanel } from "./PasswordPanel";

type DesktopEntryExperienceProps = {
  activeId: string;
  setActiveId: (next: string) => void;
  activeStamp: Stamp;
  loginStamps: Stamp[];
  driftX: import("framer-motion").MotionValue<number>;
  driftY: import("framer-motion").MotionValue<number>;
  setPreviewStamp: (stamp: Stamp | null) => void;
};

/**
 * Desktop (>= 1024px) login layout: brand header, shared password panel on
 * the left, and the dark photo album panel on the right (polaroid, mini
 * stamp strip, parallax text). Mirrors `EntryExperience.tsx:293-575` with
 * one addition: the polaroid can be double-clicked to open the full-screen
 * preview (matching the mobile photo card).
 */
export function DesktopEntryExperience({
  activeId,
  setActiveId,
  activeStamp,
  loginStamps,
  driftX,
  driftY,
  setPreviewStamp,
}: DesktopEntryExperienceProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<LoginStatus>("idle");
  const { pressKey } = useLoginSubmit({ status, setStatus, setCode });

  return (
    <section className="relative z-10 grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(360px,0.86fr)_minmax(520px,1.14fr)]">
      <div className="hidden flex-col justify-between pb-4 pt-10 lg:flex">
        <div className="flex items-center justify-between px-10">
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
        <PasswordPanel code={code} status={status} pressKey={pressKey} />
      </div>

      <motion.div
        className="relative m-6 hidden min-h-0 overflow-hidden rounded-[8px] border border-[#DCCFC1]/86 bg-[#161F27] shadow-[0_28px_80px_rgba(91,71,50,0.12)] lg:block"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, delay: 0.08 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            className="absolute inset-0 overflow-hidden"
            key={activeStamp.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.42 }}
          >
            <LocalPrivacyImage
              className="h-full w-full object-cover opacity-42 saturate-[1.08]"
              src={activeStamp.photo}
              alt=""
              fill
              sizes="60vw"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,31,39,0.84),rgba(22,31,39,0.24)_50%,rgba(22,31,39,0.72)),radial-gradient(circle_at_72%_22%,rgba(245,220,224,0.24),transparent_34%)]" />
          </motion.div>
        </AnimatePresence>

        <motion.div className="absolute inset-6" style={{ x: driftX, y: driftY }}>
          <div className="absolute left-0 top-0 max-w-[390px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-2 text-xs font-semibold text-white/76 backdrop-blur">
                <Camera className="h-4 w-4 text-[#F5DCE0]" />
                private album
              </div>
              <p className="mt-6 max-w-[360px] text-[clamp(48px,5.4vw,82px)] font-semibold leading-[0.88] tracking-normal text-white">
                旧照片
                <span className="block text-[#F5AFC0]">新地图</span>
              </p>
              <p className="mt-5 max-w-[320px] text-sm font-medium leading-7 text-white/62">
                从过去出发，
                <br />
                去看我们走过的地方。
              </p>
            </div>
          </div>

          <div className="absolute bottom-[15%] right-[5%] top-[3%] w-[42%] min-w-[330px]">
            <AnimatePresence mode="wait">
              <motion.div
                className="login-polaroid absolute inset-x-0 top-0 overflow-hidden rounded-[8px] border border-white/72 bg-[#FEFCF5] p-3 shadow-[0_34px_76px_rgba(0,0,0,0.34)]"
                key={`${activeStamp.id}-polaroid`}
                initial={{ opacity: 0, rotate: -2, y: 18 }}
                animate={{ opacity: 1, rotate: 1.5, y: 0 }}
                exit={{ opacity: 0, rotate: 3, y: -14 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                onDoubleClick={() => setPreviewStamp(activeStamp)}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#D6E8F0]">
                  <LocalPrivacyImage
                    className="h-full w-full object-cover"
                    src={activeStamp.photo}
                    alt={`${activeStamp.city} 旅行照片`}
                    fill
                    sizes="420px"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#15212A]/52 to-transparent" />
                </div>
                <div className="flex items-end justify-between gap-3 px-1 pb-1 pt-3">
                  <div className="min-w-0">
                    <p className="text-2xl font-semibold leading-none text-[#273846]">
                      {activeStamp.city}
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#61717A]">
                      {activeStamp.label}
                    </p>
                  </div>
                  <MapPinned className="h-6 w-6 text-[#D86F82]" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-[5%] left-0 right-0 flex items-end justify-center gap-2.5 px-4">
            {loginStamps.map((stamp, index) => (
              <button
                className={
                  stamp.id === activeId
                    ? "login-mini-photo is-active"
                    : "login-mini-photo"
                }
                key={stamp.id}
                style={{ rotate: `${index % 2 === 0 ? -4 : 4}deg` }}
                type="button"
                onClick={() => setActiveId(stamp.id)}
                onMouseEnter={() => setActiveId(stamp.id)}
                onFocus={() => setActiveId(stamp.id)}
                aria-label={`切换到${stamp.city}`}
              >
                <LocalPrivacyImage
                  className="h-full w-full rounded-[5px] object-cover"
                  src={stamp.photo}
                  alt=""
                  width={112}
                  height={82}
                />
                <span>{stamp.city}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {status === "open" && (
          <motion.div
            className="absolute inset-0 z-20 grid place-items-center bg-[#FEFCF5]/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="rounded-[8px] border border-[#F5DCE0] bg-white/78 px-5 py-4 text-center shadow-[0_22px_56px_rgba(91,71,50,0.14)]"
              initial={{ scale: 0.92, y: 12 }}
              animate={{ scale: 1, y: 0 }}
            >
              <Heart className="mx-auto h-7 w-7 fill-[#D86F82] text-[#D86F82]" />
              <p className="mt-2 text-sm font-semibold text-[#344451]">
                正在打开地图
              </p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}