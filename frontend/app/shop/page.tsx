"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, Monitor, Clock, Sun, Home, Cpu, Package, ArrowRight } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CtaBand, PageHero, Section } from "@/components/site/layout"
import { inputClass } from "@/components/site/form"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

const categoryIcons: Record<string, any> = { led: Monitor, clocks: Clock, solar: Sun, domotics: Home, iot: Cpu }

function toArray(v: any): string[] {
  if (Array.isArray(v)) return v
  if (typeof v === "string") { try { return JSON.parse(v) || [] } catch { return [] } }
  return []
}

export default function ShopPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.get("/categories?type=product").then((res) => setCategories(res.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(false)
    const url = selectedCategory === "all" ? "/products?limit=50" : `/products?category=${selectedCategory}&limit=50`
    api.get(url)
      .then((res) => setProducts(res.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [selectedCategory])

  const q = searchQuery.trim().toLowerCase()
  const filtered = products.filter((p) =>
    !q || p.name.toLowerCase().includes(q) || (p.short_description || p.description || "").toLowerCase().includes(q),
  )

  const chip = (active: boolean) =>
    cn(
      "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
      active ? "border-primary bg-primary text-white" : "border-border bg-white text-foreground/75 hover:border-primary/50 hover:text-foreground",
    )

  return (
    <main>
      <Navigation />

      <PageHero
        eyebrow="Boutique"
        title="Nos équipements"
        description="Écrans LED, kits solaires, modules domotiques et objets connectés. Chaque produit peut être fourni seul ou avec installation : demandez un devis."
        breadcrumb={[{ label: "Boutique" }]}
      />

      <Section tone="muted" className="py-12 lg:py-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedCategory("all")} className={chip(selectedCategory === "all")}>Tous les produits</button>
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] || Package
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.slug)} className={chip(selectedCategory === cat.slug)}>
                  <Icon className="h-4 w-4" /> {cat.name}
                </button>
              )
            })}
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher un produit"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(inputClass, "pl-11")}
              aria-label="Rechercher un produit"
            />
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-white">
                  <div className="aspect-[4/3] bg-secondary" />
                  <div className="space-y-3 p-6">
                    <div className="h-4 w-3/4 rounded bg-secondary" />
                    <div className="h-3 w-full rounded bg-secondary" />
                    <div className="h-5 w-1/3 rounded bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-20 text-center">
              <Package className="mx-auto h-10 w-10 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-semibold text-foreground">
                {error ? "Le catalogue est momentanément indisponible" : "Aucun produit trouvé"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                {error
                  ? "Réessayez dans quelques instants ou contactez-nous directement."
                  : q ? "Essayez un autre mot-clé ou une autre catégorie." : "Notre catalogue en ligne arrive bientôt. Contactez-nous pour connaître les équipements disponibles."}
              </p>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Nous contacter <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => {
                const Icon = categoryIcons[product.category_slug] || Package
                const image = toArray(product.images)[0]
                return (
                  <Link
                    key={product.id}
                    href={`/shop/produit?slug=${product.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-secondary">
                      {image ? (
                        <img src={image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      ) : (
                        <Icon className="h-12 w-12 text-primary/40" />
                      )}
                      {product.badge && (
                        <span className="absolute left-4 top-4 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">{product.badge}</span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.category_name}</p>
                      <h3 className="mt-2 font-semibold text-foreground line-clamp-2 group-hover:text-primary">{product.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{product.short_description || product.description}</p>
                      <p className="mt-auto pt-5 text-lg font-semibold text-foreground">
                        {Number(product.price).toLocaleString("fr-FR")} <span className="text-sm font-normal text-muted-foreground">{product.currency || "FCFA"}</span>
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </Section>

      <CtaBand title="Besoin d'une solution sur mesure ?" description="Nous dimensionnons et installons l'équipement adapté à votre projet." />
      <Footer />
    </main>
  )
}
