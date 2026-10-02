"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Star, Package, CheckCircle,
  AlertCircle, Clock, ChevronLeft, ChevronRight, ArrowRight
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

// Page statique : le slug est passé en paramètre (?slug=...) pour rester compatible avec output: "export"
export default function ProductDetailPage() {
  return (
    <Suspense fallback={null}>
      <ProductDetailPageContent />
    </Suspense>
  )
}

function ProductDetailPageContent() {
  const slug = useSearchParams().get("slug")
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return }
    api.get(`/products/${encodeURIComponent(slug)}`)
      .then((res) => setProduct(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  const images: string[] = product?.images
    ? (Array.isArray(product.images) ? product.images : JSON.parse(product.images || "[]"))
    : []

  const features: string[] = product?.features
    ? (Array.isArray(product.features) ? product.features : JSON.parse(product.features || "[]"))
    : []

  const stockLabel = {
    in_stock: { label: "En stock", icon: CheckCircle, color: "text-emerald-500" },
    out_of_stock: { label: "Rupture de stock", icon: AlertCircle, color: "text-destructive" },
    on_backorder: { label: "Sur commande", icon: Clock, color: "text-amber-500" },
  }[product?.stock_status as string] || { label: "—", icon: Package, color: "text-muted-foreground" }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-secondary rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-secondary rounded w-3/4" />
              <div className="h-4 bg-secondary rounded w-1/3" />
              <div className="h-10 bg-secondary rounded w-1/2" />
              <div className="h-4 bg-secondary rounded w-full" />
              <div className="h-4 bg-secondary rounded w-5/6" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (notFound || !product) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-16 text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Produit introuvable</h1>
          <p className="text-muted-foreground mb-6">Ce produit n'existe pas ou a été supprimé.</p>
          <Link href="/shop">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Retour à la boutique
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/shop" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Boutique
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Galerie images */}
            <div className="space-y-4"
            >
              {/* Image principale */}
              <div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden border border-border">
                {images.length > 0 ? (
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-muted-foreground/30" />
                  </div>
                )}

                {product.badge && (
                  <span className="absolute top-4 left-4 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                    {product.badge}
                  </span>
                )}

                {/* Navigation flèches si plusieurs images */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full border border-border shadow transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full border border-border shadow transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Miniatures */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === i
                          ? "border-primary scale-105 shadow-md"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Infos produit */}
            <div className="space-y-6"
            >
              {/* Catégorie */}
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
                {product.category_name}
              </p>

              {/* Nom */}
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                {product.name}
              </h1>

              {/* Note */}
              {product.rating > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-5 h-5 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">{Number(product.rating).toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({product.review_count} avis)</span>
                </div>
              )}

              {/* Prix */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight text-foreground">
                  {Number(product.price).toLocaleString("fr-FR")}
                </span>
                <span className="text-xl text-muted-foreground">{product.currency || "FCFA"}</span>
              </div>

              {/* Stock */}
              <div className={`flex items-center gap-2 text-sm font-medium ${stockLabel.color}`}>
                <stockLabel.icon className="w-4 h-4" />
                {stockLabel.label}
                {product.stock_status === "in_stock" && product.stock_quantity > 0 && (
                  <span className="text-muted-foreground font-normal">— {product.stock_quantity} disponibles</span>
                )}
              </div>

              {/* Description courte */}
              {product.short_description && (
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {product.short_description}
                </p>
              )}

              {/* Description complète */}
              {product.description && (
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Caractéristiques */}
              {features.length > 0 && (
                <div className="bg-secondary/30 rounded-xl p-5">
                  <h3 className="font-semibold text-foreground mb-3">Caractéristiques</h3>
                  <ul className="space-y-2">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SKU */}
              {product.sku && (
                <p className="text-xs text-muted-foreground">Réf : {product.sku}</p>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href={`/quote?product=${product.slug}`} className="flex-1">
                  <Button size="lg" className="w-full h-12">
                    Demander un devis pour ce produit
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="h-12 px-6">
                    Nous contacter
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Retour boutique */}
      <section className="py-12 bg-secondary/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <Link href="/shop">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la boutique
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
