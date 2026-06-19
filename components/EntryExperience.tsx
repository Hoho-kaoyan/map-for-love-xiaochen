"use client";

import { useState } from "react";
import {
  useEntryExperienceState,
  type Stamp,
} from "@/hooks/useEntryExperienceState";
import { LoginStageShell } from "./entry/LoginStageShell";
import { MobileEntryExperience } from "./entry/MobileEntryExperience";
import { DesktopEntryExperience } from "./entry/DesktopEntryExperience";
import { EntryPreviewOverlay } from "./entry/EntryPreviewOverlay";

export default function EntryExperience() {
  const {
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
  } = useEntryExperienceState();

  const [previewStamp, setPreviewStamp] = useState<Stamp | null>(null);

  return (
    <LoginStageShell
      pointerX={pointerX}
      pointerY={pointerY}
      driftX={driftX}
      reverseX={reverseX}
    >
      <EntryPreviewOverlay
        previewStamp={previewStamp}
        onClose={() => setPreviewStamp(null)}
      />
      <MobileEntryExperience
        settings={settings}
        activeId={activeId}
        setActiveId={setActiveId}
        activeStamp={activeStamp}
        loginStamps={loginStamps}
        setPreviewStamp={setPreviewStamp}
      />
      <DesktopEntryExperience
        activeId={activeId}
        setActiveId={setActiveId}
        activeStamp={activeStamp}
        loginStamps={loginStamps}
        driftX={driftX}
        driftY={driftY}
        setPreviewStamp={setPreviewStamp}
      />
    </LoginStageShell>
  );
}