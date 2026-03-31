"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Calendar, Clock, User, Tag, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const categories = [
  { id: "all", label: "Tous" },
  { id: "innovation", label: "Innovation" },
  { id: "solar", label: "Énergie Solaire" },
  { id: "domotics", label: "Domotique" },
  { id: "iot", label: "IoT" },
  { id: "led", label: "Affichage LED" },
]

const articles = [
  {
    id: 1,
    title: "Les tendances de l'innovation technologique en 2026",
    excerpt: "Découvrez les technologies qui transforment les entreprises africaines et comment en tirer parti pour votre activité.",
    category: "innovation",
    author: "Amadou Diallo",
    date: "5 Mars 2026",
    readTime: "8 min",
    featured: true,
  },
  {
    id: 2,
    title: "Guide complet de l'énergie solaire pour les entreprises",
    excerpt: "Tout ce que vous devez savoir pour installer des panneaux solaires et réduire vos coûts énergétiques.",
    category: "solar",
    author: "Fatou Sow",
    date: "28 Février 2026",
    readTime: "12 min",
    featured: true,
  },
  {
    id: 3,
    title: "La domotique au service de la sécurité résidentielle",
    excerpt: "Comment les systèmes domotiques modernes protègent votre maison et votre famille.",
    category: "domotics",
    author: "Moussa Ndiaye",
    date: "20 Février 2026",
    readTime: "6 min",
    featured: false,
  },
  {
    id: 4,
    title: "L'IoT industriel : transformer la production africaine",
    excerpt: "L'Internet des Objets révolutionne l'industrie manufacturière en Afrique de l'Ouest.",
    category: "iot",
    author: "Amadou Diallo",
    date: "15 Février 2026",
    readTime: "10 min",
    featured: false,
  },
  {
    id: 5,
    title: "Les écrans LED géants : guide d'achat pour entreprises",
    excerpt: "Comment choisir le bon écran LED pour votre communication visuelle et marketing.",
    category: "led",
    author: "Awa Diop",
    date: "8 Février 2026",
    readTime: "7 min",
    featured: false,
  },
  {
    id: 6,
    title: "Optimiser sa consommation énergétique avec la domotique",
    excerpt: "Stratégies et technologies pour réduire votre facture d'électricité jusqu'à 40%.",
    category: "domotics",
    author: "Fatou Sow",
    date: "1 Février 2026",
    readTime: "9 min",
    featured: false,
  },
  {
    id: 7,
    title: "Smart Cities en Afrique : le rôle de l'affichage numérique",
    excerpt: "Comment les villes africaines utilisent les écrans LED pour améliorer la communication citoyenne.",
    category: "led",
    author: "Moussa Ndiaye",
    date: "25 Janvier 2026",
    readTime: "11 min",
    featured: false,
  },
  {
    id: 8,
    title: "Batteries solaires : stocker l'énergie pour l'autonomie",
    excerpt: "Les meilleures solutions de stockage d'énergie pour vos installations solaires.",
    category: "solar",
    author: "Amadou Diallo",
    date: "18 Janvier 2026",
    readTime: "8 min",
    featured: false,
  },
]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredArticles = filteredArticles.filter(a => a.featured)
  const regularArticles = filteredArticles.filter(a => !a.featured)

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

      {/* Blog Content */}
      <section className="py-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            {/* Search */}
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

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Articles */}
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
                    {/* Article Image Placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="text-center">
                        <Tag className="w-12 h-12 text-primary mx-auto mb-2" />
                        <span className="text-sm text-primary font-medium capitalize">{article.category}</span>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-8">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          {article.author}
                        </span>
                        <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                          Lire l&apos;article
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          {/* Regular Articles */}
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
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize">
                        {article.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{article.readTime}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{article.date}</span>
                      <span className="flex items-center gap-1 text-primary font-medium">
                        Lire
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Aucun article trouvé</h3>
              <p className="text-muted-foreground">Essayez de modifier vos critères de recherche.</p>
            </div>
          )}

          {/* Load More */}
          {filteredArticles.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Charger plus d&apos;articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Input
                type="email"
                placeholder="Votre adresse email"
                className="h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 max-w-sm"
              />
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                S&apos;inscrire
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
