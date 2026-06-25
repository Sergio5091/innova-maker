"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  ShoppingCart, Filter, Search, Star, ArrowRight,
  Monitor, Clock, Sun, Home, Cpu, Package
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import Link from "next/link"

const categoryIcons: Record<string, any> = {
  led: Monitor,
  clocks: Clock,
  solar: Sun,
  domotics: Home,
  iot: Cpu,
}

export default function ShopPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/categories?type=product"),
          api.get("/products?limit=50"),
        ])
        setCategories(catRes.data || [])
        setProducts(prodRes.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Re-fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategory === "all"
          ? "/products?limit=50"
          : `/products?category=${selectedCategory}&limit=50`
        const res = await api.get(url)
        setProducts(res.data || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchProducts()
  }, [selectedCategory])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.short_description || product.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const getCategoryIcon = (slug: string) => {
    return categoryIcons[slug] || Package
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A4DFF08_1px,transparent_1px),linear-gradient(to_bottom,#0A4DFF08_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <ShoppingCart className="w-4 h-4" />
              Boutique INOVA
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Nos <span className="text-primary">produits</span> technologiques
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Découvrez notre gamme de produits innovants : écrans LED, kits solaires, modules domotiques et solutions IoT.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Filters */}
          <div className="flex flex-col gap-4 mb-12">
            {/* Search */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                <Filter className="w-4 h-4" />
                Tous les produits
              </button>

              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.slug)
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat.slug
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:text-foreground border border-border"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-background rounded-2xl border border-border overflow-hidden animate-pulse">
                  <div className="aspect-square bg-secondary/50" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-secondary rounded w-3/4" />
                    <div className="h-3 bg-secondary rounded w-full" />
                    <div className="h-3 bg-secondary rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => {
                  const Icon = getCategoryIcon(product.category_slug || "")
                  const images = Array.isArray(product.images)
                    ? product.images
                    : typeof product.images === "string"
                    ? JSON.parse(product.images || "[]")
                    : []

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                      className="group bg-background rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all"
                    >
                      <Link href={`/shop/${product.slug}`} className="block">
                      {/* Image */}
                      <div className="relative aspect-square bg-secondary/50 flex items-center justify-center overflow-hidden">
                        {product.badge && (
                          <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                            {product.badge}
                          </span>
                        )}
                        {images[0] ? (
                          <img
                            src={images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Icon className="w-10 h-10 text-primary" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {product.short_description || product.description}
                        </p>

                        {/* Rating */}
                        {product.rating > 0 && (
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-medium text-foreground">
                                {Number(product.rating).toFixed(1)}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ({product.review_count} avis)
                            </span>
                          </div>
                        )}

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-foreground">
                              {Number(product.price).toLocaleString("fr-FR")}
                            </span>
                            <span className="text-sm text-muted-foreground ml-1">
                              {product.currency || "FCFA"}
                            </span>
                          </div>
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <ShoppingCart className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucun produit trouvé</h3>
                  <p className="text-muted-foreground">Essayez de modifier vos critères de recherche.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-foreground">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-background mb-6">
              Besoin d&apos;une solution personnalisée ?
            </h2>
            <p className="text-lg text-background/70 max-w-2xl mx-auto mb-10">
              Contactez notre équipe pour discuter de vos besoins spécifiques et obtenir un devis sur mesure.
            </p>
            <Link href="/quote">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14">
                Demander un devis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
