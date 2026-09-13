import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";
import { IntroSequence } from "@/components/intro/IntroSequence";
import { IntroContext } from "@/context/IntroContext";
import { clearIntroPlayed, hasIntroPlayed, prefersReducedMotionNow } from "@/utils/introSession";

function shouldPlayIntro() {
  return !prefersReducedMotionNow() && !hasIntroPlayed();
}

function App() {
  const [showIntro, setShowIntro] = useState(shouldPlayIntro);
  const [siteMounted, setSiteMounted] = useState(() => !showIntro);
  const [morphing, setMorphing] = useState(false);

  function replayIntro() {
    clearIntroPlayed();
    window.scrollTo(0, 0);
    setMorphing(false);
    setSiteMounted(false);
    setShowIntro(true);
  }

  return (
    <IntroContext.Provider value={{ morphing, replayIntro }}>
      <BrowserRouter>
        {showIntro && (
          <IntroSequence
            onFlightStart={() => {
              setSiteMounted(true);
              setMorphing(true);
            }}
            onFlightEnd={() => setMorphing(false)}
            onComplete={() => setShowIntro(false)}
          />
        )}
        {siteMounted && <AppRoutes />}
      </BrowserRouter>
    </IntroContext.Provider>
  );
}

export default App;
