"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, ArrowRight, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    type: "general",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")
    try {
      await api.post("/contacts", formData)
      setStatus("success")
      setFormData({ name: "", email: "", phone: "", company: "", subject: "", message: "", type: "general" })
    } catch (err: any) {
      setStatus("error")
      setErrorMsg(err.message || "Une erreur est survenue. Réessayez.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="py-24 lg:py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Contact
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Parlons de votre
              <span className="text-primary block">projet innovant</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Notre équipe est prête à transformer vos idées en solutions technologiques concrètes et performantes.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="bg-background rounded-2xl p-8 border border-border shadow-lg">
                <h2 className="text-2xl font-semibold text-foreground mb-6">Envoyez-nous un message</h2>

                {status === "success" ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Message envoyé !</h3>
                    <p className="text-muted-foreground mb-6">Nous vous répondrons sous 24h.</p>
                    <Button onClick={() => setStatus("idle")} variant="outline">Envoyer un autre message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Nom complet *</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="Jean Dupont" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="jean@exemple.com" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="+229 XX XX XX XX" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Entreprise</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="Nom de l'entreprise" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Sujet *</label>
                      <input type="text" name="subject" required value={formData.subject} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Objet de votre message" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Type</label>
                      <select name="type" value={formData.type} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                        <option value="general">Général</option>
                        <option value="support">Support</option>
                        <option value="partnership">Partenariat</option>
                        <option value="complaint">Réclamation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                      <textarea name="message" required rows={5} value={formData.message} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                        placeholder="Décrivez votre projet en détail..." />
                    </div>

                    {status === "error" && (
                      <p className="text-sm text-destructive">{errorMsg}</p>
                    )}

                    <Button type="submit" size="lg" disabled={status === "loading"}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      {status === "loading" ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi en cours...</>
                      ) : (
                        <><Send className="mr-2 h-5 w-5" /> Envoyer le message</>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-background rounded-2xl p-8 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-6">Contact direct</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Email</div>
                      <a href="mailto:contact@inovamakers.io" className="text-muted-foreground hover:text-primary transition-colors">
                        contact@inovamakers.io
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Téléphone</div>
                      <a href="tel:+22944557777" className="text-muted-foreground hover:text-primary transition-colors">
                        +229 44 55 77 77
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Adresse</div>
                      <div className="text-muted-foreground">Aïmevo - Godomey, Bénin</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-2xl p-8 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-6">Horaires d'ouverture</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lundi - Vendredi</span>
                    <span className="text-foreground font-medium">9h - 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Samedi</span>
                    <span className="text-foreground font-medium">9h - 14h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimanche</span>
                    <span className="text-foreground font-medium">Fermé</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary rounded-2xl p-8 text-center">
                <h3 className="text-xl font-semibold text-primary-foreground mb-4">Prêt à commencer ?</h3>
                <p className="text-primary-foreground/80 mb-6">Demandez une étude personnalisée pour votre projet</p>
                <Link href="/quote">
                  <Button variant="secondary" size="lg">
                    Demander un devis <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
