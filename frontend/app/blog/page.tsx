"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, FileText, Loader2, Search } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PageHero, Section } from "@/components/site/layout"
import { inputClass } from "@/components/site/form"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : ""

function ArticleCard({ article, large = false }: { article: any; large?: boolean }) {
  return (
    <Link
      href={`/blog/article?slug=${article.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg",
        large && "lg:flex-row",
      )}
    >
      <div className={cn("flex aspect-[16/10] items-center justify-center overflow-hidden bg-secondary", large && "lg:aspect-auto lg:w-1/2")}>
        {article.featured_image ? (
          <img src={article.featured_image} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <FileText className="h-10 w-10 text-primary/40" />
        )}
      </div>
      <div className={cn("flex flex-1 flex-col p-6", large && "lg:p-10")}>
        <p className="text-xs font-medium uppercase tracking-wider text-primary">{article.category_name}</p>
        <h3 className={cn("mt-3 font-semibold text-foreground group-hover:text-primary", large ? "text-2xl lg:text-3xl tracking-tight" : "text-lg line-clamp-2")}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p className={cn("mt-3 leading-relaxed text-muted-foreground", large ? "line-clamp-4" : "text-sm line-clamp-3")}>{article.excerpt}</p>
        )}
        <p className="mt-auto pt-6 text-sm text-muted-foreground">
          {formatDate(article.published_at)}
          {article.read_time ? ` · ${article.read_time} min de lecture` : ""}
        </p>
      </div>
    </Link>
  )
}

export default function BlogPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [newsletter, setNewsletter] = useState<{ status: "idle" | "loading" | "success" | "error"; message?: string }>({ status: "idle" })

  useEffect(() => {
    api.get("/categories?type=blog").then((res) => setCategories(res.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const url = selectedCategory === "all" ? "/articles?limit=20" : `/articles?category=${selectedCategory}&limit=20`
    api.get(url)
      .then((res) => setArticles(res.data || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [selectedCategory])

  const q = searchQuery.trim().toLowerCase()
  const filtered = articles.filter((a) => !q || a.title.toLowerCase().includes(q) || (a.excerpt || "").toLowerCase().includes(q))
  const featured = filtered.find((a) => a.is_featured)
  const others = filtered.filter((a) => a !== featured)

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletter({ status: "loading" })
    try {
      const res = await api.post("/newsletter", { email })
      setNewsletter({ status: "success", message: res.message })
      setEmail("")
    } catch (err: any) {
      setNewsletter({ status: "error", message: err.message || "Inscription impossible, réessayez." })
    }
  }

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
      active ? "border-primary bg-primary text-white" : "border-border bg-white text-foreground/75 hover:border-primary/50 hover:text-foreground",
    )

  return (
    <main>
      <Navigation />

      <PageHero
        eyebrow="Actualités"
        title="Actualités et conseils"
        description="Nos réalisations, nos conseils techniques et l'actualité de l'affichage LED, du solaire, de la domotique et de l'IoT."
        breadcrumb={[{ label: "Actualités" }]}
      />

      <Section tone="muted" className="py-12 lg:py-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedCategory("all")} className={chip(selectedCategory === "all")}>Tous</button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setSelectedCategory(c.slug)} className={chip(selectedCategory === c.slug)}>{c.name}</button>
            ))}
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="search" placeholder="Rechercher un article" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(inputClass, "pl-11")} aria-label="Rechercher un article" />
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-white">
                  <div className="aspect-[16/10] bg-secondary" />
                  <div className="space-y-3 p-6"><div className="h-3 w-1/4 rounded bg-secondary" /><div className="h-5 w-3/4 rounded bg-secondary" /><div className="h-3 w-full rounded bg-secondary" /></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-20 text-center">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-semibold text-foreground">{q ? "Aucun article trouvé" : "Nos premiers articles arrivent bientôt"}</h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                {q ? "Essayez un autre mot-clé." : "Inscrivez-vous ci-dessous pour être prévenu de nos prochaines publications."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {featured && <ArticleCard article={featured} large />}
              {others.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {others.map((a) => <ArticleCard key={a.id} article={a} />)}
                </div>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* Newsletter */}
      <section className="bg-ink">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-16 lg:grid-cols-2 lg:px-8">
          <div className="text-white">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Recevez nos actualités</h2>
            <p className="mt-2 text-white/70">Un email de temps en temps, avec nos réalisations et nos conseils. Désinscription en un clic.</p>
          </div>
          <form onSubmit={handleNewsletter} className="flex flex-col gap-3 sm:flex-row">
            <input type="email" required placeholder="Votre adresse email" value={email} onChange={(e) => setEmail(e.target.value)}
              className={cn(inputClass, "flex-1 border-transparent")} aria-label="Adresse email" />
            <Button type="submit" disabled={newsletter.status === "loading"} className="h-12 px-6">
              {newsletter.status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <>S'inscrire <ArrowRight className="ml-1 h-4 w-4" /></>}
            </Button>
          </form>
          {newsletter.message && (
            <p className={cn("text-sm lg:col-start-2", newsletter.status === "error" ? "text-red-300" : "text-emerald-300")}>{newsletter.message}</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
