"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"
import type { Consent } from "./consent-dashboard"
import { useEffect, useState } from "react"
import { useLanguage } from "../hooks/useLanguage";

interface ConsentStatsProps {
  consents: Consent[]
  onStatClick?: (stat: string) => void
}

function AnimatedNumber({ value, duration = 1000 }: { value: number, duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    let frame: number;
    function animate() {
      start += increment;
      if (start < value) {
        setDisplay(Math.floor(start));
        frame = requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return <span>{display}</span>;
}

export function ConsentStats({ consents, onStatClick }: ConsentStatsProps) {
  const { t } = useLanguage();
  const stats = {
    total: consents.length,
    active: consents.filter((c) => c.status === "active").length,
    expired: consents.filter((c) => c.status === "expired").length,
    pending: consents.filter((c) => c.status === "pending").length,
    highRisk: consents.filter((c) => c.riskLevel === "high").length,
    totalAccess: consents.reduce((sum, c) => sum + c.accessCount, 0),
  }

  // Dummy trend value for demo
  const accessTrend = { percent: 12, up: true }

  const statCards = [
    {
      title: t("totalConsents"),
      value: stats.total,
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: t("active"),
      value: stats.active,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: t("expired"),
      value: stats.expired,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: t("pending"),
      value: stats.pending,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: t("highRisk"),
      value: stats.highRisk,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: t("totalAccess"),
      value: stats.totalAccess,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: accessTrend,
    },
  ]

  // --- Scroll-based minimization logic ---
  const [minimized, setMinimized] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 100) setMinimized(true);
      else setMinimized(false);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={
        minimized
          ? "sticky top-16 z-50 flex gap-2 px-4 py-2 bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 ease-in-out"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      }
      style={minimized ? { borderRadius: 16 } : {}}
    >
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={
            (onStatClick && stat.title !== t("totalAccess")
              ? 'cursor-pointer ' : '') +
            (minimized
              ? 'flex items-center justify-center gap-2 bg-white/90 rounded-full shadow transition-all duration-300 ease-in-out px-3 py-1 h-10 min-h-0 w-auto'
              : 'bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transform transition-all duration-200 ease-in-out hover:scale-105 p-3 flex flex-col justify-between items-start min-h-[90px]')
          }
          onClick={onStatClick && stat.title !== t("totalAccess") ? () => onStatClick(stat.title) : undefined}
        >
          <div className={minimized ? "flex items-center gap-2" : "flex items-center justify-between w-full"}>
            <div className={
              minimized
                ? "p-1 rounded-full flex items-center justify-center bg-blue-100 text-blue-700"
                : `p-2 rounded-full flex items-center justify-center ${
                    stat.title === t("totalConsents") ? 'bg-blue-100 text-blue-700' :
                    stat.title === t("active") ? 'bg-green-100 text-green-700' :
                    stat.title === t("expired") ? 'bg-gray-200 text-gray-700' :
                    stat.title === t("pending") ? 'bg-cyan-100 text-cyan-700' :
                    stat.title === t("highRisk") ? 'bg-rose-100 text-rose-700' :
                    stat.title === t("totalAccess") ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`
            }>
              <stat.icon className={minimized ? "h-4 w-4" : "h-4 w-4"} />
            </div>
            <p className={
              minimized
                ? "text-base font-bold text-gray-900 ml-1 transition-all duration-300 ease-in-out"
                : "text-xl font-bold text-gray-900 ml-2 transition-all duration-300 ease-in-out"
            }><AnimatedNumber value={stat.value} /></p>
            {/* Trend for minimized Total Access */}
            {minimized && stat.title === t("totalAccess") && stat.trend && (
              <span className={`flex items-center text-xs font-semibold ${stat.trend.up ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend.up ? (
                  <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" /></svg>
                ) : (
                  <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 9l-6 6-6-6" /></svg>
                )}
                {stat.trend.percent}%
              </span>
            )}
            {/* Hide label in minimized */}
            <p className={
              minimized
                ? "hidden"
                : "text-sm font-medium text-gray-600 ml-2 transition-all duration-300 ease-in-out opacity-100"
            }>{stat.title}</p>
          </div>
          {/* Show trend in expanded */}
          {!minimized && stat.title === t("totalAccess") && stat.trend && (
            <span className={`flex items-center text-xs font-semibold mt-2 ${stat.trend.up ? 'text-green-600' : 'text-red-600'}`}>
              {stat.trend.up ? (
                <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" /></svg>
              ) : (
                <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 9l-6 6-6-6" /></svg>
              )}
              {stat.trend.percent}%
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
