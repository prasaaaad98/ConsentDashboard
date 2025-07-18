"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ConsentFiltersProps {
  activeFilters: {
    status?: string
    riskLevel?: string
    connectionType?: string
    organization?: string
  }
  onRemoveFilter: (filterType: string) => void
  onClearAll: () => void
}

export function ConsentFilters({ activeFilters, onRemoveFilter, onClearAll }: ConsentFiltersProps) {
  const hasActiveFilters = Object.values(activeFilters).some((filter) => filter && filter !== "all")

  if (!hasActiveFilters) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Active Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {activeFilters.status && activeFilters.status !== "all" && (
            <Badge variant="secondary" className={`flex items-center gap-1 rounded-full text-shadow-soft ${activeFilters.status === 'active' ? 'bg-green-100 text-green-700' : activeFilters.status === 'pending' ? 'bg-cyan-100 text-cyan-700' : activeFilters.status === 'expired' ? 'bg-gray-200 text-gray-700' : 'bg-gray-200 text-gray-700'}`}>
              Status: {activeFilters.status}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onRemoveFilter("status")} />
            </Badge>
          )}
          {activeFilters.riskLevel && activeFilters.riskLevel !== "all" && (
            <Badge variant="secondary" className={`flex items-center gap-1 rounded-full text-shadow-soft ${activeFilters.riskLevel === 'high' ? 'bg-rose-100 text-rose-700' : activeFilters.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' : activeFilters.riskLevel === 'low' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
              Risk: {activeFilters.riskLevel}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onRemoveFilter("riskLevel")} />
            </Badge>
          )}
          {activeFilters.connectionType && activeFilters.connectionType !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {activeFilters.connectionType}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onRemoveFilter("connectionType")} />
            </Badge>
          )}
          {activeFilters.organization && activeFilters.organization !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Org: {activeFilters.organization}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onRemoveFilter("organization")} />
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
