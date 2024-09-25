"use client";
import React, { createContext, ReactNode, useState } from "react";

type ProgressContextType = {
  progress: number | null;
  setProgress: React.Dispatch<React.SetStateAction<number | null>>;
};

export const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [progress, setProgress] = useState<number | null>(null);

  return (
    <ProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
