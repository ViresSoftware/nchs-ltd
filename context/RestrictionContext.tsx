"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface RestrictionContextType {
  isVerified: boolean;
  verify: (email: string) => void;
}

const RestrictionContext = createContext<RestrictionContextType | undefined>(undefined);

export const RestrictionProvider = ({ children }: { children: ReactNode }) => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("vires_verified");
    if (stored === "true") setIsVerified(true);
  }, []);

  const verify = (email: string) => {
    if (/\S+@\S+\.\S+/.test(email)) {
      localStorage.setItem("vires_verified", "true");
      setIsVerified(true);
    }
  };

  return (
    <RestrictionContext.Provider value={{ isVerified, verify }}>
      {children}
    </RestrictionContext.Provider>
  );
};

export const useRestriction = () => {
  const context = useContext(RestrictionContext);
  if (!context) throw new Error("useRestriction must be used within a RestrictionProvider");
  return context;
};