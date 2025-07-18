"use client"

import { useState, useMemo } from "react"
import { Search, Download, Plus, Bell, Settings, User, ChevronDown, Shield, Menu, Filter, RotateCcw, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ConsentTable } from "./consent-table"
import { ConsentCards } from "./consent-cards"
import { ConsentStats } from "./consent-stats"
import { ConsentAnalytics } from "./consent-analytics"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from "../hooks/useLanguage";

export interface Consent {
  id: string
  connectionType: string
  hostUser: string
  hostLocker: string
  guestLocker: string
  dataTypes: string[]
  createdOn: string
  validityOn: string
  expiryDate: string
  status: "active" | "expired" | "pending" | "revoked"
  permissions: string[]
  lastAccessed?: string
  accessCount: number
  riskLevel: "low" | "medium" | "high"
  organization: string
  purpose: string
}

const mockConsents: Consent[] = [
  {
    id: "1",
    connectionType: "Academic",
    hostUser: "Rohith",
    hostLocker: "IIT-Roorkee",
    guestLocker: "Admissions",
    dataTypes: ["Academic Records", "Personal Info", "Certificates"],
    createdOn: "05/12/2024 10:34:28",
    validityOn: "20/12/2024 18:30:00",
    expiryDate: "01/05/2025 23:59:59",
    status: "active",
    permissions: ["read", "download"],
    lastAccessed: "18/12/2024 14:22:15",
    accessCount: 12,
    riskLevel: "low",
    organization: "Academic Bank of Credits",
    purpose: "Admission Process",
  },
  {
    id: "2",
    connectionType: "Financial",
    hostUser: "Rohith",
    hostLocker: "Santhi",
    guestLocker: "Documents",
    dataTypes: ["Bank Statements", "Income Proof", "Identity"],
    createdOn: "08/12/2024 11:34:15",
    validityOn: "18/12/2024 18:30:00",
    expiryDate: "02/11/2024 02:23:30",
    status: "expired",
    permissions: ["read"],
    lastAccessed: "02/11/2024 01:45:22",
    accessCount: 8,
    riskLevel: "medium",
    organization: "Zerodha",
    purpose: "Account Verification",
  },
  {
    id: "3",
    connectionType: "Healthcare",
    hostUser: "Rohith",
    hostLocker: "Medical-Records",
    guestLocker: "Apollo-Hospital",
    dataTypes: ["Medical History", "Lab Reports", "Prescriptions"],
    createdOn: "10/01/2024 08:45:12",
    validityOn: "10/01/2024 08:45:12",
    expiryDate: "10/07/2025 23:59:59",
    status: "active",
    permissions: ["read", "write", "share"],
    lastAccessed: "15/01/2024 12:30:45",
    accessCount: 5,
    riskLevel: "high",
    organization: "Apollo Hospitals",
    purpose: "Treatment & Consultation",
  },
  {
    id: "4",
    connectionType: "Employment",
    hostUser: "Rohith",
    hostLocker: "Professional",
    guestLocker: "HR-Portal",
    dataTypes: ["Resume", "Certificates", "References"],
    createdOn: "10/12/2024 14:20:10",
    validityOn: "12/12/2024 00:00:00",
    expiryDate: "10/03/2025 23:59:59",
    status: "pending",
    permissions: ["read"],
    accessCount: 0,
    riskLevel: "low",
    organization: "TechCorp Solutions",
    purpose: "Job Application Review",
  },
]

