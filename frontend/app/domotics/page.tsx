"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Home, Sun, Shield, Thermometer, Wifi, Battery, Lock, Camera, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { AnimatedCounter, FloatingParticles, TypingText } from "@/components/ui/animated-elements"

const services = [
  {
    icon: Sun,
    title: "Énergie Solaire",
    description: "Installation de panneaux solaires et systèmes de gestion intelligente de l'énergie pour réduire vos coûts et votre empreinte carbone.",
  },
  {
    icon: Thermometer,
    title: "Gestion Climatique",
    description: "Contrôle intelligent de la température, ventilation et climatisation pour un confort optimal et des économies d'énergie.",
  },
  {
    icon: Shield,
    title: "Sécurité Connectée",
    description: "Systèmes de surveillance, détection d'intrusion et contrôle d'accès pour protéger vos biens et vos proches.",
  },
  {
    icon: Wifi,
    title: "Connectivité Totale",
    description: "Infrastructure réseau robuste pour connecter tous vos appareils et assurer une communication fluide.",
  },
  {
    icon: Battery,
    title: "Stockage d'Énergie",
    description: "Solutions de batteries intelligentes pour stocker l'énergie solaire et garantir l'autonomie de votre installation.",
  },
  {
    icon: Lock,
    title: "Contrôle d'Accès",
    description: "Serrures connectées, badges et reconnaissance biométrique pour une gestion moderne des accès.",
  },
]

const features = [
  { title: "Économies d'énergie", value: "jusqu'à 40%", description: "de réduction sur vos factures" },
  { title: "Installation", value: "2-5 jours", description: "pour une maison complète" },
  { title: "Support", value: "24/7", description: "assistance technique" },
  { title: "Garantie", value: "5 ans", description: "sur tous nos équipements" },
]

const solutions = [
  {
    title: "Maison Individuelle",
    description: "Solution complète pour automatiser votre maison et améliorer votre confort quotidien.",
    features: ["Éclairage intelligent", "Thermostat connecté", "Vidéosurveillance", "Contrôle vocal"],
  },
  {
    title: "Immeuble Résidentiel",
    description: "Gestion centralisée des parties communes et services aux résidents.",
    features: ["Interphone vidéo", "Contrôle d'accès", "Gestion parking", "Éclairage automatique"],
  },
  {
    title: "Bâtiment Commercial",
    description: "Optimisation énergétique et sécurité pour vos locaux professionnels.",
    features: ["Gestion énergétique", "Sécurité renforcée", "Monitoring temps réel", "Maintenance prédictive"],
  },
]

export default function DomoticsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        {/* Floating Particles */}
        <FloatingParticles count={25} color="emerald" />
        
        {/* Smart Home Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
          <defs>
            <pattern id="homeGrid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="2" className="fill-emerald-500" />
              <path d="M40 0 L40 80 M0 40 L80 40" stroke="currentColor" strokeWidth="0.5" className="text-emerald-500/30" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#homeGrid)" />
        </svg>
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10B98108_1px,transparent_1px),linear-gradient(to_bottom,#10B98108_1px,transparent_1px)] bg-[size:64px_64px]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium mb-6">
                <Home className="w-4 h-4" />
                Domotique
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
                <TypingText texts={["L'intelligence artificielle au service de votre habitat"]} />
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Solutions complètes pour automatiser votre habitat : énergie solaire, gestion énergétique et sécurité connectée pour un confort optimal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Demander un devis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Découvrir nos solutions
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
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30">
                  <Image
                    src="/images/domotics.jpg"
                    alt="Domotique et maison intelligente"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent" />
                  
                  {/* Tech Corners */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-emerald-500/50" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-emerald-500/50" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-emerald-500/50" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-emerald-500/50" />
                  
                  {/* Energy Display */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-xs font-mono text-emerald-400 bg-background/80 backdrop-blur-sm px-2 py-1 rounded"
                    >
                      SOLAR: <AnimatedCounter value={87} suffix="%" duration={1} />
                    </motion.div>
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="text-xs font-mono text-emerald-400 bg-background/80 backdrop-blur-sm px-2 py-1 rounded"
                    >
                      TEMP: 24°C
                    </motion.div>
                  </div>
                </div>
                
                {/* Energy Badge */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-background rounded-2xl p-4 shadow-xl border border-emerald-500/30"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Sun className="w-8 h-8 text-emerald-500" />
                  </motion.div>
                </motion.div>
                
                {/* Home Badge */}
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 bg-emerald-500 rounded-2xl px-6 py-4 shadow-xl overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <Home className="w-8 h-8 text-white relative" />
                </motion.div>
                
                {/* WiFi Signal Animation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-16 h-16 -ml-8 -mt-8 rounded-full border border-emerald-500/30"
                      animate={{ scale: [1, 2.5, 2.5], opacity: [0.5, 0, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Stats */}
      <section className="py-16 bg-emerald-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {feature.title === "Économies d'énergie" ? (
                    <>jusqu&apos;à <AnimatedCounter value={40} suffix="%" /></>
                  ) : feature.title === "Installation" ? (
                    <><AnimatedCounter value={2} />-<AnimatedCounter value={5} /> jours</>
                  ) : feature.title === "Support" ? (
                    "24/7"
                  ) : (
                    <><AnimatedCounter value={5} /> ans</>
                  )}
                </div>
                <div className="text-white/90 font-medium">{feature.title}</div>
                <div className="text-white/70 text-sm">{feature.description}</div>
              </motion.div>
            ))}
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
              Nos solutions domotiques
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des technologies avancées pour un habitat moderne, confortable et économe en énergie.
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
                className="group p-8 bg-background rounded-2xl border border-border hover:border-emerald-500/30 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <service.icon className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Solutions adaptées à vos besoins
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Que vous soyez particulier ou professionnel, nous avons la solution qu&apos;il vous faut.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-8 bg-secondary/50 rounded-2xl border border-border hover:border-emerald-500/30 transition-colors"
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">{solution.title}</h3>
                <p className="text-muted-foreground mb-6">{solution.description}</p>
                <ul className="space-y-2">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
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
              Transformez votre habitat
            </h2>
            <p className="text-lg text-background/70 max-w-2xl mx-auto mb-10">
              Contactez-nous pour une étude personnalisée et découvrez comment la domotique peut améliorer votre quotidien.
            </p>
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-14">
              <Link href="/contact" className="flex items-center">
                Demander une étude gratuite
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
