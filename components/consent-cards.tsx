"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  CalendarX,
  Shield,
  Eye,
  Download,
  Share,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Building,
  User,
  FileText,
} from "lucide-react"
import type { Consent } from "./consent-dashboard"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { useLanguage } from "../hooks/useLanguage";

interface ConsentCardsProps {
  consents: Consent[]
}

export function ConsentCards({ consents }: ConsentCardsProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const { t } = useLanguage();

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCards(newExpanded)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 stroke-2" />
      case "expired":
        return <CalendarX className="w-4 h-4 stroke-2 text-orange-600" />
      case "pending":
        return <AlertTriangle className="w-4 h-4 stroke-2 text-yellow-600" />
      case "revoked":
        return <XCircle className="w-4 h-4 stroke-2 text-red-600" />
      default:
        return <Shield className="w-4 h-4 stroke-2 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 rounded-full text-shadow-soft";
      case "pending":
        return "bg-cyan-100 text-cyan-700 rounded-full text-shadow-soft";
      case "expired":
        return "bg-gray-200 text-gray-700 rounded-full text-shadow-soft";
      default:
        return "bg-gray-200 text-gray-700 rounded-full text-shadow-soft";
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-rose-100 text-rose-700 rounded-full text-shadow-soft";
      case "medium":
        return "bg-amber-100 text-amber-700 rounded-full text-shadow-soft";
      case "low":
        return "bg-green-100 text-green-700 rounded-full text-shadow-soft";
      default:
        return "bg-gray-200 text-gray-700 rounded-full text-shadow-soft";
    }
  }

  if (consents.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No consents found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {consents.map((consent) => {
          const expanded = expandedCards.has(consent.id);
          return (
            <Card
              key={consent.id}
              className="bg-gradient-to-br from-white via-blue-50 to-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200 ease-in-out p-8 cursor-pointer w-full h-auto flex flex-col justify-between select-none font-sans"
              onClick={(e) => {
                // Prevent toggle if clicking the arrow icon
                if ((e.target as HTMLElement).closest('.expand-arrow')) return;
                toggleCard(consent.id);
              }}
            >
              <div>
                <div className="flex flex-col gap-y-6">
                  {/* Top Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="bg-gray-100 p-2 rounded-full flex items-center justify-center">
                        <Building className="w-4 h-4 stroke-2 text-[#4b5563]" />
                      </span>
                      <CardTitle className="text-lg font-semibold font-sans text-[#374151] line-clamp-2 break-words">{consent.organization}</CardTitle>
                    </div>
                    <div className="flex flex-row gap-x-2 items-center justify-end">
                    <Badge variant="outline" className={`h-7 px-4 text-sm font-semibold flex items-center justify-center rounded-full transition duration-200 ease-in-out hover:brightness-105 hover:saturate-110 min-w-[100px] ${getStatusColor(consent.status)}`}>
                        <span className="bg-gray-100 p-1 rounded-full flex items-center justify-center">
                      {getStatusIcon(consent.status)}
                        </span>
                      <span className="ml-1 capitalize">{t(consent.status)}</span>
                    </Badge>
                    {consent.riskLevel === "high" ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Badge variant="outline" className={`h-7 px-4 text-sm font-semibold flex items-center justify-center rounded-full transition duration-200 ease-in-out hover:brightness-105 hover:saturate-110 min-w-[100px] ${getRiskColor(consent.riskLevel)}`}>
                                  {t("risk")}: {t(consent.riskLevel)}
                    </Badge>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="font-semibold mb-1">High Risk Consent</div>
                              <ul className="list-disc pl-5 mb-2 text-xs text-gray-700">
                                <li>Consent is expired or near expiry</li>
                                <li>Contains sensitive data</li>
                                <li>High access volume detected</li>
                              </ul>
                              <div className="font-semibold text-xs mb-1">Suggested Actions:</div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="destructive">Revoke</Button>
                                <Button size="sm" variant="outline">Modify</Button>
                                <Button size="sm" variant="secondary">Investigate Access</Button>
                  </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Badge variant="outline" className={`h-7 px-4 text-sm font-semibold flex items-center justify-center rounded-full transition duration-200 ease-in-out hover:brightness-105 hover:saturate-110 min-w-[100px] ${getRiskColor(consent.riskLevel)}`}>
                          {t("risk")}: {t(consent.riskLevel)}
                        </Badge>
                      )}
                      <span
                        className="expand-arrow bg-gray-100 p-2 rounded-full flex items-center justify-center ml-2 cursor-pointer transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCard(consent.id);
                        }}
                      >
                  <ChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                            expanded ? "rotate-180" : ""
                    }`}
                  />
                      </span>
                </div>
                  </div>
                  {/* Bottom Row */}
                  <div className="flex items-center justify-between text-sm text-gray-600 leading-tight mt-6">
                    <div className="flex flex-row gap-2 items-center text-sm font-sans text-[#4b5563]">
                      <span className="bg-gray-100 p-1 rounded-full inline-flex items-center justify-center">
                        <FileText className="w-4 h-4 stroke-2 text-[#4b5563]" />
                      </span>
                      <span>{consent.dataTypes[0]}</span>
                      {consent.dataTypes.length > 1 && (
                        <span className="ml-1 text-xs text-gray-400">+{consent.dataTypes.length - 1} more</span>
                      )}
                    </div>
                    <div className="flex flex-row gap-2 items-center text-sm font-sans text-[#4b5563]">
                      <span className="bg-gray-100 p-1 rounded-full inline-flex items-center justify-center">
                        <CalendarX className="w-4 h-4 stroke-2 text-[#4b5563]" />
                      </span>
                    <span>Expires: {new Date(consent.expiryDate).toLocaleDateString()}</span>
                  </div>
                    <div className="flex flex-row gap-2 items-center text-sm font-sans text-[#4b5563]">
                      <span className="bg-gray-100 p-1 rounded-full inline-flex items-center justify-center">
                        <Eye className="w-4 h-4 stroke-2 text-[#4b5563]" />
                      </span>
                    <span>{consent.accessCount} accesses</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}
                >
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-center">{t("connectionDetails")}</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm items-center">
                        <span className="text-gray-600 text-right">{t("hostUser")}:</span>
                        <span className="font-medium text-left">{consent.hostUser}</span>
                        <span className="text-gray-600 text-right">{t("hostLocker")}:</span>
                        <span className="font-medium text-left">{consent.hostLocker}</span>
                        <span className="text-gray-600 text-right">{t("guestLocker")}:</span>
                        <span className="font-medium text-left">{consent.guestLocker}</span>
                        <span className="text-gray-600 text-right">{t("purpose")}:</span>
                        <span className="font-medium text-left">{consent.purpose}</span>
                        </div>
                        </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-center">{t("timeline")}</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm items-center">
                        <span className="text-gray-600 text-right">{t("createdDate")}</span>
                        <span className="font-medium text-left">{new Date(consent.createdOn).toLocaleDateString()}</span>
                        <span className="text-gray-600 text-right">{t("validFrom")}</span>
                        <span className="font-medium text-left">{new Date(consent.validityOn).toLocaleDateString()}</span>
                        <span className="text-gray-600 text-right">{t("expiryDate")}</span>
                        <span className="font-medium text-left">{new Date(consent.expiryDate).toLocaleDateString()}</span>
                        {consent.lastAccessed && (
                          <>
                            <span className="text-gray-600 text-right">{t("lastAccessed")}</span>
                            <span className="font-medium text-left">{new Date(consent.lastAccessed).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-center">{t("dataTypes")}</h4>
                      <div className="flex flex-wrap gap-2 items-center justify-center">
                        {consent.dataTypes.map((type, index) => (
                          <Badge key={index} variant="secondary" className="text-xs rounded-full text-shadow-soft transition duration-200 ease-in-out hover:brightness-105 hover:saturate-110">
                            <FileText className="h-3 w-3 mr-1 stroke-2 text-[#4b5563]" />
                            {t(type)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-center">{t("permissions")}</h4>
                      <div className="flex flex-wrap gap-2 items-center justify-center">
                        {consent.permissions.map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs capitalize rounded-full text-shadow-soft transition duration-200 ease-in-out hover:brightness-105 hover:saturate-110">
                            {t(permission)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                        {/* Example Access Logs */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 text-center">{t("accessLogs")}</h4>
                          <div className="space-y-1 text-xs text-gray-500">
                            <div>2024-01-15 12:30:45 - Accessed by user</div>
                            <div>2024-01-10 08:45:12 - Consent created</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Action Buttons: Download Data & Revoke Consent */}
                <div className="flex flex-row gap-4 justify-end mt-8">
                  <Button variant="secondary" className="rounded-full px-6 font-semibold flex items-center gap-2 shadow-sm hover:brightness-105 hover:saturate-110">
                    <Download className="w-4 h-4" />
                    {t("downloadData")}
                  </Button>
                  <Button variant="destructive" className="rounded-full px-6 font-semibold flex items-center gap-2 shadow-sm hover:brightness-105 hover:saturate-110">
                    <Trash2 className="w-4 h-4" />
                    {t("revokeConsent")}
                  </Button>
                </div>
              </CardContent>
                </div>
              </div>
          </Card>
          );
        })}
      </div>
    </div>
  )
}
