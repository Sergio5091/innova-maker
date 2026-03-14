"use client"

import { motion } from "framer-motion"
import { ArrowRight, Cpu, Home, Monitor } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const services = [
  {
    icon: Cpu,
    title: "Engineering",
    description:
      "Conseil stratégique en innovation, conception d'objets connectés et développement de solutions IoT.",
    href: "/engineering",
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-500",
    image: "/images/engineering.jpg",
  },
  {
    icon: Home,
    title: "Domotique",
    description:
      "Solutions intelligentes pour automatiser les maisons et bâtiments : énergie solaire, gestion énergétique et sécurité connectée.",
    href: "/domotics",
    color: "from-emerald-500/20 to-emerald-600/20",
    iconColor: "text-emerald-500",
    image: "/images/domotics.jpg",
  },
  {
    icon: Monitor,
    title: "Display",
    description:
      "Conception et installation d'écrans LED géants, enseignes dynamiques et systèmes d'affichage numérique.",
    href: "/display",
    color: "from-orange-500/20 to-orange-600/20",
    iconColor: "text-orange-500",
    image: "/images/display.jpg",
  },
]

export function ServicesSection() {
  return (
    <section className="py-24 lg:py-32 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nos services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            🛠️ Solutions Technologiques Expertes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Découvrez nos trois domaines d'excellence pour transformer vos idées en réalité.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link href={service.href} className="group block h-full">
                <div className="relative h-full bg-background rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    
                    {/* Icon Badge */}
                    <div
                      className={`absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg`}
                    >
                      <service.icon className={`w-6 h-6 ${service.iconColor}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Link */}
                    <div className="flex items-center text-sm font-medium text-primary">
                      En savoir plus
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors"
          >
            Voir tous nos services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
