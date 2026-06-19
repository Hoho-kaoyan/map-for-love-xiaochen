"use client";

import { useEffect, useRef, useState } from 'react';
import { Settings, ShieldCheck, ShieldOff, CalendarDays, Heart } from 'lucide-react';
import { MemoryPageShell } from '@/components/MemoryNav';
import { useAdminMode } from '@/hooks/useAdminMode';
import {
  readAppSettings,
  writeAppSettings,
  type AppSettings,
} from '@/data/appSettings';
import {
  loginPhotosUpdatedEvent,
  readLoginPhotoTexts,
  readLoginPhotos,
  writeLoginPhotoText,
  writeLoginPhoto,
} from '@/data/loginPhotoStore';
import { memoryStoreUpdatedEvent, type LocalMemoryStore } from '@/data/progress';
import { writeAdminMode } from '@/data/adminMode';
import { PasswordSection } from './PasswordSection';
import { LogoSection } from './LogoSection';
import { BackupSection } from './BackupSection';
import { BatchImportPhotosSection } from './BatchImportPhotosSection';
import { OssSection } from './OssSection';
import { readMemories } from '@/lib/client/storage';
import { validateAdminPassword, clearSiteSession } from '@/lib/client/auth';

export default function SettingsPage() {
  const isAdmin = useAdminMode();
  const [memoryCount, setMemoryCount] = useState(0);
  const [appSettings, setAppSettings] = useState<AppSettings>({});
  const [loginPhotos, setLoginPhotos] = useState<Record<string, string>>({});
  const [adminCode, setAdminCode] = useState("");
  const [adminError, setAdminError] = useState("");
  const [status, setStatus] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  const importInputRef = useRef<HTMLInputElement>(null);

  // Anniversary form state. The HTML <input type="date"> uses `YYYY-MM-DD`,
  // but `appSettings.anniversaryDate` is stored as `YYYY.MM.DD` (project-wide
  // convention from `data/appSettings.ts`). These two helpers bridge the two.
  const toInputDate = (value?: string): string => {
    if (!value) return "";
    const match = /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/.exec(value);
    if (!match) return "";
    const [, y, m, d] = match;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  };

  const fromInputDate = (value: string): string | undefined => {
    if (!value) return undefined;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return undefined;
    const [, y, m, d] = match;
    return `${y}.${m}.${d}`;
  };

  const [anniversaryDateInput, setAnniversaryDateInput] = useState("");
  const [anniversaryLabelInput, setAnniversaryLabelInput] = useState("");

  useEffect(() => {
    setAnniversaryDateInput(toInputDate(appSettings.anniversaryDate));
    setAnniversaryLabelInput(appSettings.anniversaryLabel ?? "");
  }, [appSettings.anniversaryDate, appSettings.anniversaryLabel]);

  const saveAnniversary = () => {
    const nextSettings: AppSettings = {
      ...appSettings,
      anniversaryDate: fromInputDate(anniversaryDateInput),
      anniversaryLabel: anniversaryLabelInput.trim() || undefined,
    };
    writeAppSettings(nextSettings);
    setAppSettings(nextSettings);
    setStatus("纪念日已保存");
  };

  const loadMemoryCount = async () => {
    const memories = await readMemories().catch(() => ({}));
    setMemoryCount(Object.values(memories).flat().length);
    return memories;
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMemoryCount();
      const settings = readAppSettings();
      const legacyPhotos = settings.loginPhotos ?? {};
      const nextSettings = { ...settings, loginPhotos: undefined };

      setAppSettings(nextSettings);
      void Promise.all(Object.entries(legacyPhotos).map(([slotId, image]) => writeLoginPhoto(slotId, image)))
        .then(async () => {
          if (Object.keys(legacyPhotos).length > 0) writeAppSettings(nextSettings);
          setLoginPhotos(await readLoginPhotos());
          const loginPhotoTexts = await readLoginPhotoTexts();
          setAppSettings((current) => ({ ...current, loginPhotoTexts }));
        })
        .catch(() => {
          setLoginPhotos(legacyPhotos);
        });
    }, 0);

    const handleLoginPhotosUpdate = () => {
      void readLoginPhotos().then(setLoginPhotos).catch(() => setLoginPhotos({}));
      void readLoginPhotoTexts()
        .then((texts) => setAppSettings((current) => ({ ...current, loginPhotoTexts: texts })))
        .catch(() => { });
    };

    window.addEventListener(loginPhotosUpdatedEvent, handleLoginPhotosUpdate);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(loginPhotosUpdatedEvent, handleLoginPhotosUpdate);
    };
  }, []);

  const unlockAdmin = async () => {
    const trimmed = adminCode.trim();
    if (!trimmed) {
      setAdminError("请输入管理员密码");
      return;
    }

    // Try server-side auth first (desktop Electron), fall back to client-side (mobile static export)
    let ok = false;
    let statusCode = 0;
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "admin", password: trimmed }),
      });
      ok = response.ok;
      statusCode = response.status;
      if (!ok && (response.status === 404 || response.status === 405)) {
        throw new Error("API not available");
      }
    } catch {
      // API not available — use client-side password validation
      ok = validateAdminPassword(trimmed).ok;
    }

    if (ok) {
      writeAdminMode(true);
      setAdminCode("");
      setAdminError("");
      setStatus("管理员模式已开启");
      return;
    }

    setAdminError(statusCode === 503 ? "管理员认证未配置" : "密码不对");
  };

  const lockAdmin = () => {
    // Try server-side logout (desktop), ignore failure on mobile
    void fetch("/api/auth/login", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "admin" }),
    }).catch(() => {});
    clearSiteSession();
    writeAdminMode(false);
    setAdminCode("");
    setAdminError("");
    setStatus("管理员模式已关闭");
  };

  return (
    <MemoryPageShell active="settings">
      <header>
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-[#A8C8DC]" />
          <h1 className="text-[34px] font-semibold leading-tight text-[#5A6670]">设置</h1>
        </div>
        <p className="mt-2 text-sm font-medium text-[#5A6670]/58">管理本地数据和当前项目状态。</p>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-[8px] border border-[#D8DDD8]/78 bg-[#FAFBF7]/76 p-5 shadow-[0_12px_28px_rgba(90,102,112,0.06)] md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <ShieldCheck className="h-6 w-6 text-[#A8C8DC]" />
              ) : (
                <ShieldOff className="h-6 w-6 text-[#E8B8C2]" />
              )}
              <div>
                <p className="text-sm font-semibold text-[#5A6670]">管理员模式</p>
                <p className="mt-1 text-xs text-[#5A6670]/52">
                  {isAdmin ? "已开启，可以编辑和导入数据。" : "未开启，设置改动和删除操作已锁定。"}
                </p>
              </div>
            </div>

            {isAdmin ? (
              <button
                className="rounded-[7px] border border-[#D8DDD8] px-4 py-2 text-sm font-semibold text-[#5A6670]/64 transition hover:bg-white/60"
                type="button"
                onClick={lockAdmin}
              >
                退出管理员
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  className="min-h-10 w-36 rounded-[7px] border border-[#D8DDD8]/80 bg-[#FAFBF7]/70 px-3 text-sm text-[#5A6670] outline-none transition focus:border-[#A8C8DC] focus:bg-white"
                  value={adminCode}
                  onChange={(event) => {
                    setAdminCode(event.target.value);
                    setAdminError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void unlockAdmin();
                  }}
                  placeholder="管理员密码"
                  type="password"
                />
                <button
                  className="rounded-[7px] bg-[#F5DCE0] px-4 py-2 text-sm font-semibold text-[#E8B8C2] transition hover:bg-[#E8B8C2] hover:text-[#FAFBF7]"
                  type="button"
                  onClick={() => void unlockAdmin()}
                >
                  开启
                </button>
                {adminError && <span className="text-xs font-semibold text-[#E8B8C2]">{adminError}</span>}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[8px] border border-[#D8DDD8]/78 bg-[#FAFBF7]/76 p-5 shadow-[0_12px_28px_rgba(90,102,112,0.06)] md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 fill-[#F5DCE0] text-[#E8B8C2]" />
              <div>
                <p className="text-sm font-semibold text-[#5A6670]">纪念日</p>
                <p className="mt-1 text-xs text-[#5A6670]/52">
                  设置在一起的日期和称呼，登录页和纪念日 Tab 会同步显示。
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[180px_1fr_auto] sm:items-end">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[#5A6670]/72">日期</span>
              <input
                className="min-h-10 rounded-[7px] border border-[#D8DDD8]/80 bg-[#FAFBF7]/70 px-3 text-sm text-[#5A6670] outline-none transition focus:border-[#A8C8DC] focus:bg-white"
                value={anniversaryDateInput}
                onChange={(event) => setAnniversaryDateInput(event.target.value)}
                type="date"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[#5A6670]/72">称呼</span>
              <input
                className="min-h-10 rounded-[7px] border border-[#D8DDD8]/80 bg-[#FAFBF7]/70 px-3 text-sm text-[#5A6670] outline-none transition focus:border-[#A8C8DC] focus:bg-white"
                value={anniversaryLabelInput}
                onChange={(event) => setAnniversaryLabelInput(event.target.value)}
                placeholder="我们在一起"
                type="text"
                maxLength={40}
              />
            </label>
            <button
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[7px] bg-[#E8B8C2] px-4 text-sm font-semibold text-[#FAFBF7] shadow-[0_6px_14px_rgba(232,184,194,0.32)] transition hover:bg-[#D6A6B0]"
              type="button"
              onClick={saveAnniversary}
            >
              <Heart className="h-4 w-4 fill-white" />
              保存
            </button>
          </div>

          {appSettings.anniversaryDate && (
            <p className="mt-3 text-xs text-[#5A6670]/52">
              当前：{appSettings.anniversaryDate}
              {appSettings.anniversaryLabel ? ` · ${appSettings.anniversaryLabel}` : ""}
            </p>
          )}
        </div>

        <PasswordSection
          isAdmin={isAdmin}
          isWorking={isWorking}
          setIsWorking={setIsWorking}
          setStatus={setStatus}
        />

        <div className="hidden lg:block">
          <LogoSection
            isAdmin={isAdmin}
            appSettings={appSettings}
            setAppSettings={setAppSettings}
            isWorking={isWorking}
            setIsWorking={setIsWorking}
            setStatus={setStatus}
          />
        </div>

        <div className="rounded-[8px] border border-[#D8DDD8]/78 bg-[#FAFBF7]/76 p-5 shadow-[0_12px_28px_rgba(90,102,112,0.06)]">
          <p className="text-sm font-semibold text-[#5A6670]">本地回忆</p>
          <p className="mt-2 text-3xl font-semibold text-[#E8B8C2]">{memoryCount}</p>
          <p className="mt-2 text-sm text-[#5A6670]/58">网页里新增的城市回忆数量。</p>
        </div>

        <BackupSection
          isAdmin={isAdmin}
          isWorking={isWorking}
          setIsWorking={setIsWorking}
          setStatus={setStatus}
          setMemoryCount={setMemoryCount}
          setAppSettings={setAppSettings}
          setLoginPhotos={setLoginPhotos}
          importInputRef={importInputRef}
        />
        <OssSection
          isAdmin={isAdmin}
          isWorking={isWorking}
          setIsWorking={setIsWorking}
          setStatus={setStatus}
        />
        
        <BatchImportPhotosSection
          isAdmin={isAdmin}
          isWorking={isWorking}
          setIsWorking={setIsWorking}
          setStatus={setStatus}
          setMemoryCount={setMemoryCount}
        />
      </section>
      {status && (
        <p className="mt-5 rounded-[8px] border border-[#D8DDD8]/78 bg-[#FAFBF7]/72 px-4 py-3 text-sm text-[#5A6670]/66">
          {status}
        </p>
      )}
    </MemoryPageShell>
  );
}
