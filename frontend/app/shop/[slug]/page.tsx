"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  ArrowLeft, Star, ShoppingCart, Check, Package,
  ChevronLeft, ChevronRight, ZoomIn, X
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  useEffect(() => {
    if (!slug) return
    api.get(`/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch(() => router.push("/shop"))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-16 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-secondary rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-secondary rounded w-3/4" />
              <div className="h-4 bg-secondary rounded w-1/2" />
              <div className="h-20 bg-secondary rounded" />
              <div className="h-10 bg-secondary rounded w-1/3" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!product) return null

  const images: string[] = Array.isArray(product.images)
    ? product.images
    : typeof product.images === "string"
    ? JSON.parse(product.images || "[]")
    : []

  const features: string[] = Array.isArray(product.features)
    ? product.features
    : typeof product.features === "string"
    ? JSON.parse(product.features || "[]")
    : []

  const prevImage = () => setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1))
  const nextImage = () => setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/shop" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Boutique
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">

            {/* Galerie images */}
            <div className="space-y-4">
              {/* Image principale */}
              <div className="relative aspect-square bg-secondary/30 rounded-2xl overflow-hidden group">
                {images.length > 0 ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeImage}
                        src={images[activeImage]}
                        alt={product.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full object-cover cursor-zoom-in"
                        onClick={() => setLightbox(true)}
                      />
                    </AnimatePresence>

                    {/* Bouton zoom */}
                    <button
                      onClick={() => setLightbox(true)}
                      className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ZoomIn className="w-4 h-4 text-foreground" />
                    </button>

                    {/* Navigation si plusieurs images */}
                    {images.length > 1 && (
                      <>
                        <button onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        {/* Indicateurs */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {images.map((_, i) => (
                            <button key={i} onClick={() => setActiveImage(i)}
                              className={`w-2 h-2 rounded-full transition-all ${i === activeImage ? "bg-primary w-4" : "bg-white/60"}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-muted-foreground/30" />
                  </div>
                )}

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        i === activeImage ? "border-primary" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Infos produit */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Catégorie */}
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {product.category_name}
              </span>

              {/* Nom */}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{product.name}</h1>

              {/* Note */}
              {product.rating > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i}
                        className={`w-5 h-5 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">{Number(product.rating).toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({product.review_count} avis)</span>
                </div>
              )}

              {/* Prix */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">
                  {Number(product.price).toLocaleString("fr-FR")}
                </span>
                <span className="text-lg text-muted-foreground">{product.currency || "FCFA"}</span>
              </div>

              {/* Description courte */}
              {product.short_description && (
                <p className="text-muted-foreground leading-relaxed">{product.short_description}</p>
              )}

              {/* Stock */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  product.stock_status === "in_stock" ? "bg-emerald-500" :
                  product.stock_status === "out_of_stock" ? "bg-destructive" : "bg-amber-500"
                }`} />
                <span className="text-sm text-muted-foreground">
                  {product.stock_status === "in_stock" ? `En stock (${product.stock_quantity} disponibles)` :
                   product.stock_status === "out_of_stock" ? "Rupture de stock" : "Sur commande"}
                </span>
              </div>

              {/* CTA */}
              <div className="flex gap-4 pt-2">
                <Link href="/quote" className="flex-1">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Demander un devis
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Renseignements
                  </Button>
                </Link>
              </div>

              {/* Caractéristiques */}
              {features.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-4">Caractéristiques</h3>
                  <ul className="grid grid-cols-1 gap-2">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
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
            </motion.div>
          </div>

          {/* Description complète */}
          {product.description && (
            <div className="mt-16 border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Description</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              onClick={() => setLightbox(false)}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage() }}
                  className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextImage() }}
                  className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <motion.img
              key={activeImage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={images[activeImage]}
              alt={product.name}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                {activeImage + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
