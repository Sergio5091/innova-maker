"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Trash2, Eye, X, Mail, Phone, Building, MessageSquare } from "lucide-react"
import { api } from "@/lib/api"

const statusOptions = [
  { value: "new", label: "Nouveau" },
  { value: "read", label: "Lu" },
  { value: "replied", label: "Répondu" },
  { value: "closed", label: "Clôturé" },
]

const typeOptions = [
  { value: "general", label: "Général" },
  { value: "support", label: "Support" },
  { value: "partnership", label: "Partenariat" },
  { value: "complaint", label: "Réclamation" },
]

const priorityOptions = [
  { value: "low", label: "Faible" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Élevée" },
]

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-200",
  read: "bg-secondary text-muted-foreground border-border",
  replied: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  closed: "bg-secondary text-muted-foreground border-border",
}

const typeLabels: Record<string, string> = {
  general: "Général", support: "Support", partnership: "Partenariat", complaint: "Réclamation"
}

const getLabel = (options: { value: string; label: string }[], value: string) =>
  options.find(o => o.value === value)?.label || value

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [filters, setFilters] = useState({ status: "", type: "", search: "", page: 1 })

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append("status", filters.status)
      if (filters.type) params.append("type", filters.type)
      if (filters.search) params.append("search", filters.search)
      params.append("page", String(filters.page))
      const res = await api.get(`/admin/contacts?${params}`)
      setContacts(res.data)
      setPagination(res.pagination)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchContacts() }, [filters])

  const handleView = async (id: number) => {
    const res = await api.get(`/admin/contacts/${id}`)
    setSelected(res.data)
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status: res.data.status } : c))
  }

  const handlePatch = async (id: number, body: any) => {
    await api.patch(`/admin/contacts/${id}`, body)
    setSelected((prev: any) => ({ ...prev, ...body }))
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...body } : c))
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce contact ?")) return
    await api.delete(`/admin/contacts/${id}`)
    setContacts(prev => prev.filter(c => c.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">{pagination.total ?? 0} message(s) reçu(s)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-background border border-border rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
          <option value="">Tous les statuts</option>
          {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
          <option value="">Tous les types</option>
          {typeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Sujet</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-6 bg-secondary/50 rounded animate-pulse" /></td></tr>
                ))
              ) : contacts.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Aucun contact trouvé</td></tr>
              ) : contacts.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px] truncate text-foreground">{c.subject}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-full text-xs">
                      {getLabel(typeOptions, c.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[c.status] || ""}`}>
                      {getLabel(statusOptions, c.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleView(c.id)} className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-muted-foreground hover:text-primary">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Page {pagination.page} / {pagination.pages}</span>
            <div className="flex gap-2">
              <button disabled={pagination.page <= 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary disabled:opacity-40 transition-colors">
                Précédent
              </button>
              <button disabled={pagination.page >= pagination.pages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary disabled:opacity-40 transition-colors">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="bg-background rounded-2xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="font-semibold text-foreground">Détail du contact</h3>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm"><MessageSquare className="w-4 h-4 text-muted-foreground" /><span className="font-medium">{selected.name}</span></div>
                  <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-muted-foreground" /><span>{selected.email}</span></div>
                  {selected.phone && <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-muted-foreground" /><span>{selected.phone}</span></div>}
                  {selected.company && <div className="flex items-center gap-2 text-sm"><Building className="w-4 h-4 text-muted-foreground" /><span>{selected.company}</span></div>}
                </div>
                <div className="bg-secondary/30 rounded-xl p-4">
                  <div className="text-xs font-medium text-muted-foreground mb-2">SUJET</div>
                  <div className="text-sm font-medium text-foreground">{selected.subject}</div>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4">
                  <div className="text-xs font-medium text-muted-foreground mb-2">MESSAGE</div>
                  <div className="text-sm text-foreground whitespace-pre-wrap">{selected.message}</div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Statut</label>
                    <select value={selected.status}
                      onChange={(e) => handlePatch(selected.id, { status: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
                      {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Priorité</label>
                    <select value={selected.priority}
                      onChange={(e) => handlePatch(selected.id, { priority: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
                      {priorityOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes internes</label>
                  <textarea rows={3} defaultValue={selected.notes || ""}
                    onBlur={(e) => handlePatch(selected.id, { notes: e.target.value })}
                    placeholder="Ajouter une note..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
