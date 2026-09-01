import { FnnProvider, useFnn } from "./context/FnnContext";
import { AppShell } from "./components/AppShell";
import { Dashboard } from "./pages/Dashboard";
import { Signals } from "./pages/Signals";
import { SpiderSignal } from "./pages/SpiderSignal";
import { Heroes } from "./pages/Heroes";
import { PrivacyMapPage } from "./pages/PrivacyMapPage";
import { SOS } from "./pages/SOS";
import { Community } from "./pages/Community";
import { Services } from "./pages/Services";
import { Credits } from "./pages/Credits";
import { TopFive } from "./pages/TopFive";
import { PrivacyChallenge } from "./pages/PrivacyChallenge";
import { DisasterMode } from "./pages/DisasterMode";

function AppContent() {
  const { view } = useFnn();

  switch (view) {
    case "dashboard":
      return <Dashboard />;
    case "signals":
      return <Signals />;
    case "spider":
      return <SpiderSignal />;
    case "heroes":
      return <Heroes />;
    case "map":
      return <PrivacyMapPage />;
    case "sos":
      return <SOS />;
    case "community":
      return <Community />;
    case "services":
      return <Services />;
    case "credits":
      return <Credits />;
    case "top5":
      return <TopFive />;
    case "privacy-challenge":
      return <PrivacyChallenge />;
    case "disaster":
      return <DisasterMode />;
    default:
      return <Dashboard />;
  }
}

export function App() {
  return (
    <FnnProvider>
      <AppShell>
        <AppContent />
      </AppShell>
    </FnnProvider>
  );
}

export default App;
