"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Download, Share, Trash2, AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react"
import type { Consent } from "./consent-dashboard"

interface ConsentTableProps {
  consents: Consent[]
}

export function ConsentTable({ consents }: ConsentTableProps) {
  const [selectedConsents, setSelectedConsents] = useState<Set<string>>(new Set())

  const toggleConsent = (id: string) => {
    const newSelected = new Set(selectedConsents)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedConsents(newSelected)
  }

  const toggleAll = () => {
    if (selectedConsents.size === consents.length) {
      setSelectedConsents(new Set())
    } else {
      setSelectedConsents(new Set(consents.map((c) => c.id)))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "expired":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "revoked":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
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
      <div className="text-center py-12">
        <p className="text-gray-500">No consents found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 font-sans">
      {selectedConsents.size > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-800">
            {selectedConsents.size} consent{selectedConsents.size > 1 ? "s" : ""} selected
          </span>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2 text-[#4b5563]" />
              Export Selected
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2 text-[#4b5563]" />
              Revoke Selected
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={selectedConsents.size === consents.length} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Connection Type</TableHead>
              <TableHead>Data Types</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Access Count</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consents.map((consent) => (
              <TableRow key={consent.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedConsents.has(consent.id)}
                    onCheckedChange={() => toggleConsent(consent.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div className="text-lg font-semibold font-sans text-[#374151]">{consent.organization}</div>
                    <div className="text-sm font-sans text-[#4b5563]">{consent.purpose}</div>
                  </div>
                </TableCell>
                <TableCell>{consent.connectionType}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {consent.dataTypes.slice(0, 2).map((type, index) => (
                      <Badge key={index} variant="secondary" className="text-xs rounded-full text-shadow-soft">
                        {type}
                      </Badge>
                    ))}
                    {consent.dataTypes.length > 2 && (
                      <Badge variant="secondary" className="text-xs rounded-full text-shadow-soft">
                        +{consent.dataTypes.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(consent.status)}>
                    {getStatusIcon(consent.status)}
                    <span className="ml-1 capitalize">{consent.status}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getRiskColor(consent.riskLevel)}>
                    {consent.riskLevel}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-sans text-[#4b5563]">{new Date(consent.createdOn).toLocaleDateString()}</TableCell>
                <TableCell className="text-sm font-sans text-[#4b5563]">{new Date(consent.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-center">{consent.accessCount}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4 text-[#4b5563]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2 text-[#4b5563]" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2 text-[#4b5563]" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2 text-[#4b5563]" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2 text-[#4b5563]" />
                        Revoke
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
