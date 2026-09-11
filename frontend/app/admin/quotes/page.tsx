"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Trash2, Eye, X } from "lucide-react"
import { api } from "@/lib/api"

const statusOptions = [
  { value: "pending", label: "En attente" },
  { value: "contacted", label: "Contacté" },
  { value: "quoted", label: "Devis envoyé" },
  { value: "accepted", label: "Accepté" },
  { value: "rejected", label: "Refusé" },
  { value: "completed", label: "Terminé" },
]

const priorityOptions = [
  { value: "low", label: "Faible" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Élevée" },
  { value: "urgent", label: "Urgent" },
]

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-200",
  contacted: "bg-purple-500/10 text-purple-600 border-purple-200",
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

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [filters, setFilters] = useState({ status: "", priority: "", search: "", page: 1 })

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append("status", filters.status)
      if (filters.priority) params.append("priority", filters.priority)
      if (filters.search) params.append("search", filters.search)
      params.append("page", String(filters.page))
      const res = await api.get(`/admin/quotes?${params}`)
      setQuotes(res.data)
      setPagination(res.pagination)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchQuotes() }, [filters])

  const handleView = async (id: number) => {
    const res = await api.get(`/admin/quotes/${id}`)
    setSelected(res.data)
  }

  const handlePatch = async (id: number, body: any) => {
    await api.patch(`/admin/quotes/${id}`, body)
    setSelected((prev: any) => ({ ...prev, ...body }))
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...body } : q))
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette demande de devis ?")) return
    await api.delete(`/admin/quotes/${id}`)
    setQuotes(prev => prev.filter(q => q.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const getLabel = (options: { value: string; label: string }[], value: string) =>
    options.find(o => o.value === value)?.label || value

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Demandes de devis</h1>
        <p className="text-sm text-muted-foreground mt-1">{pagination.total ?? 0} demande(s) reçue(s)</p>
      </div>

      {/* Filtres */}
      <div className="bg-background border border-border rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input placeholder="Rechercher un client..." value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
        </div>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
          <option value="">Tous les statuts</option>
          {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
          <option value="">Toutes les priorités</option>
          {priorityOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Service</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Budget</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Priorité</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-6 bg-secondary/50 rounded animate-pulse" /></td></tr>
                ))
              ) : quotes.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Aucune demande de devis</td></tr>
              ) : quotes.map((q) => (
                <tr key={q.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{q.name}</div>
                    <div className="text-xs text-muted-foreground">{q.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{q.service_name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{q.budget || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[q.status] || ""}`}>
                      {getLabel(statusOptions, q.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[q.priority] || ""}`}>
                      {getLabel(priorityOptions, q.priority)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(q.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleView(q.id)} className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-muted-foreground hover:text-primary">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(q.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

      {/* Panneau détail */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="bg-background rounded-2xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="font-semibold text-foreground">Demande de devis #{selected.id}</h3>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-secondary rounded-lg"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-5">

                {/* Infos client */}
                <div className="grid grid-cols-2 gap-3 text-sm bg-secondary/20 rounded-xl p-4">
                  <div><span className="text-muted-foreground text-xs block mb-0.5">Nom</span><span className="font-medium">{selected.name}</span></div>
                  <div><span className="text-muted-foreground text-xs block mb-0.5">Email</span><span>{selected.email}</span></div>
                  <div><span className="text-muted-foreground text-xs block mb-0.5">Téléphone</span><span>{selected.phone || "—"}</span></div>
                  <div><span className="text-muted-foreground text-xs block mb-0.5">Entreprise</span><span>{selected.company || "—"}</span></div>
                </div>

                {/* Infos projet */}
                <div className="grid grid-cols-2 gap-3 text-sm bg-secondary/20 rounded-xl p-4">
                  <div><span className="text-muted-foreground text-xs block mb-0.5">Service demandé</span><span>{selected.service_name || "Non précisé"}</span></div>
                  <div><span className="text-muted-foreground text-xs block mb-0.5">Type de projet</span><span>{selected.project_type || "—"}</span></div>
                  <div><span className="text-muted-foreground text-xs block mb-0.5">Budget estimé</span><span>{selected.budget || "—"}</span></div>
                  <div><span className="text-muted-foreground text-xs block mb-0.5">Délai souhaité</span><span>{selected.timeline || "—"}</span></div>
                </div>

                {/* Description */}
                {selected.description && (
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <div className="text-xs font-medium text-muted-foreground mb-2">DESCRIPTION DU PROJET</div>
                    <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{selected.description}</div>
                  </div>
                )}

                {/* Gestion statut & priorité */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Statut du dossier</label>
                    <select value={selected.status} onChange={(e) => handlePatch(selected.id, { status: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
                      {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Priorité</label>
                    <select value={selected.priority} onChange={(e) => handlePatch(selected.id, { priority: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
                      {priorityOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Notes internes */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Notes internes
                    <span className="font-normal ml-1">(non visible par le client)</span>
                  </label>
                  <textarea rows={4} defaultValue={selected.notes || ""}
                    onBlur={(e) => handlePatch(selected.id, { notes: e.target.value })}
                    placeholder="Ex: Appelé le 10/09, intéressé par le pack complet, rappeler vendredi..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none resize-none focus:border-primary" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
