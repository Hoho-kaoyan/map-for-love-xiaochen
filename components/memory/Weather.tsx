"use client";

import { useState, useEffect } from 'react';
import { CloudSun } from 'lucide-react';
import { MemoryPageShell } from '@/components/MemoryNav';
import { useAdminMode } from '@/hooks/useAdminMode';
import { CitySearchSelect } from '@/components/shared/CitySearchSelect';
import {
  readAppSettings,
  writeAppSettings,
  defaultWeatherCityIds,
  maxWeatherCities,
  type AppSettings,
} from '@/data/appSettings';

export default function WeatherPage() {
  const isAdmin = useAdminMode();
  const [appSettings, setAppSettings] = useState<AppSettings>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    setAppSettings(readAppSettings());
  }, []);

  const updateWeatherCity = (index: number, cityId: string) => {
    if (!isAdmin) {
      setStatus("请先进入管理员模式");
      return;
    }

    setAppSettings((current) => {
      const nextIds = [...(current.weatherCityIds ?? defaultWeatherCityIds)];
      nextIds[index] = cityId;
      const nextSettings = { ...current, weatherCityIds: nextIds };
      writeAppSettings(nextSettings);
      setStatus("城市更新成功，首页天气已刷新");
      return nextSettings;
    });
  };

  const weatherCityIds = appSettings.weatherCityIds ?? defaultWeatherCityIds;

  return (
    <MemoryPageShell active="weather">
      <header>
        <div className="flex items-center gap-3">
          <CloudSun className="h-8 w-8 text-[#A8C8DC]" />
          <h1 className="text-[34px] font-semibold leading-tight text-[#5A6670]">沿途天气</h1>
        </div>
        <p className="mt-2 text-sm font-medium text-[#5A6670]/58">
          配置首页顶部卡片显示的城市天气，最多可以设置 {maxWeatherCities} 个。
        </p>
      </header>

      {status && (
        <div className="mt-4 rounded-[8px] bg-[#FAFBF7]/80 p-3 text-sm font-semibold text-[#A8C8DC] shadow-sm backdrop-blur">
          {status}
        </div>
      )}

      <div className="mt-8 rounded-[8px] border border-[#D8DDD8]/78 bg-[#FAFBF7]/76 p-6 shadow-[0_12px_28px_rgba(90,102,112,0.06)]">
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: maxWeatherCities }).map((_, index) => (
            <div key={`weather-slot-${index}`}>
              <div className="mb-2 text-xs font-semibold text-[#5A6670]/50">城市 {index + 1}</div>
              <CitySearchSelect
                value={weatherCityIds[index] ?? ""}
                onChange={(cityId) => updateWeatherCity(index, cityId)}
                disabled={!isAdmin}
                accent="blue"
              />
            </div>
          ))}
        </div>
      </div>
    </MemoryPageShell>
  );
}
