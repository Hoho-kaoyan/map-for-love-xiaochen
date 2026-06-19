"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  chinaFeatures,
  makePath,
  makeProjection,
  provinceIdOf,
} from "@/lib/geo";
import { daysTogether } from "@/lib/dateUtils";
import { LANDING_CONFIG } from "@/data/landingConfig";

const STATIC_COLORS = {
  cream: "#FAFBF7",
  dim: "#D8DDD8",
  sakura: "#F5DCE0",
};

function daysUntil(value?: string) {
  if (!value || !/^\d{4}\.\d{2}\.\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split(".").map(Number);
  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

function StaticChinaMap({ lit }: { lit: Set<string> }) {
  const W = 800;
  const H = 600;
  const projection = useMemo(() => makeProjection(W, H, 24), []);
  const path = useMemo(() => makePath(projection), [projection]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      {chinaFeatures.map((f) => {
        const id = provinceIdOf(f);
        const isLit = lit.has(id);
        return (
          <path
            key={id}
            d={path(f as never) ?? ""}
            fill={isLit ? STATIC_COLORS.sakura : STATIC_COLORS.dim}
            opacity={isLit ? 0.72 : 0.34}
            stroke={STATIC_COLORS.cream}
            strokeWidth={0.6}
          />
        );
      })}
    </svg>
  );
}

function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-[12px] border border-[#D8DDD8] bg-[#FAFBF7]/72 px-5 py-6 text-center backdrop-blur">
      <div className="text-xs uppercase tracking-[0.18em] text-[#5A6670]/46">
        {label}
      </div>
      <div className="mt-2 text-[36px] font-semibold tracking-tight">
        {value}
      </div>
      <div className="text-xs text-[#5A6670]/54">{unit}</div>
    </div>
  );
}

export default function LandingPage() {
  const cfg = LANDING_CONFIG;
  const litSet = useMemo(() => new Set(cfg.litProvinceIds), [cfg.litProvinceIds]);
  const [a, b] = cfg.coupleNames;
  const together = daysTogether(cfg.anniversaryDate);
  const nextAnniversary = daysUntil(cfg.anniversaryDate);

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-[#FAFBF7] text-[#5A6670]">
      <div className="login-paper absolute inset-0" />
      <div className="login-sun" />
      <div className="login-cloud login-cloud-a" />
      <div className="login-cloud login-cloud-b" />
      <div className="login-grid absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1080px] px-6 py-12 sm:py-20">
        <section className="text-center">
          <div className="flex justify-center gap-4">
            <Image
              src="/sprites/characters/couple-pointing.png"
              width={88}
              height={88}
              unoptimized
              alt=""
              className="pixelated"
            />
            <Image
              src="/sprites/characters/couple-sitting.png"
              width={88}
              height={88}
              unoptimized
              alt=""
              className="pixelated"
            />
          </div>
          <h1 className="mt-6 text-[36px] font-semibold tracking-[-0.01em] sm:text-[48px]">
            {a} 和 {b} 的时光地图
          </h1>
          <p className="mt-3 text-base text-[#5A6670]/64">
            {cfg.anniversaryLabel} · {cfg.anniversaryDate}
          </p>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3">
          <StatCard
            label="在一起"
            value={together ? String(together.days) : "—"}
            unit="天"
          />
          <StatCard
            label="点亮城市"
            value={String(cfg.litCityCount)}
            unit="座"
          />
          <StatCard
            label="下一个纪念日"
            value={
              nextAnniversary !== null
                ? String(Math.max(0, nextAnniversary))
                : "—"
            }
            unit="天后"
          />
        </section>

        <section className="mt-12 rounded-[16px] border border-[#D8DDD8] bg-[#FAFBF7]/72 p-6 shadow-[0_18px_48px_rgba(90,102,112,0.06)] backdrop-blur sm:mt-16 sm:p-10">
          <h2 className="text-[22px] font-semibold">我们已经点亮的地方</h2>
          <p className="mt-2 text-sm text-[#5A6670]/60">
            粉色 = 一起去过的省份
          </p>
          <div className="mt-6">
            <StaticChinaMap lit={litSet} />
          </div>
        </section>

        <section className="mt-12 sm:mt-16">
          <h2 className="text-[22px] font-semibold">最近的回忆</h2>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {cfg.memories.map((m, i) => (
              <article
                key={i}
                className="w-[280px] shrink-0 snap-start rounded-[12px] border border-[#D8DDD8] bg-[#FAFBF7]/72 p-5 backdrop-blur"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-semibold">{m.city}</span>
                  <span className="text-xs text-[#5A6670]/48">{m.date}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#5A6670]/72">
                  {m.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 text-center sm:mt-16">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 rounded-[10px] bg-[#E8B8C2] px-7 py-3 text-base font-semibold text-[#FAFBF7] shadow-[0_8px_20px_rgba(232,184,194,0.32)] transition hover:bg-[#D6A6B0]"
          >
            打开地图 →
          </Link>
          <p className="mt-3 text-xs text-[#5A6670]/40">
            需要密码登录，所有数据存在本地浏览器
          </p>
        </section>
      </div>
    </main>
  );
}