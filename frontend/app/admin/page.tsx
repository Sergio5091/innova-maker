"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  MessageSquare, FileText, ShoppingBag, Newspaper,
  Mail, Wrench, TrendingUp, TrendingDown, Clock,
  AlertCircle, CheckCircle2, ArrowRight, BarChart3, Users
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { api } from "@/lib/api"

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-200",
  pending: "bg-amber-500/10 text-amber-600 border-amber-200",
  read: "bg-secondary text-muted-foreground border-border",
  contacted: "bg-purple-500/10 text-purple-600 border-purple-200",
  replied: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  closed: "bg-secondary text-muted-foreground border-border",
  quoted: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
}

const priorityColors: Record<string, string> = {
  low: "bg-secondary text-muted-foreground",
  medium: "bg-amber-500/10 text-amber-600",
  high: "bg-orange-500/10 text-orange-600",
  urgent: "bg-destructive/10 text-destructive",
}

function StatCard({ title, value, sub, icon: Icon, color, href, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link href={href} className="group block">
        <div className="bg-background border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
              <Icon className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{value ?? "—"}</div>
          <div className="text-sm font-medium text-foreground">{title}</div>
          {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
        </div>
      </Link>
    </motion.div>
  )
}

// Fusionne les données contacts + devis sur 30 jours
function mergeChartData(contacts: any[], quotes: any[]) {
  const map: Record<string, any> = {}
  contacts.forEach(({ date, count }) => {
    map[date] = { date, contacts: count, quotes: 0 }
  })
  quotes.forEach(({ date, count }) => {
    if (map[date]) map[date].quotes = count
    else map[date] = { date, contacts: 0, quotes: count }
  })
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date))
}

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/admin/stats")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const chartData = data ? mergeChartData(data.charts.contacts, data.charts.quotes) : []

  const statCards = data ? [
    { title: "Contacts", value: data.stats.contacts.total, sub: `${data.stats.contacts.new_count} nouveau(x)`, icon: MessageSquare, color: "bg-blue-500/10 text-blue-600", href: "/admin/contacts", delay: 0 },
    { title: "Devis", value: data.stats.quotes.total, sub: `${data.stats.quotes.pending_count} en attente`, icon: FileText, color: "bg-amber-500/10 text-amber-600", href: "/admin/quotes", delay: 0.05 },
    { title: "Produits", value: data.stats.products.total, sub: `${data.stats.products.active_count} actifs`, icon: ShoppingBag, color: "bg-primary/10 text-primary", href: "/admin/products", delay: 0.1 },
    { title: "Articles", value: data.stats.articles.total, sub: `${data.stats.articles.published_count} publiés`, icon: Newspaper, color: "bg-purple-500/10 text-purple-600", href: "/admin/articles", delay: 0.15 },
    { title: "Services", value: data.stats.services.total, sub: "services actifs", icon: Wrench, color: "bg-emerald-500/10 text-emerald-600", href: "/admin/services", delay: 0.2 },
    { title: "Newsletter", value: data.stats.newsletter.total, sub: "abonnés actifs", icon: Mail, color: "bg-orange-500/10 text-orange-600", href: "/admin/newsletter", delay: 0.25 },
  ] : []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de l'activité INOVA Makers</p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-background border border-border rounded-2xl p-6 animate-pulse h-36" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card) => <StatCard key={card.title} {...card} />)}
        </div>
      )}

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activité 30 jours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-background border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Activité — 30 derniers jours</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Contacts et demandes de devis</p>
            </div>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          {loading ? (
            <div className="h-56 bg-secondary/50 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.45 0.25 260)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="oklch(0.45 0.25 260)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorQuotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 260)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid oklch(0.92 0.005 260)", fontSize: "12px" }}
                  labelFormatter={(v) => `Date: ${v}`}
                />
                <Legend />
                <Area type="monotone" dataKey="contacts" name="Contacts" stroke="oklch(0.45 0.25 260)" fill="url(#colorContacts)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="quotes" name="Devis" stroke="#f59e0b" fill="url(#colorQuotes)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Google Analytics placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-background border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Trafic Web</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Google Analytics</p>
            </div>
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>

          {/* ── À remplacer par le vrai widget GA4 quand Measurement ID disponible ── */}
          <div className="h-48 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Google Analytics</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">
                Ajoute ton Measurement ID<br />
                <code className="text-xs bg-secondary px-1 rounded">G-XXXXXXXXXX</code><br />
                pour activer le tracking
              </p>
            </div>
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Créer un compte GA4 →
            </a>
          </div>
          {/* ───────────────────────────────────────────────────────────────────────── */}
        </motion.div>
      </div>

      {/* Latest activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Derniers contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-background border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground">Derniers contacts</h3>
            <Link href="/admin/contacts" className="text-xs text-primary hover:underline">Voir tout</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-secondary/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : data?.latest.contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Aucun contact</div>
          ) : (
            <div className="space-y-3">
              {data?.latest.contacts.map((c: any) => (
                <Link key={c.id} href={`/admin/contacts`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.subject}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[c.status] || ""}`}>
                    {c.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Derniers devis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-background border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground">Derniers devis</h3>
            <Link href="/admin/quotes" className="text-xs text-primary hover:underline">Voir tout</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-secondary/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : data?.latest.quotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Aucun devis</div>
          ) : (
            <div className="space-y-3">
              {data?.latest.quotes.map((q: any) => (
                <Link key={q.id} href={`/admin/quotes`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{q.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{q.email}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[q.status] || ""}`}>
                      {q.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[q.priority] || ""}`}>
                      {q.priority}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
