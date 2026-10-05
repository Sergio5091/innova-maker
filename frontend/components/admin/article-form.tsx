"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Upload, ImagePlus, X } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { RichEditor } from "@/components/ui/rich-editor"

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
  if (!res.ok) throw new Error("Échec upload")
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

export function ArticleForm({ articleId }: { articleId?: string | null }) {
  const isEdit = Boolean(articleId)
  const [loadingArticle, setLoadingArticle] = useState(isEdit)
  const router = useRouter()
  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [uploadingCover, setUploadingCover] = useState(false)
  const coverBlobRef = useRef<string | null>(null)

  useEffect(() => {
    api.get("/admin/categories")
      .then((res) => setCategories((res.data || []).filter((c: any) => c.type === "blog")))
      .catch(console.error)
    return () => {
      if (coverBlobRef.current) URL.revokeObjectURL(coverBlobRef.current)
    }
  }, [])

  useEffect(() => {
    if (!articleId) return
    api.get(`/admin/articles/${articleId}`)
      .then((res) => {
        const a = res.data
        setForm({
          title: a.title || "",
          slug: a.slug || "",
          excerpt: a.excerpt || "",
          content: a.content || "",
          category_id: a.category_id ? String(a.category_id) : "",
          author_name: a.author_name || "",
          author_email: a.author_email || "",
          featured_image: a.featured_image || "",
          read_time: a.read_time ? String(a.read_time) : "",
          is_featured: Boolean(a.is_featured),
          is_published: Boolean(a.is_published),
        })
      })
      .catch((err) => setError(err.message || "Article introuvable"))
      .finally(() => setLoadingArticle(false))
  }, [articleId])

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

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview via FileReader (data URL, compatible tous navigateurs)
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setForm((prev) => ({ ...prev, featured_image: ev.target!.result as string }))
      }
    }
    reader.readAsDataURL(file)

    setUploadingCover(true)
    try {
      const url = await uploadToCloudinary(file)
      setForm((prev) => ({ ...prev, featured_image: url }))
    } catch {
      setError("Erreur upload image de couverture")
      setForm((prev) => ({ ...prev, featured_image: "" }))
    } finally {
      setUploadingCover(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadingCover) {
      setError("Attendez la fin de l'upload avant de soumettre")
      return
    }
    setSaving(true)
    setError("")
    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        read_time: form.read_time ? Number(form.read_time) : null,
      }
      if (isEdit) await api.put(`/admin/articles/${articleId}`, payload)
      else await api.post("/admin/articles", payload)
      router.push("/admin/articles")
    } catch (err: any) {
      setError(err.message || (isEdit ? "Erreur lors de l'enregistrement" : "Erreur lors de la création"))
    } finally {
      setSaving(false)
    }
  }

  if (loadingArticle) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-12">
        <Loader2 className="w-5 h-5 animate-spin" /> Chargement de l'article...
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/articles" className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEdit ? "Modifier l'article" : "Nouvel article"}</h1>
          <p className="text-sm text-muted-foreground">{isEdit ? form.title : "Créer un nouvel article pour le blog"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Titre & Slug */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Titre</h2>
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
              placeholder="Résumé affiché dans la liste du blog..." />
          </div>
        </div>

        {/* Image de couverture */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Image de couverture</h2>
          <p className="text-xs text-muted-foreground -mt-2">Affichée dans la liste du blog et en haut de l'article</p>

          <div className="flex gap-4 items-start">
            {/* Preview */}
            <div className="w-40 h-28 rounded-xl border-2 border-dashed border-border bg-secondary/30 flex items-center justify-center overflow-hidden flex-shrink-0">
              {form.featured_image ? (
                <div className="relative w-full h-full group">
                  <img src={form.featured_image} alt="couverture"
                    className="w-full h-full object-cover rounded-xl" />
                  {uploadingCover && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-xl gap-1">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                      <span className="text-white text-xs">Upload...</span>
                    </div>
                  )}
                  {!uploadingCover && (
                    <button type="button"
                      onClick={() => setForm((p) => ({ ...p, featured_image: "" }))}
                      className="absolute top-1 right-1 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center p-2">
                  <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                  <span className="text-xs text-muted-foreground">Couverture</span>
                </div>
              )}
            </div>

            {/* Bouton upload */}
            <div className="flex-1">
              <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors ${uploadingCover ? "opacity-50 pointer-events-none" : ""}`}>
                <Upload className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {uploadingCover ? "Upload vers Cloudinary..."
                    : form.featured_image ? "Changer l'image de couverture"
                    : "Uploader l'image de couverture"}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </label>
              <p className="text-xs text-muted-foreground mt-2">JPG, PNG, WebP — max 10MB</p>
            </div>
          </div>
        </div>

        {/* Éditeur de contenu */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Contenu de l'article</h2>
            <p className="text-xs text-muted-foreground">Cliquez sur l'icône image dans la barre pour insérer une image dans le texte</p>
          </div>
          <RichEditor
            value={form.content}
            onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
            placeholder="Commencez à écrire votre article..."
          />
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
              <span className="text-sm text-foreground">{isEdit ? "Publié" : "Publier immédiatement"}</span>
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{error}</p>}

        <div className="flex items-center gap-4 pb-8">
          <Button type="submit" disabled={saving || uploadingCover}
            className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {saving
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {isEdit ? "Enregistrement..." : "Création..."}</>
              : isEdit ? "Enregistrer les modifications" : "Créer l'article"}
          </Button>
          <Link href="/admin/articles">
            <Button type="button" variant="outline">Annuler</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
