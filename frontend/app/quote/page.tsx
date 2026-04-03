"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, ArrowRight, Check, Cpu, Home, Monitor, Clock, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: Cpu,
    title: "Engineering",
    description: "Conseil stratégique en innovation et IoT",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: Home,
    title: "Domotique",
    description: "Maisons intelligentes et énergie solaire",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10"
  },
  {
    icon: Monitor,
    title: "Display",
    description: "Écrans LED et affichage numérique",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  }
]

const projectTypes = [
  "Conseil stratégie",
  "Développement IoT",
  "Installation domotique",
  "Écrans LED",
  "Prototype",
  "Autre"
]

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    projectType: "",
    budget: "",
    timeline: "",
    description: "",
    features: [] as string[]
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Quote request:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
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

          {/* Progress Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step <= currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step < currentStep ? <Check className="w-5 h-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-full h-1 mx-4 transition-colors ${
                        step < currentStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
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

          {/* Form */}
          <div className="max-w-3xl mx-auto">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="bg-background rounded-2xl p-8 border border-border shadow-lg">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">
                      Vos informations
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="Jean Dupont"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="jean@exemple.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="+229 XX XX XX XX"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                          Entreprise
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="Nom de l'entreprise"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Project Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">
                      Votre projet
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-4">
                        Service souhaité *
                      </label>
                      <div className="grid md:grid-cols-3 gap-4">
                        {services.map((service) => (
                          <label
                            key={service.title}
                            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.service === service.title
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="service"
                              value={service.title}
                              checked={formData.service === service.title}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <div className="flex flex-col items-center text-center">
                              <div className={`w-12 h-12 rounded-lg ${service.bgColor} flex items-center justify-center mb-3`}>
                                <service.icon className={`w-6 h-6 ${service.color}`} />
                              </div>
                              <h3 className="font-semibold text-foreground">{service.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="projectType" className="block text-sm font-medium text-foreground mb-2">
                          Type de projet *
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          required
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        >
                          <option value="">Sélectionnez un type</option>
                          {projectTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
                          Budget estimé
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        >
                          <option value="">Sélectionnez une fourchette</option>
                          <option value="5000-10000">5 000€ - 10 000€</option>
                          <option value="10000-25000">10 000€ - 25 000€</option>
                          <option value="25000-50000">25 000€ - 50 000€</option>
                          <option value="50000+">50 000€ et plus</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="timeline" className="block text-sm font-medium text-foreground mb-2">
                        Délai souhaité
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      >
                        <option value="">Sélectionnez un délai</option>
                        <option value="urgent">Urgent (moins d'1 mois)</option>
                        <option value="1-3months">1-3 mois</option>
                        <option value="3-6months">3-6 mois</option>
                        <option value="6months+">Plus de 6 mois</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 3: Project Details */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">
                      Détails du projet
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-4">
                        Fonctionnalités souhaitées
                      </label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          "Design & UX",
                          "Développement web",
                          "Application mobile",
                          "IoT & Capteurs",
                          "Automatisation",
                          "Tableau de bord",
                          "Analytics",
                          "Maintenance"
                        ].map((feature) => (
                          <label
                            key={feature}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.features.includes(feature)}
                              onChange={() => handleFeatureToggle(feature)}
                              className="w-4 h-4 text-primary border-primary rounded focus:ring-primary"
                            />
                            <span className="text-sm text-foreground">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                        Description du projet *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        required
                        rows={6}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                        placeholder="Décrivez votre projet en détail : objectifs, contraintes, fonctionnalités spécifiques..."
                      />
                    </div>

                    {/* Summary */}
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="font-semibold text-foreground mb-4">Récapitulatif</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service:</span>
                          <span className="text-foreground font-medium">{formData.service || "Non sélectionné"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="text-foreground font-medium">{formData.projectType || "Non sélectionné"}</span>
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
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={currentStep === 1 ? "invisible" : ""}
                  >
                    Précédent
                  </Button>

                  {currentStep === totalSteps ? (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Envoyer la demande
                      <Send className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Suivant
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-3xl mx-auto mt-12"
          >
            <div className="bg-background rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Questions ? Contactez-nous directement
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="font-medium text-foreground mb-1">Téléphone</div>
                  <a href="tel:+22944557777" className="text-muted-foreground hover:text-primary transition-colors">
                    +229 44 55 77 77
                  </a>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="font-medium text-foreground mb-1">Email</div>
                  <a href="mailto:contact@inovamakers.io" className="text-muted-foreground hover:text-primary transition-colors">
                    contact@inovamakers.io
                  </a>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="font-medium text-foreground mb-1">Réponse</div>
                  <div className="text-muted-foreground">Sous 24h</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
