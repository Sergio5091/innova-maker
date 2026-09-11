"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Calendar, Clock, User, Tag, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

export default function BlogPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [catRes, artRes] = await Promise.all([
          api.get("/categories?type=blog"),
          api.get("/articles?limit=20"),
        ])
        setCategories(catRes.data || [])
        setArticles(artRes.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const url = selectedCategory === "all"
          ? "/articles?limit=20"
          : `/articles?category=${selectedCategory}&limit=20`
        const res = await api.get(url)
        setArticles(res.data || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchArticles()
  }, [selectedCategory])

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const featuredArticles = filteredArticles.filter((a) => a.is_featured)
  const regularArticles = filteredArticles.filter((a) => !a.is_featured)

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setNewsletterStatus("loading")
    try {
      await api.post("/newsletter", { email })
      setNewsletterStatus("success")
      setEmail("")
    } catch (err) {
      setNewsletterStatus("error")
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A4DFF08_1px,transparent_1px),linear-gradient(to_bottom,#0A4DFF08_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Blog INOVA
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Actualités et <span className="text-primary">insights</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Restez informé des dernières tendances en innovation technologique, énergie solaire, domotique et affichage LED.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-background"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                Tous
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-background rounded-2xl border border-border overflow-hidden animate-pulse">
                  <div className="aspect-video bg-secondary/50" />
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
              {featuredArticles.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-foreground mb-8">Articles à la une</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {featuredArticles.map((article, index) => (
                      <motion.article
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="group bg-background rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all"
                      >
                        <Link href={`/blog/${article.slug}`} className="block">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                          {article.featured_image ? (
                            <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="text-center">
                              <Tag className="w-12 h-12 text-primary mx-auto mb-2" />
                              <span className="text-sm text-primary font-medium">{article.category_name}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-8">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(article.published_at)}
                            </span>
                            {article.read_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {article.read_time} min
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">{article.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="w-4 h-4" />
                              {article.author_name}
                            </span>
                            <span className="flex items-center gap-1 text-sm font-medium text-primary">
                              Lire l&apos;article
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}

              {regularArticles.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-8">Tous les articles</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularArticles.map((article, index) => (
                      <motion.article
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                        className="group bg-background rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-xl transition-all"
                      >
                        <Link href={`/blog/${article.slug}`} className="block">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            {article.category_name}
                          </span>
                          {article.read_time && (
                            <span className="text-xs text-muted-foreground">{article.read_time} min</span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{formatDate(article.published_at)}</span>
                          <span className="flex items-center gap-1 text-primary font-medium">
                            Lire <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}

              {filteredArticles.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucun article trouvé</h3>
                  <p className="text-muted-foreground">Essayez de modifier vos critères de recherche.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Restez informé
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Inscrivez-vous à notre newsletter pour recevoir nos derniers articles et actualités.
            </p>
            {newsletterStatus === "success" ? (
              <p className="text-primary-foreground font-medium text-lg">✅ Inscription confirmée !</p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 max-w-sm"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={newsletterStatus === "loading"}
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  {newsletterStatus === "loading" ? "Inscription..." : "S'inscrire"}
                </Button>
              </form>
            )}
            {newsletterStatus === "error" && (
              <p className="text-red-200 mt-3 text-sm">Une erreur est survenue. Réessayez.</p>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
