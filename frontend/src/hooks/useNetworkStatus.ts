import { useFnn } from "../context/FnnContext";

export function useNetworkStatus() {
  const { online, forceOffline, disasterMode, restoreAndSync, syncing } = useFnn();
  return {
    online,
    forceOffline,
    disasterMode,
    restoreAndSync,
    syncing,
  };
}
