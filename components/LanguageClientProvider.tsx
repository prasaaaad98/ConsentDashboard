"use client";
import { LanguageProvider } from "../hooks/useLanguage";
import React from "react";

export default function LanguageClientProvider({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
} 