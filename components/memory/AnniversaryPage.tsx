"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Heart } from "lucide-react";
import {
  appSettingsUpdatedEvent,
  readAppSettings,
  type AppSettings,
} from "@/data/appSettings";
import { daysTogether } from "@/lib/dateUtils";
import { configs, daysUntil } from "./Shared";
import { MemoryToolShell } from "./MemoryToolShell";
import { MemoryToolList } from "./MemoryToolList";

type AnniversaryHeroCardProps = {
  settings: AppSettings;
};

function AnniversaryHeroCard({ settings }: AnniversaryHeroCardProps) {
  const together = daysTogether(settings.anniversaryDate);
  const next = daysUntil(settings.anniversaryDate);

  if (!together) {
    return (
      <div className="rounded-[12px] border border-dashed border-[#D8DDD8] bg-[#FAFBF7]/60 px-5 py-6 sm:px-7 sm:py-7">
        <Image
          src="/sprites/characters/couple-sitting.png"
          width={120}
          height={120}
          unoptimized
          alt=""
          className="pixelated mx-auto mt-1 mb-2 pointer-events-none select-none"
        />
        <div className="flex items-center gap-3">
          <CalendarDays className="h-7 w-7 fill-[#F5DCE0] text-[#E8B8C2]" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5A6670]/46">
            纪念日
          </span>
        </div>
        <h2 className="mt-3 text-[22px] font-semibold leading-tight text-[#5A6670]">
          还没设置纪念日
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#5A6670]/58">
          在「设置 → 纪念日」填一个日期，这里会显示在一起的天数和下一个纪念日倒数。
        </p>
        <Link
          href="/settings"
          className="mt-4 inline-flex items-center gap-1.5 rounded-[8px] bg-[#E8B8C2] px-4 py-2 text-sm font-semibold text-[#FAFBF7] shadow-[0_6px_14px_rgba(232,184,194,0.32)] transition hover:bg-[#D6A6B0]"
        >
          <Heart className="h-4 w-4 fill-white" />
          去设置纪念日
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[12px] border border-[#F5DCE0]/88 bg-gradient-to-br from-[#FEFCF5] via-[#FEFCF5] to-[#F5DCE0]/40 px-5 py-6 shadow-[0_18px_44px_rgba(232,184,194,0.22)] sm:px-7 sm:py-8">
      <div className="flex items-center gap-3">
        <CalendarDays className="h-7 w-7 fill-[#F5DCE0] text-[#E8B8C2]" />
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5A6670]/58">
          纪念日 · {settings.anniversaryLabel ?? "我们在一起"}
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-3">
        <h2 className="text-[clamp(34px,5vw,46px)] font-semibold leading-none text-[#5A6670]">
          我们在一起
        </h2>
        <span className="text-[clamp(34px,5vw,46px)] font-semibold leading-none text-[#E8B8C2]">
          {together.days}
        </span>
        <span className="text-base font-semibold text-[#5A6670]/58">天</span>
      </div>

      <p className="mt-3 text-sm font-medium text-[#5A6670]/68">
        {settings.anniversaryDate}
        {next !== null && (
          <span className="ml-3">
            <span className="mx-1.5 text-[#5A6670]/32">·</span>
            {next >= 0
              ? `距离下一个纪念日还有 ${next} 天`
              : `本纪念日已过 ${Math.abs(next)} 天`}
          </span>
        )}
      </p>

      {together.isFuture && (
        <p className="mt-1 text-xs text-[#5A6670]/46">
          这个日期还在未来，{Math.abs(next ?? 0)} 天后才到。
        </p>
      )}
    </div>
  );
}

/**
 * Anniversary Tab page. Renders:
 *   1. Hero card with the primary anniversary (from `appSettings`) and a
 *      "next anniversary" countdown
 *   2. Divider + sub-heading
 *   3. Shared `MemoryToolList` for the remaining anniversaries, with
 *      `excludeDate` set to the primary date so it doesn't appear twice
 *
 * Replaces the old thin wrapper that just rendered `MemoryToolPage`. Both
 * `/anniversaries` (mobile and desktop) route through this component.
 */
export default function AnniversaryPage() {
  const [settings, setSettings] = useState<AppSettings>({});

  useEffect(() => {
    setSettings(readAppSettings());

    const handleSettingsUpdate = (event: Event) => {
      const nextSettings = (event as CustomEvent<AppSettings>).detail;
      setSettings(nextSettings);
    };
    window.addEventListener(appSettingsUpdatedEvent, handleSettingsUpdate);
    return () => {
      window.removeEventListener(appSettingsUpdatedEvent, handleSettingsUpdate);
    };
  }, []);

  return (
    <MemoryToolShell active="anniversaries">
      <AnniversaryHeroCard settings={settings} />
      <hr className="my-8 border-t border-[#D8DDD8]/60" />
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A6670]/46">
        其它纪念日
      </p>
      <MemoryToolList
        config={configs.anniversary}
        excludeDate={settings.anniversaryDate}
      />
    </MemoryToolShell>
  );
}