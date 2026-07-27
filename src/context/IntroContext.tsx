import { createContext, useContext } from "react";

interface IntroContextValue {
  /** True only during the brief window where the title is morphing into the navbar logo. */
  morphing: boolean;
}

export const IntroContext = createContext<IntroContextValue>({ morphing: false });

export function useIntroContext() {
  return useContext(IntroContext);
}
