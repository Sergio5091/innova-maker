"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ShoppingCart, Filter, Search, Star, ArrowRight, Monitor, Clock, Sun, Home, Cpu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const categories = [
  { id: "all", label: "Tous les produits", icon: Filter },
  { id: "led", label: "Écrans LED", icon: Monitor },
  { id: "clocks", label: "Horloges", icon: Clock },
  { id: "solar", label: "Kits Solaires", icon: Sun },
  { id: "domotics", label: "Domotique", icon: Home },
  { id: "iot", label: "Solutions IoT", icon: Cpu },
]

const products = [
  {
    id: 1,
    name: "Écran LED Professionnel P4",
    description: "Écran LED intérieur haute résolution pour affichage dynamique.",
    price: "2 500 000",
    currency: "FCFA",
    category: "led",
    rating: 4.8,
    reviews: 24,
    badge: "Populaire",
  },
  {
    id: 2,
    name: "Écran LED Extérieur P10",
    description: "Écran LED résistant aux intempéries pour affichage publicitaire.",
    price: "4 800 000",
    currency: "FCFA",
    category: "led",
    rating: 4.9,
    reviews: 18,
    badge: "Premium",
  },
  {
    id: 3,
    name: "Horloge Numérique Géante",
    description: "Horloge LED grand format avec synchronisation automatique.",
    price: "850 000",
    currency: "FCFA",
    category: "clocks",
    rating: 4.7,
    reviews: 31,
    badge: null,
  },
  {
    id: 4,
    name: "Kit Solaire Résidentiel 5kW",
    description: "Solution solaire complète avec panneaux et onduleur.",
    price: "3 200 000",
    currency: "FCFA",
    category: "solar",
    rating: 4.9,
    reviews: 42,
    badge: "Meilleure vente",
  },
  {
    id: 5,
    name: "Kit Solaire Commercial 10kW",
    description: "Installation solaire pour entreprises et commerces.",
    price: "5 800 000",
    currency: "FCFA",
    category: "solar",
    rating: 4.8,
    reviews: 15,
    badge: null,
  },
  {
    id: 6,
    name: "Module Domotique Central",
    description: "Hub central pour contrôler tous vos appareils connectés.",
    price: "450 000",
    currency: "FCFA",
    category: "domotics",
    rating: 4.6,
    reviews: 28,
    badge: "Nouveau",
  },
  {
    id: 7,
    name: "Thermostat Intelligent",
    description: "Contrôle climatique automatisé avec apprentissage IA.",
    price: "175 000",
    currency: "FCFA",
    category: "domotics",
    rating: 4.7,
    reviews: 56,
    badge: null,
  },
  {
    id: 8,
    name: "Capteur IoT Multi-fonction",
    description: "Capteur connecté température, humidité et qualité d'air.",
    price: "85 000",
    currency: "FCFA",
    category: "iot",
    rating: 4.5,
    reviews: 33,
    badge: null,
  },
  {
    id: 9,
    name: "Gateway IoT Industriel",
    description: "Passerelle pour connecter vos équipements industriels.",
    price: "650 000",
    currency: "FCFA",
    category: "iot",
    rating: 4.8,
    reviews: 12,
    badge: "Pro",
  },
  {
    id: 10,
    name: "Caméra de Surveillance IP",
    description: "Caméra HD avec vision nocturne et détection de mouvement.",
    price: "120 000",
    currency: "FCFA",
    category: "domotics",
    rating: 4.6,
    reviews: 67,
    badge: null,
  },
  {
    id: 11,
    name: "Panneau LED Publicitaire",
    description: "Enseigne LED programmable pour commerces.",
    price: "1 200 000",
    currency: "FCFA",
    category: "led",
    rating: 4.7,
    reviews: 22,
    badge: null,
  },
  {
    id: 12,
    name: "Horloge Murale LED",
    description: "Horloge décorative LED pour bureaux et commerces.",
    price: "280 000",
    currency: "FCFA",
    category: "clocks",
    rating: 4.5,
    reviews: 19,
    badge: null,
  },
]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un produit..."
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="group bg-background rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all"
              >
                {/* Product Image Placeholder */}
                <div className="relative aspect-square bg-secondary/50 flex items-center justify-center">
                  {product.badge && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      {product.badge}
                    </span>
                  )}
                  <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center">
                    {product.category === "led" && <Monitor className="w-10 h-10 text-primary" />}
                    {product.category === "clocks" && <Clock className="w-10 h-10 text-primary" />}
                    {product.category === "solar" && <Sun className="w-10 h-10 text-primary" />}
                    {product.category === "domotics" && <Home className="w-10 h-10 text-primary" />}
                    {product.category === "iot" && <Cpu className="w-10 h-10 text-primary" />}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-foreground">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} avis)</span>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-foreground">{product.price}</span>
                      <span className="text-sm text-muted-foreground ml-1">{product.currency}</span>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
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
        </div>
      </section>

      {/* CTA Section */}
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
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14">
              Demander un devis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
