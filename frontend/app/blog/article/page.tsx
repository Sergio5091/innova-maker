"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User, FileText } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

// Page statique : le slug est passé en paramètre (?slug=...) pour rester compatible avec output: "export"
export default function ArticleDetailPage() {
  return (
    <Suspense fallback={null}>
      <ArticleDetailPageContent />
    </Suspense>
  )
}

function ArticleDetailPageContent() {
  const slug = useSearchParams().get("slug")
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return }
    api.get(`/articles/${encodeURIComponent(slug)}`)
      .then((res) => setArticle(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric"
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-16 animate-pulse space-y-6">
          <div className="h-6 bg-secondary rounded w-1/4" />
          <div className="h-10 bg-secondary rounded w-3/4" />
          <div className="aspect-video bg-secondary rounded-2xl" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-secondary rounded" style={{ width: `${[92, 85, 97, 88, 80, 94, 86, 90][i]}%` }} />
            ))}
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (notFound || !article) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-16 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Article introuvable</h1>
          <p className="text-muted-foreground mb-6">Cet article n'existe pas ou n'est pas encore publié.</p>
          <Link href="/blog">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Retour au blog
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

      {/* Hero avec image */}
      {article.featured_image && (
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}

      <section className={`pb-16 bg-background ${!article.featured_image ? "pt-32" : "pt-8"}`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/blog" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Blog
            </Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{article.title}</span>
          </nav>

          <article >
            {/* Catégorie */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
                {article.category_name}
              </span>
              {article.is_featured && (
                <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                  À la une
                </span>
              )}
            </div>

            {/* Titre */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-6 leading-tight text-balance">
              {article.title}
            </h1>

            {/* Méta */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author_name}
              </span>
              {article.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.published_at)}
                </span>
              )}
              {article.read_time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {article.read_time} min de lecture
                </span>
              )}
            </div>

            {/* Extrait */}
            {article.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 border-l-2 border-primary pl-6">
                {article.excerpt}
              </p>
            )}

            {/* Contenu */}
            {article.content && (
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            )}
          </article>

          {/* Retour */}
          <div className="mt-16 pt-8 border-t border-border">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour au blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
