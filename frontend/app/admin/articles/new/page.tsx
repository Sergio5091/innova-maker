"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Plus, X, Upload, ImagePlus } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", UPLOAD_PRESET)
  formData.append("folder", "inovamakers/articles")
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  })
  if (!res.ok) throw new Error("Échec de l'upload image")
  const data = await res.json()
  return data.secure_url
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category_id: "",
  author_name: "",
  author_email: "",
  featured_image: "",
  read_time: "",
  is_featured: false,
  is_published: false,
}

export default function NewArticlePage() {
  const router = useRouter()
  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    api.get("/admin/categories")
      .then((res) => setCategories((res.data || []).filter((c: any) => c.type === "blog")))
      .catch(console.error)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    setForm((prev) => ({ ...prev, title, slug }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const blobUrl = URL.createObjectURL(file)
    setForm((prev) => ({ ...prev, featured_image: blobUrl }))
    setUploadingImage(true)
    try {
      const url = await uploadToCloudinary(file)
      setForm((prev) => ({ ...prev, featured_image: url }))
    } catch (err) {
      setError("Erreur upload image")
      setForm((prev) => ({ ...prev, featured_image: "" }))
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadingImage) {
      setError("Attendez la fin de l'upload avant de soumettre")
      return
    }
    setSaving(true)
    setError("")
    try {
      await api.post("/admin/articles", {
        ...form,
        category_id: Number(form.category_id),
        read_time: form.read_time ? Number(form.read_time) : null,
      })
      router.push("/admin/articles")
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/articles" className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nouvel article</h1>
          <p className="text-sm text-muted-foreground">Créer un nouvel article pour le blog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Infos principales */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Contenu</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Titre *</label>
              <input name="title" required value={form.title} onChange={handleTitleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                placeholder="Les tendances IoT en 2026" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Slug *</label>
              <input name="slug" required value={form.slug} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                placeholder="tendances-iot-2026" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Extrait / Résumé</label>
            <textarea name="excerpt" rows={3} value={form.excerpt} onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="Résumé de l'article affiché dans la liste..." />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Contenu *</label>
            <textarea name="content" required rows={12} value={form.content} onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary resize-none font-mono"
              placeholder="Contenu complet de l'article..." />
          </div>
        </div>

        {/* Image à la une */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Image à la une</h2>

          <div className="flex gap-4 items-start">
            {/* Preview */}
            <div className="w-32 h-24 rounded-xl border-2 border-dashed border-border bg-secondary/30 flex items-center justify-center overflow-hidden flex-shrink-0">
              {form.featured_image ? (
                <div className="relative w-full h-full group">
                  <img src={form.featured_image} alt="featured" className="w-full h-full object-cover rounded-xl" />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                  {!uploadingImage && (
                    <button type="button" onClick={() => setForm((p) => ({ ...p, featured_image: "" }))}
                      className="absolute top-1 right-1 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center p-2">
                  <ImagePlus className="w-7 h-7 text-muted-foreground mx-auto mb-1" />
                  <span className="text-xs text-muted-foreground">Image</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors ${uploadingImage ? "opacity-50 pointer-events-none" : ""}`}>
                <Upload className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {uploadingImage ? "Upload en cours..." : form.featured_image ? "Changer l'image" : "Uploader une image"}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <p className="text-xs text-muted-foreground mt-2">JPG, PNG, WebP — max 10MB</p>
            </div>
          </div>
        </div>

        {/* Métadonnées */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Métadonnées</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Catégorie *</label>
              <select name="category_id" required value={form.category_id} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
                <option value="">Sélectionner une catégorie</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Temps de lecture (min)</label>
              <input name="read_time" type="number" min="1" value={form.read_time} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                placeholder="5" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom de l'auteur *</label>
              <input name="author_name" required value={form.author_name} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                placeholder="Amadou Diallo" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Email de l'auteur</label>
              <input name="author_email" type="email" value={form.author_email} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                placeholder="auteur@inovamakers.io" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 rounded" />
              <span className="text-sm text-foreground">Article à la une</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} className="w-4 h-4 rounded" />
              <span className="text-sm text-foreground">Publier immédiatement</span>
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{error}</p>}

        <div className="flex items-center gap-4 pb-8">
          <Button type="submit" disabled={saving || uploadingImage}
            className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Création...</> : "Créer l'article"}
          </Button>
          <Link href="/admin/articles">
            <Button type="button" variant="outline">Annuler</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
