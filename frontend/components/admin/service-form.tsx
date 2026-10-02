"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Plus, X } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

const emptyForm = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  category_id: "",
  icon: "",
  color: "",
  bg_color: "",
  delivery_time: "",
  sort_order: 0,
  features: [] as string[],
  is_active: true,
}

function toArray(v: any): string[] {
  if (Array.isArray(v)) return v
  if (typeof v === "string") { try { return JSON.parse(v) || [] } catch { return [] } }
  return []
}

const inputClass = "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
const labelClass = "text-xs font-medium text-muted-foreground mb-1 block"

export function ServiceForm({ serviceId }: { serviceId?: string | null }) {
  const isEdit = Boolean(serviceId)
  const router = useRouter()
  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState<any[]>([])
  const [loadingService, setLoadingService] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    api.get("/admin/categories")
      .then((res) => setCategories((res.data || []).filter((c: any) => c.type === "service")))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!serviceId) return
    api.get(`/admin/services/${serviceId}`)
      .then((res) => {
        const s = res.data
        setForm({
          name: s.name || "",
          slug: s.slug || "",
          short_description: s.short_description || "",
          description: s.description || "",
          category_id: s.category_id ? String(s.category_id) : "",
          icon: s.icon || "",
          color: s.color || "",
          bg_color: s.bg_color || "",
          delivery_time: s.delivery_time || "",
          sort_order: s.sort_order ?? 0,
          features: toArray(s.features),
          is_active: Boolean(s.is_active),
        })
      })
      .catch((err) => setError(err.message || "Service introuvable"))
      .finally(() => setLoadingService(false))
  }, [serviceId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    // En édition, on ne régénère pas le slug : les pages /engineering, /domotics, /display en dépendent
    if (isEdit) { setForm((prev) => ({ ...prev, name })); return }
    const slug = name.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    setForm((prev) => ({ ...prev, name, slug }))
  }

  const addFeature = () => {
    if (!newFeature.trim()) return
    setForm((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }))
    setNewFeature("")
  }

  const removeFeature = (index: number) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        sort_order: Number(form.sort_order),
      }
      if (isEdit) await api.put(`/admin/services/${serviceId}`, payload)
      else await api.post("/admin/services", payload)
      router.push("/admin/services")
    } catch (err: any) {
      setError(err.message || (isEdit ? "Erreur lors de l'enregistrement" : "Erreur lors de la création"))
    } finally {
      setSaving(false)
    }
  }

  if (loadingService) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-12">
        <Loader2 className="w-5 h-5 animate-spin" /> Chargement du service...
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/services" className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEdit ? "Modifier le service" : "Nouveau service"}</h1>
          <p className="text-sm text-muted-foreground">{isEdit ? form.name : "Ajouter un service proposé par INOVA Makers"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Informations générales</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nom *</label>
              <input name="name" required value={form.name} onChange={handleNameChange} className={inputClass} placeholder="Ingénierie" />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input name="slug" required value={form.slug} onChange={handleChange} className={inputClass} placeholder="engineering" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description courte</label>
            <input name="short_description" value={form.short_description} onChange={handleChange} className={inputClass}
              placeholder="Résumé affiché dans les cartes" />
          </div>
          <div>
            <label className={labelClass}>Description complète</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} className={`${inputClass} resize-none`}
              placeholder="Description affichée en haut de la page du service..." />
          </div>
        </div>

        <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Catégorie & Options</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Catégorie *</label>
              <select name="category_id" required value={form.category_id} onChange={handleChange} className={inputClass}>
                <option value="">Sélectionner une catégorie</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Délai de réalisation</label>
              <input name="delivery_time" value={form.delivery_time} onChange={handleChange} className={inputClass} placeholder="2 à 4 semaines" />
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Icône</label>
              <input name="icon" value={form.icon} onChange={handleChange} className={inputClass} placeholder="cpu" />
            </div>
            <div>
              <label className={labelClass}>Couleur</label>
              <input name="color" value={form.color} onChange={handleChange} className={inputClass} placeholder="blue-500" />
            </div>
            <div>
              <label className={labelClass}>Couleur de fond</label>
              <input name="bg_color" value={form.bg_color} onChange={handleChange} className={inputClass} placeholder="blue-500/10" />
            </div>
            <div>
              <label className={labelClass}>Ordre</label>
              <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 rounded" />
            <span className="text-sm text-foreground">Service actif</span>
          </label>
        </div>

        <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Prestations incluses</h2>
          <div className="flex gap-2">
            <input value={newFeature} onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              className={`flex-1 ${inputClass}`} placeholder="Ex: Développement IoT, Audit énergétique..." />
            <Button type="button" onClick={addFeature} variant="outline" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {form.features.length > 0 && (
            <ul className="space-y-2">
              {form.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm bg-secondary/50 rounded-lg px-3 py-2">
                  <span className="flex-1 text-foreground">{f}</span>
                  <button type="button" onClick={() => removeFeature(i)} className="text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{error}</p>}

        <div className="flex items-center gap-4 pb-8">
          <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {saving
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {isEdit ? "Enregistrement..." : "Création..."}</>
              : isEdit ? "Enregistrer les modifications" : "Créer le service"}
          </Button>
          <Link href="/admin/services">
            <Button type="button" variant="outline">Annuler</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
