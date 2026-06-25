"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Pencil, X } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

const typeColors: Record<string, string> = {
  product: "bg-primary/10 text-primary",
  service: "bg-emerald-500/10 text-emerald-600",
  blog: "bg-purple-500/10 text-purple-600",
}

const emptyForm = { name: "", slug: "", description: "", type: "product", sort_order: 0, is_active: true }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<any>(null) // null | 'new' | category object
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await api.get("/admin/categories")
      // On exclut les catégories de type service — gérées via /admin/services
      setCategories((res.data || []).filter((c: any) => c.type !== 'service'))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const openNew = () => { setForm(emptyForm); setModal("new") }
  const openEdit = (c: any) => {
    setForm({ name: c.name, slug: c.slug, description: c.description || "", type: c.type, sort_order: c.sort_order, is_active: c.is_active })
    setModal(c)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal === "new") {
        await api.post("/admin/categories", form)
      } else {
        await api.put(`/admin/categories/${modal.id}`, form)
      }
      setModal(null)
      fetch()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette catégorie ?")) return
    await api.delete(`/admin/categories/${id}`)
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  const grouped = categories.reduce((acc: any, c) => {
    if (!acc[c.type]) acc[c.type] = []
    acc[c.type].push(c)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Catégories</h1>
          <p className="text-sm text-muted-foreground mt-1">{categories.length} catégorie(s)</p>
        </div>
        <Button onClick={openNew} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Nouvelle catégorie
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-background border border-border rounded-xl animate-pulse" />)}
        </div>
      ) : (
        Object.entries(grouped).map(([type, items]: any) => (
          <div key={type} className="bg-background border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[type]}`}>{type}</span>
              <span className="text-xs text-muted-foreground">{items.length} catégorie(s)</span>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {items.map((c: any) => (
                  <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">{c.description || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">Ordre: {c.sort_order}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-secondary text-muted-foreground"}`}>
                        {c.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setModal(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-2xl border border-border w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="font-semibold text-foreground">{modal === "new" ? "Nouvelle catégorie" : "Modifier la catégorie"}</h3>
                <button onClick={() => setModal(null)} className="p-1.5 hover:bg-secondary rounded-lg"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Nom", key: "name", type: "text" },
                  { label: "Slug", key: "slug", type: "text" },
                  { label: "Description", key: "description", type: "text" },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
                    <input type={type} value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
                      <option value="product">Produit</option>
                      <option value="blog">Blog</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Ordre</label>
                    <input type="number" value={form.sort_order}
                      onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="is_active" checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 text-primary rounded" />
                  <label htmlFor="is_active" className="text-sm text-foreground">Catégorie active</label>
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
