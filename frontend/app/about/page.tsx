"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Target, Eye, Lightbulb, Award, Users, CheckCircle2, Globe, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Nous repoussons constamment les limites de la technologie pour créer des solutions d'avant-garde.",
  },
  {
    icon: Award,
    title: "Qualité",
    description: "Nous nous engageons à fournir des produits et services d'excellence à chaque projet.",
  },
  {
    icon: CheckCircle2,
    title: "Fiabilité",
    description: "Nos solutions sont conçues pour durer et fonctionner de manière optimale en toutes circonstances.",
  },
  {
    icon: Zap,
    title: "Impact Technologique",
    description: "Nous visons à transformer positivement les entreprises et les communautés par la technologie.",
  },
]

const stats = [
  { value: "10+", label: "Années d'expérience" },
  { value: "150+", label: "Projets réalisés" },
  { value: "50+", label: "Clients satisfaits" },
  { value: "25+", label: "Experts techniques" },
]

const team = [
  { name: "Amadou Diallo", role: "CEO & Fondateur", expertise: "Innovation & Stratégie" },
  { name: "Fatou Sow", role: "Directrice Technique", expertise: "IoT & Systèmes embarqués" },
  { name: "Moussa Ndiaye", role: "Responsable Domotique", expertise: "Automatisation & Énergie" },
  { name: "Awa Diop", role: "Responsable Display", expertise: "Affichage LED & Digital" },
]

const milestones = [
  { year: "2014", title: "Création", description: "Fondation d'INOVA Makers à Dakar" },
  { year: "2016", title: "Expansion", description: "Lancement des services domotiques" },
  { year: "2018", title: "Innovation", description: "Premier projet d'écran LED géant" },
  { year: "2020", title: "Croissance", description: "Expansion régionale en Afrique de l'Ouest" },
  { year: "2023", title: "Leadership", description: "Leader du marché sénégalais" },
  { year: "2026", title: "Vision", description: "Objectif : présence dans 10 pays africains" },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A4DFF08_1px,transparent_1px),linear-gradient(to_bottom,#0A4DFF08_1px,transparent_1px)] bg-[size:64px_64px]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              À propos de nous
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              L&apos;innovation technologique au service de <span className="text-primary">l&apos;Afrique</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              INOVA Makers est une entreprise spécialisée dans la conception de solutions technologiques innovantes dans les domaines de l&apos;ingénierie, de l&apos;énergie solaire, de la domotique et des systèmes d&apos;affichage LED.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background rounded-2xl p-10 border border-border"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Notre Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Développer des solutions technologiques innovantes pour améliorer la performance des entreprises et la qualité de vie des communautés africaines. Nous croyons que la technologie peut être un puissant levier de développement économique et social.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background rounded-2xl p-10 border border-border"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Notre Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                Devenir un acteur majeur de l&apos;innovation technologique en Afrique en proposant des solutions durables, accessibles et adaptées aux réalités locales. Nous aspirons à être le partenaire technologique de référence pour les entreprises et les villes intelligentes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos valeurs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Les principes qui guident chacune de nos actions et décisions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Notre parcours
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une décennie d&apos;innovation et de croissance continue.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="bg-background rounded-xl p-6 border border-border inline-block">
                      <div className="text-2xl font-bold text-primary mb-1">{milestone.year}</div>
                      <div className="text-lg font-semibold text-foreground mb-1">{milestone.title}</div>
                      <div className="text-muted-foreground">{milestone.description}</div>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0 relative z-10" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Notre équipe
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des experts passionnés par la technologie et l&apos;innovation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center bg-secondary/50 rounded-2xl p-8 hover:bg-secondary transition-colors"
              >
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                <div className="text-primary text-sm font-medium mb-2">{member.role}</div>
                <div className="text-muted-foreground text-sm">{member.expertise}</div>
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
            <Globe className="w-16 h-16 text-primary mx-auto mb-8" />
            <h2 className="text-3xl md:text-4xl font-bold text-background mb-6">
              Prêt à travailler avec nous ?
            </h2>
            <p className="text-lg text-background/70 max-w-2xl mx-auto mb-10">
              Contactez-nous pour discuter de vos projets et découvrir comment INOVA Makers peut vous accompagner dans votre transformation technologique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14">
                <Link href="/contact" className="flex items-center">
                  Nous contacter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10 px-8 h-14">
                <Link href="/services">
                  Voir nos services
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
