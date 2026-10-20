"use client";

import { createContext, useContext } from "react";

/** Oznake za povezave iz site.json → ui (npr. "(opens in a new tab)"), dostopne SmartLinku povsod. */
const LinkLabelsContext = createContext<{ newTab: string }>({ newTab: "" });

export function LinkLabelsProvider({
  newTab,
  children,
}: {
  newTab: string;
  children: React.ReactNode;
}) {
  return (
    <LinkLabelsContext.Provider value={{ newTab }}>
      {children}
    </LinkLabelsContext.Provider>
  );
}

export const useLinkLabels = () => useContext(LinkLabelsContext);