export function ConsentDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"table" | "cards" | "analytics">("cards")
  const [sortBy, setSortBy] = useState<string>("createdOn")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterOpen, setFilterOpen] = useState(false)
  const [nameSearch, setNameSearch] = useState("");
  const { lang, setLang, t } = useLanguage();

  // Handler for stat card clicks
  const handleStatClick = (stat: string) => {
    if (stat === "Total Consents") {
      setStatusFilter("all"); setRiskFilter("all");
    } else if (stat === "Active") {
      setStatusFilter("active"); setRiskFilter("all");
    } else if (stat === "Expired") {
      setStatusFilter("expired"); setRiskFilter("all");
    } else if (stat === "Pending") {
      setStatusFilter("pending"); setRiskFilter("all");
    } else if (stat === "High Risk") {
      setRiskFilter("high");
    }
  }

  const filteredConsents = useMemo(() => {
    return mockConsents
      .filter((consent) => {
        const matchesName =
          nameSearch === "" ||
          consent.hostUser.toLowerCase().includes(nameSearch.toLowerCase());
        const matchesSearch =
          searchTerm === "" ||
          consent.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consent.connectionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consent.dataTypes.some((type) => type.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesStatus = statusFilter === "all" || consent.status === statusFilter
        const matchesRisk = riskFilter === "all" || consent.riskLevel === riskFilter
        return matchesName && matchesSearch && matchesStatus && matchesRisk
      })
      .sort((a, b) => {
        let aValue = a[sortBy as keyof Consent];
        let bValue = b[sortBy as keyof Consent];
        if (typeof aValue === 'undefined') aValue = '';
        if (typeof bValue === 'undefined') bValue = '';
        if (sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      })
  }, [nameSearch, searchTerm, statusFilter, riskFilter, sortBy, sortOrder])

  // Move renderFilters here
  function renderFilters() {
    return (
      <>
        <div className="flex flex-nowrap items-center gap-x-3 w-full max-w-7xl mx-auto pl-6">
          {/* Search by name */}
          <div className="relative w-full max-w-sm flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" aria-hidden="true" />
            <Input
              placeholder={t("searchByName")}
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="w-full bg-gray-50 rounded-full border-none shadow-none h-9 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white border border-gray-200 rounded-full px-3 h-9 flex items-center gap-2 shadow-none text-sm font-medium hover:bg-gray-50 transition min-w-[140px] max-w-[200px]">
              <span className="text-gray-500">{t("status")}:</span>
              <SelectValue placeholder={t("allStatus")} />
            </SelectTrigger>
            <SelectContent className="transition ease-out duration-150">
              <SelectItem value="all">{t("allStatus")}</SelectItem>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="expired">{t("expired")}</SelectItem>
              <SelectItem value="pending">{t("pending")}</SelectItem>
              <SelectItem value="revoked">{t("revoked")}</SelectItem>
            </SelectContent>
          </Select>
          {/* Risk Filter */}
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="bg-white border border-gray-200 rounded-full px-3 h-9 flex items-center gap-2 shadow-none text-sm font-medium hover:bg-gray-50 transition min-w-[140px] max-w-[200px]">
              <span className="text-gray-500">{t("risk")}:</span>
              <SelectValue placeholder={t("allRisk")} />
            </SelectTrigger>
            <SelectContent className="transition ease-out duration-150">
              <SelectItem value="all">{t("allRisk")}</SelectItem>
              <SelectItem value="low">{t("low")}</SelectItem>
              <SelectItem value="medium">{t("medium")}</SelectItem>
              <SelectItem value="high">{t("high")}</SelectItem>
            </SelectContent>
          </Select>
          {/* Sort Filter */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-white border border-gray-200 rounded-full px-3 h-9 flex items-center gap-2 shadow-none text-sm font-medium hover:bg-gray-50 transition min-w-[140px] max-w-[200px]">
              <span className="text-gray-500">{t("sortBy")}:</span>
              <SelectValue placeholder={t("createdDate")} />
            </SelectTrigger>
            <SelectContent className="transition ease-out duration-150">
              <SelectItem value="createdOn">{t("createdDate")}</SelectItem>
              <SelectItem value="expiryDate">{t("expiryDate")}</SelectItem>
              <SelectItem value="organization">{t("organization")}</SelectItem>
              <SelectItem value="accessCount">{t("accessCount")}</SelectItem>
            </SelectContent>
          </Select>
          {/* Reset Filters Icon Button */}
          <button
            type="button"
            onClick={() => {
              setNameSearch("");
              setSearchTerm("");
              setStatusFilter("all");
              setRiskFilter("all");
              setSortBy("createdOn");
            }}
            className="ml-8 h-9 w-9 flex items-center justify-center rounded-full text-blue-600 hover:bg-blue-50 focus:outline-none transition"
            aria-label={t("resetFilters")}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        {/* Active Filters as tags */}
        <div className="flex flex-wrap gap-2 mt-3 max-w-7xl mx-auto">
          {statusFilter !== "all" && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center">
              {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} {t("status")}
              <button
                type="button"
                className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                onClick={() => setStatusFilter("all")}
                aria-label={t("removeStatusFilter")}
              >
                ×
              </button>
            </span>
          )}
          {riskFilter !== "all" && (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs flex items-center">
              {riskFilter.charAt(0).toUpperCase() + riskFilter.slice(1)} {t("risk")}
              <button
                type="button"
                className="ml-1 text-amber-500 hover:text-amber-700 focus:outline-none"
                onClick={() => setRiskFilter("all")}
                aria-label={t("removeRiskFilter")}
              >
                ×
              </button>
            </span>
          )}
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-200 via-sky-100 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-sky-200 via-sky-100 to-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-10 w-10 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">{t("consentManager")}</h1>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 rounded-full text-shadow-soft hidden sm:inline-block">
            {filteredConsents.length} {t("activeConsents")}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <div className="sm:hidden">
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setFilterOpen(true)}>
                  <Menu className="w-7 h-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="p-4">
                  {/* Filters in drawer */}
                  {renderFilters()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Download className="h-5 w-5 mr-2" />
              {t("export")}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 rounded-full px-4 shadow-sm"
              title={t("lockerTitle")}
              aria-label={t("lockerTitle")}
            >
              <Lock className="h-5 w-5" />
              {t("locker")}
            </Button>
            {/* Language Switcher Button */}
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full px-4 font-semibold flex items-center gap-2 shadow-sm hover:brightness-105 hover:saturate-110"
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              aria-label={t("changeLanguage")}
              title={t("changeLanguage")}
            >
              {lang === "en" ? "हिंदी" : "English"}
            </Button>
            <Button size="sm">
              <Plus className="h-5 w-5 mr-2" />
              {t("newConsent")}
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>R</AvatarFallback>
                  </Avatar>
                  <span className="ml-2">Rohith</span>
                  <ChevronDown className="h-5 w-5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="h-5 w-5 mr-2" />
                  {t("profile")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-5 w-5 mr-2" />
                  {t("settings")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      {/* Stats Row */}
      <div className="sticky top-16 z-40 w-full bg-sky-100 pt-4 pb-4 px-6 lg:px-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Section Header: Consent Overview */}
          <h2 className="text-lg font-semibold text-gray-700 mb-2 pl-1 tracking-tight select-none">
            {t("consentOverview")}
          </h2>
          <ConsentStats consents={mockConsents} onStatClick={handleStatClick} />
        </div>
      </div>
      {/* Divider between stats and filters */}
      <div className="w-full max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-70" />
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="max-w-7xl w-full mx-auto">
          {/* Search and Filters Section */}
          <div className="relative z-10 mt-3 mb-5">
            <div className="bg-white rounded-xl shadow-md max-w-7xl mx-auto w-full mt-2 py-2 sm:py-2">
              {/* Removed Section Header: Search & Filters */}
              {renderFilters()}
            </div>
          </div>
          {/* Divider between filters and main content */}
          <div className="w-full max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-70 mb-2" />
          {/* View Toggle and Content */}
          <div className="px-6 lg:px-10 py-6 space-y-6 max-w-full w-full mx-auto">
            {/* Section Header: Your Consents */}
            <h2 className="text-lg font-semibold text-gray-700 mb-4 pl-1 tracking-tight select-none">
              {t("yourConsents")}
            </h2>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'cards' | 'analytics')}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="flex-1 flex justify-center ml-11">
                  <TabsList>
                    <TabsTrigger value="cards">{t("cardView")}</TabsTrigger>
                    <TabsTrigger value="table">{t("tableView")}</TabsTrigger>
                    <TabsTrigger value="analytics">{t("analyticsView")}</TabsTrigger>
                  </TabsList>
                </div>
                <div className="text-sm text-gray-500">
                  {t("showing")} {filteredConsents.length} {t("of")} {mockConsents.length} {t("consents")}
                </div>
              </div>
              <TabsContent value="cards" className="mt-0">
                <ConsentCards consents={filteredConsents} />
              </TabsContent>
              <TabsContent value="table" className="mt-0">
                <ConsentTable consents={filteredConsents} />
              </TabsContent>
              <TabsContent value="analytics" className="mt-0">
                <ConsentAnalytics consents={filteredConsents} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}