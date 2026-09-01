import { useFnn } from "../context/FnnContext";

export function useDemoMode() {
  const {
    apiMode,
    demoPhase,
    demoBusy,
    demoManual,
    runFullDemo,
    runSosDemo,
    demoNext,
    closeDemo,
    simulateLiveSignal,
  } = useFnn();

  return {
    isDemo: apiMode === "LOCAL_DEMO",
    apiMode,
    demoPhase,
    demoBusy,
    demoManual,
    runFullDemo,
    runSosDemo,
    demoNext,
    closeDemo,
    simulateLiveSignal,
  };
}
