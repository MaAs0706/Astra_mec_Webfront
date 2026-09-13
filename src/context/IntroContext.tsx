import { createContext, useContext } from "react";

interface IntroContextValue {
  /** True only during the brief window where the title is morphing into the navbar logo. */
  morphing: boolean;
  replayIntro: () => void;
}

export const IntroContext = createContext<IntroContextValue>({ morphing: false, replayIntro: () => {} });

export function useIntroContext() {
  return useContext(IntroContext);
}
