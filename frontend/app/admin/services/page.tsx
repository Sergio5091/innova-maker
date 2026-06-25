"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, Plus, Trash2, Pencil, ToggleLeft, ToggleRight } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchServices = async () => {
    setLoading(true)
    try {
      const res = await api.get("/admin/services")
      setServices(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchServices() }, [])

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggle = async (s: any) => {
    await api.put(`/admin/services/${s.id}`, { ...s, is_active: !s.is_active })
    setServices(prev => prev.map(item => item.id === s.id ? { ...item, is_active: !item.is_active } : item))
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce service ?")) return
    await api.delete(`/admin/services/${id}`)
    setServices(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} service(s)</p>
        </div>
        <Link href="/admin/services/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> Nouveau service
          </Button>
        </Link>
      </div>

      <div className="bg-background border border-border rounded-2xl p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Service</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Catégorie</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Délai</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ordre</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actif</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-6 bg-secondary/50 rounded animate-pulse" /></td></tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Aucun service trouvé</td></tr>
            ) : filtered.map((s) => (
              <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.slug}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-full text-xs">{s.category_name}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.delivery_time || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.sort_order}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(s)}>
                    {s.is_active ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6 text-muted-foreground" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/services/${s.id}`} className="p-1.5 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
