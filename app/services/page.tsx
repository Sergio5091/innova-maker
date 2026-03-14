"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Cpu, Home, Monitor, Zap, Shield, Cloud, Settings, Lightbulb, Gauge } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const mainServices = [
  {
    icon: Cpu,
    title: "Engineering",
    description: "Conseil stratégique en innovation, conception d'objets connectés et développement de solutions IoT pour optimiser vos processus.",
    features: ["Conseil en innovation", "Objets connectés", "Solutions IoT", "Prototypage rapide"],
    href: "/engineering",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Home,
    title: "Domotique",
    description: "Solutions intelligentes pour automatiser les maisons et bâtiments avec énergie solaire, gestion énergétique et sécurité connectée.",
    features: ["Automatisation", "Énergie solaire", "Gestion énergétique", "Sécurité connectée"],
    href: "/domotics",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Monitor,
    title: "Display",
    description: "Conception et installation d'écrans LED géants, enseignes dynamiques et systèmes d'affichage numérique haute performance.",
    features: ["Écrans LED géants", "Enseignes dynamiques", "Affichage numérique", "Solutions sur mesure"],
    href: "/display",
    color: "from-orange-500 to-orange-600",
  },
]

const additionalServices = [
  { icon: Zap, title: "Énergie Solaire", description: "Installation de panneaux solaires et systèmes de gestion énergétique." },
  { icon: Shield, title: "Sécurité", description: "Systèmes de surveillance et contrôle d'accès intelligents." },
  { icon: Cloud, title: "Cloud & IoT", description: "Solutions cloud pour la gestion de vos appareils connectés." },
  { icon: Settings, title: "Maintenance", description: "Support technique et maintenance préventive de vos installations." },
  { icon: Lightbulb, title: "Consulting", description: "Accompagnement stratégique pour votre transformation digitale." },
  { icon: Gauge, title: "Performance", description: "Optimisation et monitoring de vos systèmes en temps réel." },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A4DFF08_1px,transparent_1px),linear-gradient(to_bottom,#0A4DFF08_1px,transparent_1px)] bg-[size:64px_64px]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />

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
              Découvrez notre gamme complète de services pour accompagner votre entreprise dans sa transformation digitale et technologique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-16">
            {mainServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <ul className="grid grid-cols-2 gap-4 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-foreground">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href={service.href}>
                      En savoir plus
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className={`relative aspect-square max-w-md mx-auto ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20 rounded-3xl`} />
                  <div className="absolute inset-4 bg-background rounded-2xl border border-border flex items-center justify-center">
                    <service.icon className="w-24 h-24 text-muted-foreground/30" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Services complémentaires
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une gamme complète de services pour répondre à tous vos besoins technologiques.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="group p-6 bg-secondary/50 rounded-2xl hover:bg-secondary transition-colors border border-transparent hover:border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
          </div>
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
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-lg text-background/70 max-w-2xl mx-auto mb-10">
              Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé.
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
