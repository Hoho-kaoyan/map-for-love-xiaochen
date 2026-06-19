"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map as MapIcon,
  Image as ImageIcon,
  CalendarDays,
  Archive,
  User,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      key: "map",
      label: "地图",
      icon: MapIcon,
      href: "/map",
      isActive: pathname === "/map",
    },
    {
      key: "memories",
      label: "相册",
      icon: ImageIcon,
      href: "/memories",
      isActive: pathname === "/memories",
    },
    {
      key: "anniversaries",
      label: "纪念日",
      icon: CalendarDays,
      href: "/anniversaries",
      isActive: pathname === "/anniversaries",
    },
    {
      key: "time-capsule",
      label: "时光宝盒",
      icon: Archive,
      href: "/time-capsule",
      isActive: pathname === "/time-capsule",
    },
    {
      key: "settings",
      label: "我的",
      icon: User,
      href: "/settings",
      isActive: pathname === "/settings",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] grid grid-cols-5 border-t border-[#D8DDD8]/80 bg-[#FAFBF7]/90 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-4px_24px_rgba(90,102,112,0.04)] backdrop-blur-md lg:hidden">
      {navItems.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`flex min-w-0 flex-col items-center justify-center gap-1 p-1.5 transition ${
            item.isActive ? "text-[#D86F82]" : "text-[#5A6670]/50 hover:text-[#5A6670]/80"
          }`}
        >
          <item.icon
            className={`h-[18px] w-[18px] ${item.isActive ? "fill-current" : ""}`}
            strokeWidth={item.isActive ? 2.5 : 2}
          />
          <span
            className={`w-full truncate text-center text-[10px] ${
              item.isActive ? "font-semibold" : "font-medium"
            }`}
          >
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}