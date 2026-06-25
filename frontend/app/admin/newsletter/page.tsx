"use client"

import { useEffect, useState } from "react"
import { Search, Trash2, Download } from "lucide-react"
import { api } from "@/lib/api"

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: "", page: 1 })

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      params.append("page", String(filters.page))
      const res = await api.get(`/admin/newsletter?${params}`)
      setSubscribers(res.data)
      setPagination(res.pagination)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSubscribers() }, [filters])

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet abonné ?")) return
    await api.delete(`/admin/newsletter/${id}`)
    setSubscribers(prev => prev.filter(s => s.id !== id))
  }

  const handleExport = () => {
    const csv = ["Email,Nom,Date d'inscription", ...subscribers.map(s =>
      `${s.email},${s.name || ""},${new Date(s.subscribed_at).toLocaleDateString("fr-FR")}`)
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `newsletter_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Newsletter</h1>
          <p className="text-sm text-muted-foreground mt-1">{pagination.total ?? 0} abonné(s) actif(s)</p>
        </div>
        <button onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground">
          <Download className="w-4 h-4" /> Exporter CSV
        </button>
      </div>

      <div className="bg-background border border-border rounded-2xl p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input placeholder="Rechercher un abonné..." value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nom</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inscrit le</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-6 bg-secondary/50 rounded animate-pulse" /></td></tr>
              ))
            ) : subscribers.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">Aucun abonné</td></tr>
            ) : subscribers.map((s) => (
              <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{s.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.name || "—"}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-full text-xs">{s.source || "website"}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(s.subscribed_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Page {pagination.page} / {pagination.pages}</span>
            <div className="flex gap-2">
              <button disabled={pagination.page <= 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary disabled:opacity-40">Précédent</button>
              <button disabled={pagination.page >= pagination.pages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary disabled:opacity-40">Suivant</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
