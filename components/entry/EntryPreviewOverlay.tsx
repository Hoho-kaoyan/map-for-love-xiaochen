"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { LocalPrivacyImage } from "@/components/LocalPrivacyImage";
import type { Stamp } from "@/hooks/useEntryExperienceState";

type EntryPreviewOverlayProps = {
  previewStamp: Stamp | null;
  onClose: () => void;
};

/**
 * Full-screen image preview. Triggered from either the mobile photo card or
 * the desktop polaroid via the parent root component's `previewStamp` state.
 * Lives at the root level (not inside the breakpoint children) so it overlays
 * the entire screen regardless of viewport.
 */
export function EntryPreviewOverlay({
  previewStamp,
  onClose,
}: EntryPreviewOverlayProps) {
  return (
    <AnimatePresence>
      {previewStamp && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#161F27]/90 backdrop-blur-md p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className="absolute right-4 top-4 sm:right-8 sm:top-8 z-10 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-white/10 text-white/80 backdrop-blur transition hover:bg-white/20 hover:text-white"
            onClick={onClose}
            aria-label="关闭预览"
            type="button"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <motion.div
            className="relative max-w-4xl w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] bg-[#273846] shadow-2xl">
              <LocalPrivacyImage
                className="h-full w-full object-contain"
                src={previewStamp.photo}
                alt={previewStamp.city}
                fill
                sizes="100vw"
                priority
              />
            </div>
            <div className="absolute -bottom-16 left-0 right-0 text-center">
              <p className="text-xl sm:text-2xl font-semibold text-white shadow-black drop-shadow-md">
                {previewStamp.city}
              </p>
              <p className="mt-1 text-sm sm:text-base text-white/70 shadow-black drop-shadow-md">
                {previewStamp.label}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}