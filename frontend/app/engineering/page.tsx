"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Cpu, Code, Lightbulb, Layers, Workflow, GitBranch, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { AnimatedCounter, FloatingParticles, CodeRain, CircuitLines, TypingText } from "@/components/ui/animated-elements"

const services = [
  {
    icon: Lightbulb,
    title: "Conseil en Innovation",
    description: "Accompagnement stratégique pour identifier et développer des solutions technologiques innovantes adaptées à vos besoins.",
  },
  {
    icon: Cpu,
    title: "Objets Connectés",
    description: "Conception et développement d'objets connectés sur mesure pour optimiser vos processus industriels et commerciaux.",
  },
  {
    icon: Code,
    title: "Solutions IoT",
    description: "Développement de plateformes IoT complètes pour la collecte, l'analyse et la visualisation de données en temps réel.",
  },
  {
    icon: Layers,
    title: "Prototypage Rapide",
    description: "Création de prototypes fonctionnels pour valider vos concepts et accélérer votre mise sur le marché.",
  },
  {
    icon: Workflow,
    title: "Automatisation",
    description: "Automatisation des processus métiers grâce à des systèmes intelligents et interconnectés.",
  },
  {
    icon: GitBranch,
    title: "Intégration Systèmes",
    description: "Intégration de vos systèmes existants avec de nouvelles technologies pour une infrastructure cohérente.",
  },
]

const process = [
  { step: "01", title: "Analyse", description: "Étude approfondie de vos besoins et contraintes techniques." },
  { step: "02", title: "Conception", description: "Design de la solution optimale avec validation des choix technologiques." },
  { step: "03", title: "Développement", description: "Réalisation itérative avec tests et ajustements continus." },
  { step: "04", title: "Déploiement", description: "Mise en production et formation de vos équipes." },
]

const benefits = [
  "Réduction des coûts opérationnels",
  "Amélioration de la productivité",
  "Prise de décision basée sur les données",
  "Avantage concurrentiel durable",
  "Scalabilité et flexibilité",
  "Support technique dédié",
]

export default function EngineeringPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        {/* Code Rain Background */}
        <CodeRain className="opacity-20" />
        
        {/* Circuit Pattern */}
        <CircuitLines className="opacity-20" />
        
        {/* Floating Particles */}
        <FloatingParticles count={25} color="blue" />
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3B82F608_1px,transparent_1px),linear-gradient(to_bottom,#3B82F608_1px,transparent_1px)] bg-[size:64px_64px]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-6">
                <Cpu className="w-4 h-4" />
                Engineering
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
                Innovation et{" "}
                <span className="text-blue-500">
                  <TypingText texts={["IoT", "AI", "Cloud", "Data"]} />
                </span>
                {" "}au service de votre entreprise
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Conseil stratégique en innovation, conception d&apos;objets connectés et développement de solutions IoT pour transformer votre activité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                  Demander un devis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Voir nos projets
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-[4/3] max-w-lg mx-auto">
                {/* Scanning Effect */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden z-10 pointer-events-none">
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-blue-500/30">
                  <Image
                    src="/images/engineering.jpg"
                    alt="Engineering et IoT"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent" />
                  
                  {/* Tech Corners */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-500/50" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-500/50" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-500/50" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-500/50" />
                  
                  {/* Data Overlay */}
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-4 left-4 text-xs font-mono text-blue-400 bg-background/80 backdrop-blur-sm px-2 py-1 rounded"
                  >
                    CPU: <AnimatedCounter value={42} suffix="%" duration={1} />
                  </motion.div>
                </div>
                
                {/* Floating Badge with Pulse */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 bg-blue-500 rounded-2xl px-6 py-4 shadow-xl overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <Cpu className="w-8 h-8 text-white relative" />
                </motion.div>
                
                {/* Status Indicator */}
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-background rounded-xl p-3 shadow-xl border border-blue-500/30"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                    />
                    <span className="text-xs font-mono text-muted-foreground">ACTIVE</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos expertises en Engineering
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des solutions technologiques complètes pour répondre à tous vos défis d&apos;innovation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group p-8 bg-background rounded-2xl border border-border hover:border-blue-500/30 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <service.icon className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Notre processus
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une méthodologie éprouvée pour garantir le succès de vos projets.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-blue-500/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-blue-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Pourquoi choisir INOVA Makers pour vos projets Engineering ?
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Notre équipe d&apos;experts combine expertise technique et vision stratégique pour créer des solutions qui transforment votre activité.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-white">
                    <Check className="w-5 h-5 text-white/80 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
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
              Prêt à innover ?
            </h2>
            <p className="text-lg text-background/70 max-w-2xl mx-auto mb-10">
              Contactez-nous pour discuter de votre projet et découvrir comment nos solutions peuvent transformer votre activité.
            </p>
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 h-14">
              <Link href="/contact" className="flex items-center">
                Parlons de votre projet
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
