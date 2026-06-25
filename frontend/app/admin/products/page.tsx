"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, Plus, Trash2, Pencil, ToggleLeft, ToggleRight, Star } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: "", page: 1 })

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      params.append("page", String(filters.page))
      const res = await api.get(`/admin/products?${params}`)
      setProducts(res.data)
      setPagination(res.pagination)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [filters])

  const handleToggle = async (p: any) => {
    await api.put(`/admin/products/${p.id}`, { ...p, is_active: !p.is_active })
    setProducts(prev => prev.map(item => item.id === p.id ? { ...item, is_active: !item.is_active } : item))
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce produit ?")) return
    await api.delete(`/admin/products/${id}`)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Produits</h1>
          <p className="text-sm text-muted-foreground mt-1">{pagination.total ?? 0} produit(s)</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> Nouveau produit
          </Button>
        </Link>
      </div>

      <div className="bg-background border border-border rounded-2xl p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input placeholder="Rechercher un produit..." value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Produit</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Catégorie</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Prix</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stock</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Vedette</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actif</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-6 bg-secondary/50 rounded animate-pulse" /></td></tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Aucun produit trouvé</td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.sku || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-full text-xs">{p.category_name}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {Number(p.price).toLocaleString("fr-FR")} {p.currency}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.stock_status === "in_stock" ? "bg-emerald-500/10 text-emerald-600" :
                      p.stock_status === "out_of_stock" ? "bg-destructive/10 text-destructive" :
                      "bg-amber-500/10 text-amber-600"
                    }`}>{p.stock_quantity}</span>
                  </td>
                  <td className="px-4 py-3">
                    {p.is_featured ? <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Star className="w-4 h-4 text-muted-foreground" />}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(p)} className="text-muted-foreground hover:text-primary transition-colors">
                      {p.is_active ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${p.id}`} className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-muted-foreground hover:text-primary">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
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
    </div>
  )
}
