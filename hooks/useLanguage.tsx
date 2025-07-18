"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Add index signature to allow string keys
interface TranslationMap {
  [key: string]: string;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    consent: "Consent",
    downloadData: "Download Data",
    revokeConsent: "Revoke Consent",
    accessLogs: "Access Logs",
    connectionDetails: "Connection Details",
    timeline: "Timeline",
    dataTypes: "Data Types",
    permissions: "Permissions",
    consentManager: "Consent Manager",
    activeConsents: "Active Consents",
    export: "Export",
    locker: "Locker",
    lockerTitle: "Secure Data Storage Container",
    changeLanguage: "Change Language",
    newConsent: "New Consent",
    profile: "Profile",
    settings: "Settings",
    cardView: "Card View",
    tableView: "Table View",
    analyticsView: "Analytics View",
    showing: "Showing",
    of: "of",
    consents: "consents",
    searchByName: "Search by name...",
    status: "Status",
    allStatus: "All Status",
    risk: "Risk",
    allRisk: "All Risk",
    low: "Low",
    medium: "Medium",
    high: "High",
    sortBy: "Sort by",
    createdDate: "Created Date",
    expiryDate: "Expiry Date",
    organization: "Organization",
    accessCount: "Access Count",
    resetFilters: "Reset Filters",
    removeStatusFilter: "Remove status filter",
    removeRiskFilter: "Remove risk filter",
    totalConsents: "Total Consents",
    active: "Active",
    expired: "Expired",
    pending: "Pending",
    revoked: "Revoked",
    highRisk: "High Risk",
    totalAccess: "Total Access",
    hostUser: "Host User",
    hostLocker: "Host Locker",
    guestLocker: "Guest Locker",
    purpose: "Purpose",
    validFrom: "Valid From",
    lastAccessed: "Last Accessed",
    // Demo data types and permissions
    Resume: "Resume",
    Certificates: "Certificates",
    References: "References",
    Email: "Email",
    Phone: "Phone",
    Address: "Address",
    read: "Read",
    write: "Write",
    share: "Share",
    consentOverview: "Consent Overview",
    searchAndFilters: "Search & Filters",
    yourConsents: "Your Consents",
  },
  hi: {
    consent: "सहमति",
    downloadData: "डेटा डाउनलोड करें",
    revokeConsent: "सहमति रद्द करें",
    accessLogs: "पहुंच लॉग्स",
    connectionDetails: "कनेक्शन विवरण",
    timeline: "समयरेखा",
    dataTypes: "डेटा प्रकार",
    permissions: "अनुमतियाँ",
    consentManager: "सहमति प्रबंधक",
    activeConsents: "सक्रिय सहमतियाँ",
    export: "निर्यात करें",
    locker: "लॉकर",
    lockerTitle: "सुरक्षित डेटा भंडारण कंटेनर",
    changeLanguage: "भाषा बदलें",
    newConsent: "नई सहमति",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    cardView: "कार्ड दृश्य",
    tableView: "तालिका दृश्य",
    analyticsView: "विश्लेषण दृश्य",
    showing: "दिखा रहे हैं",
    of: "में से",
    consents: "सहमतियाँ",
    searchByName: "नाम से खोजें...",
    status: "स्थिति",
    allStatus: "सभी स्थिति",
    risk: "जोखिम",
    allRisk: "सभी जोखिम",
    low: "निम्न",
    medium: "मध्यम",
    high: "उच्च",
    sortBy: "क्रमबद्ध करें",
    createdDate: "निर्माण तिथि",
    expiryDate: "समाप्ति तिथि",
    organization: "संगठन",
    accessCount: "पहुंच संख्या",
    resetFilters: "फ़िल्टर रीसेट करें",
    removeStatusFilter: "स्थिति फ़िल्टर हटाएँ",
    removeRiskFilter: "जोखिम फ़िल्टर हटाएँ",
    totalConsents: "कुल सहमतियाँ",
    active: "सक्रिय",
    expired: "समाप्त",
    pending: "लंबित",
    revoked: "रद्द",
    highRisk: "उच्च जोखिम",
    totalAccess: "कुल पहुंच",
    hostUser: "मेज़बान उपयोगकर्ता",
    hostLocker: "मेज़बान लॉकर",
    guestLocker: "अतिथि लॉकर",
    purpose: "उद्देश्य",
    validFrom: "से मान्य",
    lastAccessed: "अंतिम पहुँच",
    // Demo data types and permissions
    Resume: "रिज़्यूमे",
    Certificates: "प्रमाण पत्र",
    References: "संदर्भ",
    Email: "ईमेल",
    Phone: "फ़ोन",
    Address: "पता",
    read: "पढ़ें",
    write: "लिखें",
    share: "साझा करें",
    consentOverview: "सहमति अवलोकन",
    searchAndFilters: "खोज और फ़िल्टर",
    yourConsents: "आपकी सहमतियाँ",
  },
};

type Lang = "en" | "hi";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = (key: string) => translations[lang][key] || key;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
} 