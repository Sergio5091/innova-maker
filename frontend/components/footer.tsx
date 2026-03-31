"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, Globe } from "lucide-react"

const footerLinks = {
  services: [
    { href: "/engineering", label: "Engineering" },
    { href: "/domotics", label: "Domotique" },
    { href: "/display", label: "Affichage LED" },
    { href: "/shop", label: "Boutique" },
  ],
  company: [
    { href: "/about", label: "À propos" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Carrières" },
  ],
  legal: [
    { href: "/privacy", label: "Confidentialité" },
    { href: "/terms", label: "Conditions" },
    { href: "/cookies", label: "Cookies" },
  ],
}

const socialLinks = [
  { href: "#", icon: Linkedin, label: "LinkedIn" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Instagram, label: "Instagram" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <img 
                src="/logo_inova_blanc.svg" 
                alt="INOVA Makers Logo" 
                className="w-20 h-20"
              />
              <span className="text-xl font-semibold">
                INOVA <span className="text-primary">Makers</span>
              </span>
            </Link>
            <p className="text-background/70 mb-6 max-w-sm leading-relaxed">
              De l'esquisse au prototype fonctionnel, nous matérialisons vos innovations.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@inovamakers.io"
                  className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors"
                >
                  <Mail size={18} />
                  <span>contact@inovamakers.io</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+22944557777"
                  className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors"
                >
                  <Phone size={18} />
                  <span>+229 44 55 77 77</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-background/70">
                  <MapPin size={18} />
                  <span>Aïmevo - Godomey, Bénin</span>
                </div>
              </li>
              <li>
                <a
                  href="https://www.inovamakers.io"
                  className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe size={18} />
                  <span>www.inovamakers.io</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} INOVA Makers. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-background/50 text-sm hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
