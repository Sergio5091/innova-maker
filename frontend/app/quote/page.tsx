"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, Clock, Send, ArrowRight, Check, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

const projectTypes = [
  "Conseil stratégie",
  "Développement IoT",
  "Installation domotique",
  "Écrans LED",
  "Prototype",
  "Autre",
]

export default function QuotePage() {
  const [services, setServices] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service_id: "",
    project_type: "",
    budget: "",
    timeline: "",
    description: "",
    features: [] as string[],
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const totalSteps = 3

  useEffect(() => {
    api.get("/services").then((res) => setServices(res.data || [])).catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")
    try {
      await api.post("/quotes", {
        ...formData,
        service_id: formData.service_id ? Number(formData.service_id) : null,
      })
      setStatus("success")
    } catch (err: any) {
      setStatus("error")
      setErrorMsg(err.message || "Une erreur est survenue. Réessayez.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  if (status === "success") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-secondary/30">
        <div className="text-center max-w-md px-6">
          <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Demande envoyée !</h2>
          <p className="text-muted-foreground mb-8">
            Nous avons bien reçu votre demande de devis. Notre équipe vous contactera sous 24h.
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <section className="py-24 lg:py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Devis gratuit
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Obtenez un devis
              <span className="text-primary block">personnalisé</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Décrivez votre projet et recevez une estimation détaillée sous 24h.
            </p>
          </motion.div>

          {/* Progress */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {step < currentStep ? <Check className="w-5 h-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-4 transition-colors ${step < currentStep ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Informations</span>
              <span>Projet</span>
              <span>Détails</span>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="bg-background rounded-2xl p-8 border border-border shadow-lg">

                {/* Step 1 */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Vos informations</h2>
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
                        <label className="block text-sm font-medium text-foreground mb-2">Téléphone *</label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
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
                  </div>
                )}

                {/* Step 2 */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Votre projet</h2>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-4">Service souhaité</label>
                      <div className="grid md:grid-cols-3 gap-4">
                        {services.map((service) => (
                          <label key={service.id}
                            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.service_id === String(service.id)
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <input type="radio" name="service_id" value={service.id}
                              checked={formData.service_id === String(service.id)}
                              onChange={handleChange}
                              className="sr-only" />
                            <div className="text-center">
                              <h3 className="font-semibold text-foreground">{service.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{service.short_description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Type de projet *</label>
                        <select name="project_type" required value={formData.project_type} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                          <option value="">Sélectionnez un type</option>
                          {projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Budget estimé</label>
                        <select name="budget" value={formData.budget} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                          <option value="">Sélectionnez une fourchette</option>
                          <option value="moins-500k">Moins de 500 000 FCFA</option>
                          <option value="500k-2m">500 000 - 2 000 000 FCFA</option>
                          <option value="2m-5m">2 000 000 - 5 000 000 FCFA</option>
                          <option value="5m+">Plus de 5 000 000 FCFA</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Délai souhaité</label>
                      <select name="timeline" value={formData.timeline} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                        <option value="">Sélectionnez un délai</option>
                        <option value="urgent">Urgent (moins d'1 mois)</option>
                        <option value="1-3months">1 à 3 mois</option>
                        <option value="3-6months">3 à 6 mois</option>
                        <option value="6months+">Plus de 6 mois</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Détails du projet</h2>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-4">Fonctionnalités souhaitées</label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {["Design & UX", "Développement web", "Application mobile", "IoT & Capteurs", "Automatisation", "Tableau de bord", "Analytics", "Maintenance"].map((feature) => (
                          <label key={feature}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors">
                            <input type="checkbox" checked={formData.features.includes(feature)}
                              onChange={() => handleFeatureToggle(feature)}
                              className="w-4 h-4 text-primary rounded" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Description du projet *</label>
                      <textarea name="description" required rows={6} value={formData.description} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                        placeholder="Décrivez votre projet en détail..." />
                    </div>
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="font-semibold text-foreground mb-4">Récapitulatif</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service:</span>
                          <span className="text-foreground font-medium">
                            {services.find((s) => String(s.id) === formData.service_id)?.name || "Non sélectionné"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="text-foreground font-medium">{formData.project_type || "Non sélectionné"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="text-foreground font-medium">{formData.budget || "Non spécifié"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Délai:</span>
                          <span className="text-foreground font-medium">{formData.timeline || "Non spécifié"}</span>
                        </div>
                      </div>
                    </div>
                    {status === "error" && <p className="text-sm text-destructive">{errorMsg}</p>}
                  </div>
                )}

                <div className="flex justify-between pt-8">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep((s) => s - 1)}
                    className={currentStep === 1 ? "invisible" : ""}>
                    Précédent
                  </Button>
                  {currentStep === totalSteps ? (
                    <Button type="submit" disabled={status === "loading"}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      {status === "loading" ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi...</>
                      ) : (
                        <><Send className="mr-2 h-4 w-4" /> Envoyer la demande</>
                      )}
                    </Button>
                  ) : (
                    <Button type="button" onClick={() => setCurrentStep((s) => s + 1)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Suivant <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          {/* Contact info */}
          <div className="max-w-3xl mx-auto mt-12 bg-background rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-6">Questions ? Contactez-nous directement</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Phone, label: "Téléphone", value: "+229 44 55 77 77", href: "tel:+22944557777" },
                { icon: Mail, label: "Email", value: "contact@inovamakers.io", href: "mailto:contact@inovamakers.io" },
                { icon: Clock, label: "Réponse", value: "Sous 24h", href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="font-medium text-foreground mb-1">{label}</div>
                  {href ? (
                    <a href={href} className="text-muted-foreground hover:text-primary transition-colors">{value}</a>
                  ) : (
                    <div className="text-muted-foreground">{value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
