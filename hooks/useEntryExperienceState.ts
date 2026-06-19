"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  appSettingsUpdatedEvent,
  readAppSettings,
  type AppSettings,
} from "@/data/appSettings";
import {
  loginPhotosUpdatedEvent,
  readLoginPhotoTexts,
  readLoginPhotos,
} from "@/data/loginPhotoStore";

export type Stamp = {
  id: string;
  city: string;
  label: string;
  note: string;
  photo: string;
};

const loginPhotoVersion = "placeholder-20260601";
const loginPhotoPath = (fileName: string) =>
  `/photos/login/${fileName}.jpg?v=${loginPhotoVersion}`;

export const stamps: ReadonlyArray<Stamp> = [
  {
    id: "hangzhou",
    city: "杭州",
    label: "春日湖畔",
    note: "风从西湖边吹过来，像把那一天重新翻开。",
    photo: loginPhotoPath("hangzhou"),
  },
  {
    id: "shanghai",
    city: "上海",
    label: "外滩傍晚",
    note: "灯亮起来的时候，城市像一张慢慢显影的照片。",
    photo: loginPhotoPath("shanghai"),
  },
  {
    id: "macau",
    city: "澳门",
    label: "旧城花影",
    note: "小巷、坡道和花影，都被收进同一只相框。",
    photo: loginPhotoPath("macau"),
  },
  {
    id: "hongkong",
    city: "香港",
    label: "夜色亮起",
    note: "海面反光的时候，回忆也跟着亮了一下。",
    photo: loginPhotoPath("hongkong"),
  },
  {
    id: "qingdao",
    city: "青岛",
    label: "海风经过",
    note: "海边的风把照片吹得很亮，也把时间吹慢了。",
    photo: loginPhotoPath("qingdao"),
  },
  {
    id: "zhengzhou",
    city: "郑州",
    label: "见面那天",
    note: "有些城市不是风景，是故事真正开始的地方。",
    photo: loginPhotoPath("zhengzhou"),
  },
  {
    id: "zhuhai",
    city: "珠海",
    label: "海边散步",
    note: "浪慢慢退下去，脚步和心跳都变轻了。",
    photo: loginPhotoPath("zhuhai"),
  },
  {
    id: "guangzhou",
    city: "广州",
    label: "旧街热气",
    note: "热气、灯光和街角的声音，拼成一张很近的照片。",
    photo: loginPhotoPath("guangzhou"),
  },
  {
    id: "jinan",
    city: "济南",
    label: "泉边小记",
    note: "水声很轻，像把回忆放进透明的玻璃瓶里。",
    photo: loginPhotoPath("jinan"),
  },
];

/**
 * Aggregates the login experience state shared across mobile and desktop
 * entry experiences: settings, login photos, pointer-driven parallax motion
 * values, the active city stamp, and the auto-rotating stamp carousel.
 *
 * `pointerX / pointerY` are exposed (not just their downstream transforms) so
 * the consuming shell can wire `onPointerMove` and call `.set(...)` directly.
 * SSR is safe because `useMotionValue` initializes to 0 and no listeners are
 * attached server-side.
 */
export function useEntryExperienceState() {
  const [settings, setSettings] = useState<AppSettings>({});
  const [loginPhotos, setLoginPhotos] = useState<Record<string, string>>({});
  const [loginPhotoTexts, setLoginPhotoTexts] = useState<
    AppSettings["loginPhotoTexts"]
  >({});
  const [activeId, setActiveId] = useState<string>("hangzhou");

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 22 });
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 22 });
  const driftX = useTransform(smoothX, [-0.5, 0.5], [-16, 16]);
  const driftY = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);
  const reverseX = useTransform(smoothX, [-0.5, 0.5], [12, -12]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSettings(readAppSettings());
      void readLoginPhotos().then(setLoginPhotos).catch(() => setLoginPhotos({}));
      void readLoginPhotoTexts()
        .then(setLoginPhotoTexts)
        .catch(() => setLoginPhotoTexts({}));
    }, 0);

    const handleSettingsUpdate = (event: Event) => {
      const nextSettings = (event as CustomEvent<AppSettings>).detail;
      setSettings(nextSettings);
    };
    const handleLoginPhotosUpdate = () => {
      void readLoginPhotos().then(setLoginPhotos).catch(() => setLoginPhotos({}));
      void readLoginPhotoTexts()
        .then(setLoginPhotoTexts)
        .catch(() => setLoginPhotoTexts({}));
    };

    window.addEventListener(appSettingsUpdatedEvent, handleSettingsUpdate);
    window.addEventListener(loginPhotosUpdatedEvent, handleLoginPhotosUpdate);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(appSettingsUpdatedEvent, handleSettingsUpdate);
      window.removeEventListener(loginPhotosUpdatedEvent, handleLoginPhotosUpdate);
    };
  }, []);

  const loginStamps = useMemo<Stamp[]>(() => {
    return stamps.map((stamp) => ({
      ...stamp,
      city:
        loginPhotoTexts?.[stamp.id]?.city ??
        settings.loginPhotoTexts?.[stamp.id]?.city ??
        stamp.city,
      label:
        loginPhotoTexts?.[stamp.id]?.label ??
        settings.loginPhotoTexts?.[stamp.id]?.label ??
        stamp.label,
      photo:
        loginPhotos[stamp.id] ?? settings.loginPhotos?.[stamp.id] ?? stamp.photo,
    }));
  }, [loginPhotoTexts, loginPhotos, settings.loginPhotoTexts, settings.loginPhotos]);

  const activeStamp = loginStamps.find((stamp) => stamp.id === activeId) ?? loginStamps[0];

  useEffect(() => {
    if (loginStamps.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = loginStamps.findIndex((s) => s.id === currentId);
        const nextIndex =
          currentIndex === -1 ? 0 : (currentIndex + 1) % loginStamps.length;
        return loginStamps[nextIndex]?.id ?? currentId;
      });
    }, 4000);
    return () => window.clearInterval(timer);
  }, [loginStamps]);

  return {
    settings,
    activeId,
    setActiveId,
    activeStamp,
    loginStamps,
    pointerX,
    pointerY,
    driftX,
    driftY,
    reverseX,
  };
}

export type EntryExperienceState = ReturnType<typeof useEntryExperienceState>;
export type { MotionValue };