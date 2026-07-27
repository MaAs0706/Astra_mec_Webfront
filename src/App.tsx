import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";
import { IntroSequence } from "@/components/intro/IntroSequence";
import { IntroContext } from "@/context/IntroContext";
import { hasIntroPlayed, prefersReducedMotionNow } from "@/utils/introSession";

function shouldPlayIntro() {
  return !prefersReducedMotionNow() && !hasIntroPlayed();
}

function App() {
  const [showIntro, setShowIntro] = useState(shouldPlayIntro);
  const [siteMounted, setSiteMounted] = useState(() => !showIntro);
  const [morphing, setMorphing] = useState(false);

  return (
    <IntroContext.Provider value={{ morphing }}>
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
