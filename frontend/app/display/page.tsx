"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Monitor, Tv, Signpost, Clock, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FloatingParticles, TypingText, ScanningLine } from "@/components/ui/animated-elements"

const products = [
  {
    icon: Tv,
    title: "Écrans LED Géants",
    description: "Écrans LED haute résolution pour événements, stades, centres commerciaux et espaces publics.",
    specs: ["Résolution jusqu'à 4K", "Luminosité extérieure", "Installation indoor/outdoor"],
  },
  {
    icon: Signpost,
    title: "Enseignes Dynamiques",
    description: "Enseignes lumineuses programmables pour attirer l'attention et communiquer efficacement.",
    specs: ["Design sur mesure", "Contenu dynamique", "Gestion à distance"],
  },
  {
    icon: Clock,
    title: "Horloges Numériques",
    description: "Horloges LED géantes pour espaces publics, gares, aéroports et centres sportifs.",
    specs: ["Affichage temps réel", "Synchronisation NTP", "Multi-fuseaux horaires"],
  },
  {
    icon: Monitor,
    title: "Écrans Informatifs",
    description: "Solutions d'affichage dynamique pour la communication interne et externe.",
    specs: ["Gestion de contenu", "Multi-écrans", "Planning automatisé"],
  },
]

const applications = [
  { title: "Stades & Arènes", description: "Écrans géants pour l'affichage des scores et la diffusion de contenus." },
  { title: "Centres Commerciaux", description: "Panneaux publicitaires et signalétique dynamique." },
  { title: "Aéroports & Gares", description: "Affichage des horaires et informations voyageurs." },
  { title: "Événements", description: "Écrans temporaires pour concerts, salons et conférences." },
  { title: "Façades de Bâtiments", description: "Habillage lumineux et communication architecturale." },
  { title: "Espaces Publics", description: "Information citoyenne et communication municipale." },
]

const process = [
  { step: "01", title: "Consultation", description: "Analyse de vos besoins et contraintes techniques." },
  { step: "02", title: "Conception", description: "Design personnalisé et choix des technologies." },
  { step: "03", title: "Fabrication", description: "Production de vos écrans sur mesure." },
  { step: "04", title: "Installation", description: "Pose professionnelle et mise en service." },
  { step: "05", title: "Maintenance", description: "Support technique et maintenance préventive." },
]

export default function DisplayPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        {/* Floating Particles */}
        <FloatingParticles count={25} color="orange" />
        
        {/* LED Pixel Grid Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-500 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#F9731608_1px,transparent_1px),linear-gradient(to_bottom,#F9731608_1px,transparent_1px)] bg-[size:64px_64px]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-32 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium mb-6">
                <Monitor className="w-4 h-4" />
                Display
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
                Affichage{" "}
                <span className="text-orange-500">
                  <TypingText texts={["LED", "4K", "géant", "dynamique"]} />
                </span>
                {" "}haute performance
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Conception et installation d&apos;écrans LED géants, enseignes dynamiques et systèmes d&apos;affichage numérique pour maximiser votre visibilité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Demander un devis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Voir nos réalisations
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-video max-w-lg mx-auto">
                {/* Screen Glow Effect */}
                <div className="absolute -inset-4 bg-orange-500/20 rounded-3xl blur-2xl" />
                
                {/* Scanning Line */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden z-10 pointer-events-none">
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/80 to-transparent"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-2 border-orange-500/30">
                  <Image
                    src="/images/display.jpg"
                    alt="Ecrans LED et affichage numerique"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 via-transparent to-transparent" />
                  
                  {/* Screen Corners */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-orange-500" />
                  <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-orange-500" />
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-orange-500" />
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-orange-500" />
                  
                  {/* LED Info Display */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-xs font-mono text-orange-400 bg-background/80 backdrop-blur-sm px-2 py-1 rounded"
                    >
                      4K UHD
                    </motion.div>
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                      className="text-xs font-mono text-orange-400 bg-background/80 backdrop-blur-sm px-2 py-1 rounded"
                    >
                      10000 cd/m²
                    </motion.div>
                  </div>
                  
                  {/* Simulated Pixel Effect */}
                  <div className="absolute bottom-4 left-4 flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-4 bg-orange-500 rounded-sm"
                        animate={{ opacity: [0.3, 1, 0.3], height: [8, 16, 8] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Sparkle Badge */}
                <motion.div
                  animate={{ y: [-5, 5, -5], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                  />
                  <Sparkles className="w-8 h-8 text-white relative" />
                </motion.div>
                
                {/* Monitor Badge */}
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 bg-background rounded-2xl px-6 py-4 shadow-xl border border-orange-500/30"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-orange-500 rounded-full"
                    />
                    <span className="text-xs font-mono text-muted-foreground">LIVE</span>
                  </div>
                  <Monitor className="w-8 h-8 text-orange-500 mt-1" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos solutions d&apos;affichage
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des écrans LED de qualité professionnelle pour tous vos besoins de communication visuelle.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group p-8 bg-background rounded-2xl border border-border hover:border-orange-500/30 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                    <product.icon className="w-8 h-8 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{product.title}</h3>
                    <p className="text-muted-foreground mb-4">{product.description}</p>
                    <ul className="flex flex-wrap gap-2">
                      {product.specs.map((spec) => (
                        <li
                          key={spec}
                          className="px-3 py-1 bg-orange-500/10 text-orange-600 rounded-full text-sm"
                        >
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Domaines d&apos;application
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nos solutions s&apos;adaptent à tous les secteurs d&apos;activité et environnements.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app, index) => (
              <motion.div
                key={app.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="p-6 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">{app.title}</h3>
                <p className="text-muted-foreground text-sm">{app.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-orange-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Notre processus
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              De la conception à l&apos;installation, nous vous accompagnons à chaque étape.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white/30 mb-3">{item.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.description}</p>
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
              Illuminez votre communication
            </h2>
            <p className="text-lg text-background/70 max-w-2xl mx-auto mb-10">
              Contactez-nous pour discuter de votre projet d&apos;affichage LED et obtenir un devis personnalisé.
            </p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-14">
              <Link href="/contact" className="flex items-center">
                Obtenir un devis gratuit
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
