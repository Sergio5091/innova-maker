"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Plus, X, Upload, ImagePlus, Star } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  short_description: "",
  price: "",
  currency: "FCFA",
  category_id: "",
  sku: "",
  stock_quantity: 0,
  stock_status: "in_stock",
  badge: "",
  images: [] as string[],
  features: [] as string[],
  is_featured: false,
  is_active: true,
}

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", UPLOAD_PRESET)
  formData.append("folder", "inovamakers/products")
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  })
  if (!res.ok) throw new Error("Échec de l'upload image")
  const data = await res.json()
  return data.secure_url
}

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [newFeature, setNewFeature] = useState("")
  // index des images en cours d'upload (pour afficher le spinner)
  const [uploadingIndexes, setUploadingIndexes] = useState<number[]>([])
  // stocke les blob URLs pour ne pas les révoquer trop tôt
  const blobUrls = useRef<string[]>([])

  useEffect(() => {
    api.get("/admin/categories")
      .then((res) => setCategories((res.data || []).filter((c: any) => c.type === "product")))
      .catch(console.error)
    // Cleanup blobs à la destruction du composant
    return () => { blobUrls.current.forEach(URL.revokeObjectURL) }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    setForm((prev) => ({ ...prev, name, slug }))
  }

  const uploadImage = async (file: File, targetIndex: number) => {
    // Preview via FileReader (data URL, compatible Edge/Chrome)
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setForm((prev) => {
          const images = [...prev.images]
          images[targetIndex] = ev.target!.result as string
          return { ...prev, images }
        })
      }
    }
    reader.readAsDataURL(file)

    setUploadingIndexes((prev) => [...prev, targetIndex])
    try {
      const cloudUrl = await uploadToCloudinary(file)
      setForm((prev) => {
        const images = [...prev.images]
        images[targetIndex] = cloudUrl
        return { ...prev, images }
      })
    } catch (err) {
      setError("Erreur upload image")
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== targetIndex),
      }))
    } finally {
      setUploadingIndexes((prev) => prev.filter((i) => i !== targetIndex))
    }
  }

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadImage(file, 0)
    e.target.value = ""
  }

  const handleExtraImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const nextIndex = form.images.length
    uploadImage(file, nextIndex)
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
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
    if (uploadingIndexes.length > 0) {
      setError("Attendez la fin des uploads avant de soumettre")
      return
    }
    setSaving(true)
    setError("")
    try {
      await api.post("/admin/products", {
        ...form,
        price: Number(form.price),
        category_id: Number(form.category_id),
        stock_quantity: Number(form.stock_quantity),
      })
      router.push("/admin/products")
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création")
    } finally {
      setSaving(false)
    }
  }

  const mainImage = form.images[0]
  const extraImages = form.images.slice(1)
  const isUploadingMain = uploadingIndexes.includes(0)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nouveau produit</h1>
          <p className="text-sm text-muted-foreground">Créer un nouveau produit dans la boutique</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Informations générales */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Informations générales</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom *</label>
              <input name="name" required value={form.name} onChange={handleNameChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                placeholder="Écran LED P4" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Slug *</label>
              <input name="slug" required value={form.slug} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                placeholder="ecran-led-p4" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description courte</label>
            <input name="short_description" value={form.short_description} onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
              placeholder="Résumé en une phrase" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description complète</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="Description détaillée du produit..." />
          </div>
        </div>

        {/* Images */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-5">
          <h2 className="font-semibold text-foreground">Images</h2>

          {/* Image principale */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Image principale <span className="text-primary">*</span>
            </label>
            <div className="flex gap-4 items-start">
              {/* Zone preview */}
              <div className="w-32 h-32 rounded-xl border-2 border-dashed border-border bg-secondary/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                {mainImage ? (
                  <div className="relative w-full h-full group">
                    <img src={mainImage} alt="principale" className="w-full h-full object-cover rounded-xl" />
                    {isUploadingMain && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-xl gap-1">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                        <span className="text-white text-xs">Upload...</span>
                      </div>
                    )}
                    {!isUploadingMain && (
                      <button type="button" onClick={() => removeImage(0)}
                        className="absolute top-1 right-1 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-2">
                    <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">Principale</span>
                  </div>
                )}
              </div>

              {/* Bouton upload */}
              <div className="flex-1">
                <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors ${isUploadingMain ? "opacity-50 pointer-events-none" : ""}`}>
                  <Upload className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {isUploadingMain ? "Upload en cours..." : mainImage ? "Changer l'image principale" : "Uploader l'image principale"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} />
                </label>
                <p className="text-xs text-muted-foreground mt-2">JPG, PNG, WebP — max 10MB</p>
              </div>
            </div>
          </div>

          {/* Images supplémentaires */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Images supplémentaires <span className="text-muted-foreground font-normal">(optionnel)</span>
            </label>

            {extraImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {extraImages.map((url, i) => {
                  const realIndex = i + 1
                  const isUploading = uploadingIndexes.includes(realIndex)
                  return (
                    <div key={`${url}-${i}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                      <img src={url} alt={`extra-${i}`} className={`w-full h-full object-cover ${isUploading ? "opacity-60" : ""}`} />
                      {isUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      ) : (
                        <button type="button" onClick={() => removeImage(realIndex)}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3 text-white" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors w-fit">
              <Plus className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Ajouter une image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleExtraImageUpload} />
            </label>
          </div>
        </div>

        {/* Prix & Stock */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Prix & Stock</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Prix *</label>
              <input name="price" type="number" required min="0" value={form.price} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                placeholder="250000" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Devise</label>
              <select name="currency" value={form.currency} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
                <option value="FCFA">FCFA</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                placeholder="IM-LED-001" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Quantité en stock</label>
              <input name="stock_quantity" type="number" min="0" value={form.stock_quantity} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Statut stock</label>
              <select name="stock_status" value={form.stock_status} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
                <option value="in_stock">En stock</option>
                <option value="out_of_stock">Rupture de stock</option>
                <option value="on_backorder">Sur commande</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catégorie & Options */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Catégorie & Options</h2>
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
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label>
              <input name="badge" value={form.badge} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                placeholder="Nouveau, Populaire, Premium..." />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 rounded" />
              <span className="text-sm text-foreground flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500" /> Produit en vedette
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 rounded" />
              <span className="text-sm text-foreground">Produit actif</span>
            </label>
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Caractéristiques</h2>
          <div className="flex gap-2">
            <input value={newFeature} onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
              placeholder="Ex: Résolution 4K, Étanche IP65..." />
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
          <Button type="submit" disabled={saving || uploadingIndexes.length > 0}
            className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Création...</> : "Créer le produit"}
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="outline">Annuler</Button>
          </Link>
          {uploadingIndexes.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Upload en cours, veuillez patienter...
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
