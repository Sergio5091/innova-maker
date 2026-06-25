"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Cpu, Home, Monitor, Zap, Shield, Cloud, Settings, Lightbulb, Gauge } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

const serviceIcons: Record<string, any> = {
  engineering: Cpu,
  "domotics-service": Home,
  display: Monitor,
}
const serviceColors: Record<string, string> = {
  engineering: "from-blue-500 to-blue-600",
  "domotics-service": "from-emerald-500 to-emerald-600",
  display: "from-orange-500 to-orange-600",
}
const serviceHrefs: Record<string, string> = {
  engineering: "/engineering",
  "domotics-service": "/domotics",
  display: "/display",
}

const additionalIcons = [Zap, Shield, Cloud, Settings, Lightbulb, Gauge]

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/services")
      .then((res) => setServices(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const mainServices = services.slice(0, 3)
  const additionalServices = services.slice(3)

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A4DFF08_1px,transparent_1px),linear-gradient(to_bottom,#0A4DFF08_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Nos Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Des solutions technologiques <span className="text-primary">sur mesure</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Découvrez notre gamme complète de services pour accompagner votre entreprise dans sa transformation digitale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="space-y-16">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="grid lg:grid-cols-2 gap-12 items-center animate-pulse">
                  <div className="space-y-4">
                    <div className="h-16 w-16 bg-secondary rounded-2xl" />
                    <div className="h-8 bg-secondary rounded w-1/2" />
                    <div className="h-4 bg-secondary rounded w-full" />
                    <div className="h-4 bg-secondary rounded w-3/4" />
                  </div>
                  <div className="aspect-square max-w-md mx-auto bg-secondary rounded-3xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {mainServices.map((service, index) => {
                const Icon = serviceIcons[service.slug] || Cpu
                const color = serviceColors[service.slug] || "from-primary to-primary/80"
                const href = serviceHrefs[service.slug] || "/services"
                const features = Array.isArray(service.features)
                  ? service.features
                  : typeof service.features === "string"
                  ? JSON.parse(service.features || "[]")
                  : []

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className={`grid lg:grid-cols-2 gap-12 items-center`}
                  >
                    <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{service.name}</h2>
                      <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        {service.description || service.short_description}
                      </p>
                      {features.length > 0 && (
                        <ul className="grid grid-cols-2 gap-4 mb-8">
                          {features.map((feature: string) => (
                            <li key={feature} className="flex items-center gap-2 text-foreground">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href={href}>
                          En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className={`relative aspect-square max-w-md mx-auto ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20 rounded-3xl`} />
                      <div className="absolute inset-4 bg-background rounded-2xl border border-border flex items-center justify-center">
                        <Icon className="w-24 h-24 text-muted-foreground/30" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Additional Services */}
      {additionalServices.length > 0 && (
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Services complémentaires</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Une gamme complète de services pour répondre à tous vos besoins technologiques.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalServices.map((service, index) => {
                const Icon = additionalIcons[index % additionalIcons.length]
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="group p-6 bg-secondary/50 rounded-2xl hover:bg-secondary transition-colors border border-transparent hover:border-border"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{service.name}</h3>
                    <p className="text-muted-foreground">{service.short_description || service.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 bg-foreground">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-background mb-6">Prêt à démarrer votre projet ?</h2>
            <p className="text-lg text-background/70 max-w-2xl mx-auto mb-10">
              Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé.
            </p>
            <Link href="/quote">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14">
                Demander un devis <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
