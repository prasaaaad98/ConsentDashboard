import { ChartContainer } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"
import type { Consent } from "./consent-dashboard"
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area
} from "recharts"

interface ConsentAnalyticsProps {
  consents: Consent[]
}

export function ConsentAnalytics({ consents }: ConsentAnalyticsProps) {
  // Mock data for charts
  const riskData = [
    { name: "Jan", high: 2, medium: 1, low: 1 },
    { name: "Feb", high: 1, medium: 2, low: 2 },
    { name: "Mar", high: 3, medium: 1, low: 1 },
  ]
  const expiringData = [
    { name: "Jan", expiring: 1 },
    { name: "Feb", expiring: 2 },
    { name: "Mar", expiring: 1 },
  ]
  const accessData = [
    { name: "Jan", access: 10 },
    { name: "Feb", access: 20 },
    { name: "Mar", access: 15 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Risk Trends</h3>
          <ChartContainer config={{ high: { color: '#dc2626', label: 'High' }, medium: { color: '#f59e0b', label: 'Medium' }, low: { color: '#16a34a', label: 'Low' } }}>
            <LineChart data={riskData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="high" stroke="#dc2626" strokeWidth={2} />
              <Line type="monotone" dataKey="medium" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="low" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Expiring Consents</h3>
          <ChartContainer config={{ expiring: { color: '#f59e0b', label: 'Expiring' } }}>
            <BarChart data={expiringData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="expiring" fill="#f59e0b" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Access Frequency</h3>
          <ChartContainer config={{ access: { color: '#6366f1', label: 'Access' } }}>
            <AreaChart data={accessData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Area type="monotone" dataKey="access" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
} 