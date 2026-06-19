"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { motion } from "framer-motion";

export type ToastVariant = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  variant: ToastVariant;
  message: string;
};

const STYLES: Record<ToastVariant, { bg: string; icon: typeof CheckCircle2 }> = {
  success: { bg: "bg-[#A8C89A]/95", icon: CheckCircle2 },
  error: { bg: "bg-[#E8845A]/95", icon: AlertCircle },
  info: { bg: "bg-[#E8B8C2]/95", icon: Info },
};

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

/**
 * Single toast card. Rendered by `ToastViewport` inside `ToastProvider`.
 * Lives separately so the presentation layer can evolve independently from
 * the queue/state layer.
 */
export function Toast({ toast, onDismiss }: Readonly<ToastProps>) {
  const style = STYLES[toast.variant];
  const Icon = style.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`pointer-events-auto flex items-start gap-2.5 rounded-[10px] border border-white/20 ${style.bg} px-4 py-3 text-white shadow-[0_12px_32px_rgba(90,102,112,0.22)] backdrop-blur`}
      role="status"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="rounded-full p-0.5 opacity-70 transition hover:opacity-100"
        aria-label="关闭"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
