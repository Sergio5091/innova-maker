"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, Plus, Trash2, Pencil, ToggleLeft, ToggleRight, Star } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: "", published: "", page: 1 })

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      if (filters.published !== "") params.append("published", filters.published)
      params.append("page", String(filters.page))
      const res = await api.get(`/admin/articles?${params}`)
      setArticles(res.data)
      setPagination(res.pagination)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchArticles() }, [filters])

  const handleTogglePublish = async (a: any) => {
    const res = await api.patch(`/admin/articles/${a.id}/publish`, {})
    setArticles(prev => prev.map(item => item.id === a.id ? { ...item, is_published: res.is_published } : item))
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet article ?")) return
    await api.delete(`/admin/articles/${id}`)
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Articles</h1>
          <p className="text-sm text-muted-foreground mt-1">{pagination.total ?? 0} article(s)</p>
        </div>
        <Link href="/admin/articles/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> Nouvel article
          </Button>
        </Link>
      </div>

      <div className="bg-background border border-border rounded-2xl p-4 flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input placeholder="Rechercher..." value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
        </div>
        <select value={filters.published} onChange={(e) => setFilters({ ...filters, published: e.target.value, page: 1 })}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
          <option value="">Tous</option>
          <option value="true">Publiés</option>
          <option value="false">Brouillons</option>
        </select>
      </div>

      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Article</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Catégorie</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Auteur</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Lecture</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Publié</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-6 bg-secondary/50 rounded animate-pulse" /></td></tr>
                ))
              ) : articles.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Aucun article trouvé</td></tr>
              ) : articles.map((a) => (
                <tr key={a.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground max-w-[200px] truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-full text-xs">{a.category_name}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{a.author_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.read_time ? `${a.read_time} min` : "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleTogglePublish(a)} className="transition-colors">
                      {a.is_published
                        ? <ToggleRight className="w-6 h-6 text-emerald-500" />
                        : <ToggleLeft className="w-6 h-6 text-muted-foreground" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/articles/edit?id=${a.id}`} className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-muted-foreground hover:text-primary">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(a.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
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
