"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PageHero, Section } from "@/components/site/layout"
import { Field, FormError, cardClass, inputClass } from "@/components/site/form"
import { company } from "@/lib/site"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

// Type de projet → slug du service en base (pour rattacher le devis au bon service dans l'admin)
const projectTypes = [
  { label: "Affichage LED", serviceSlug: "display" },
  { label: "Énergie solaire", serviceSlug: "domotics-service" },
  { label: "Domotique", serviceSlug: "domotics-service" },
  { label: "IoT / objet connecté", serviceSlug: "engineering" },
  { label: "Prototype sur mesure", serviceSlug: "engineering" },
  { label: "Conseil / étude", serviceSlug: "engineering" },
  { label: "Autre", serviceSlug: null },
]

const budgets = ["Moins de 500 000 FCFA", "500 000 – 2 000 000 FCFA", "2 000 000 – 5 000 000 FCFA", "Plus de 5 000 000 FCFA", "À définir ensemble"]
const timelines = ["Urgent (moins d'un mois)", "1 à 3 mois", "3 à 6 mois", "Plus de 6 mois"]
const needs = [
  "Étude / visite sur site", "Fourniture du matériel", "Installation", "Mise en service et formation",
  "Maintenance", "Pilotage à distance", "Stockage d'énergie (batteries)", "Développement sur mesure",
]

const steps = ["Vos coordonnées", "Votre projet", "Détails"]

export default function QuotePage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [services, setServices] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "",
    project_type: "", budget: "", timeline: "", description: "",
    features: [] as string[],
  })
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    api.get("/services").then((res) => setServices(res.data || [])).catch(() => {})
    // Pré-remplissage depuis une fiche produit : /quote?product=<slug>
    const product = new URLSearchParams(window.location.search).get("product")
    if (product) setFormData((p) => ({ ...p, description: `Demande concernant le produit : ${product}\n\n` }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleNeed = (need: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(need) ? prev.features.filter((f) => f !== need) : [...prev.features, need],
    }))
  }

  // Seuls les champs de l'étape affichée sont montés : reportValidity() valide donc l'étape courante
  const next = () => {
    if (formRef.current?.reportValidity()) setStep((s) => s + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < steps.length - 1) return next()
    setStatus("loading")
    setErrorMsg("")
    const slug = projectTypes.find((t) => t.label === formData.project_type)?.serviceSlug
    const serviceId = services.find((s) => s.slug === slug)?.id ?? null
    try {
      await api.post("/quotes", { ...formData, service_id: serviceId })
      setStatus("success")
    } catch (err: any) {
      setStatus("error")
      setErrorMsg(err.message || "Une erreur est survenue. Réessayez.")
    }
  }

  return (
    <main>
      <Navigation />

      <PageHero
        eyebrow="Demande de devis"
        title="Obtenez une proposition pour votre projet"
        description="Trois étapes, deux minutes. Nous étudions votre demande et revenons vers vous sous 24 h ouvrées avec une proposition claire."
        breadcrumb={[{ label: "Demande de devis" }]}
      />

      <Section tone="muted">
        <div className="mx-auto max-w-3xl">
          {status === "success" ? (
            <div className={cardClass("text-center py-16")}>
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
              <h2 className="mt-4 text-2xl font-semibold text-foreground">Demande envoyée</h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Merci {formData.name.split(" ")[0]}. Notre équipe étudie votre projet et vous contacte sous 24 h ouvrées.
              </p>
              <Button asChild variant="outline" className="mt-8">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Étapes */}
              <ol className="mb-8 grid grid-cols-3 gap-3">
                {steps.map((label, i) => (
                  <li key={label}>
                    <div className={cn("h-1 rounded-full", i <= step ? "bg-primary" : "bg-border")} />
                    <p className={cn("mt-3 flex items-center gap-1.5 text-sm", i === step ? "font-semibold text-foreground" : "text-muted-foreground")}>
                      {i < step && <Check className="h-4 w-4 text-primary" />}
                      <span className="hidden sm:inline">Étape {i + 1} ·</span> {label}
                    </p>
                  </li>
                ))}
              </ol>

              <form ref={formRef} onSubmit={handleSubmit} className={cardClass()}>
                {step === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Vos coordonnées</h2>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field label="Nom complet" required htmlFor="name">
                        <input id="name" name="name" required minLength={2} value={formData.name} onChange={handleChange} className={inputClass} autoComplete="name" />
                      </Field>
                      <Field label="Email" required htmlFor="email">
                        <input id="email" type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} autoComplete="email" />
                      </Field>
                      <Field label="Téléphone" required htmlFor="phone">
                        <input id="phone" type="tel" name="phone" required minLength={6} value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+229" autoComplete="tel" />
                      </Field>
                      <Field label="Entreprise" htmlFor="company">
                        <input id="company" name="company" value={formData.company} onChange={handleChange} className={inputClass} autoComplete="organization" />
                      </Field>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Votre projet</h2>
                    <fieldset>
                      <legend className="mb-3 block text-sm font-medium text-foreground">Type de projet <span className="text-primary">*</span></legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {projectTypes.map((t) => (
                          <label
                            key={t.label}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-[15px] transition-colors",
                              formData.project_type === t.label ? "border-primary bg-primary/5 text-foreground" : "border-input hover:border-primary/50",
                            )}
                          >
                            <input type="radio" name="project_type" value={t.label} required checked={formData.project_type === t.label}
                              onChange={handleChange} className="h-4 w-4 accent-[var(--primary)]" />
                            {t.label}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field label="Budget estimé" htmlFor="budget">
                        <select id="budget" name="budget" value={formData.budget} onChange={handleChange} className={inputClass}>
                          <option value="">Sélectionnez</option>
                          {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </Field>
                      <Field label="Délai souhaité" htmlFor="timeline">
                        <select id="timeline" name="timeline" value={formData.timeline} onChange={handleChange} className={inputClass}>
                          <option value="">Sélectionnez</option>
                          {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </Field>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Détails du projet</h2>
                    <fieldset>
                      <legend className="mb-3 block text-sm font-medium text-foreground">Prestations souhaitées</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {needs.map((need) => (
                          <label key={need} className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-[15px] transition-colors",
                            formData.features.includes(need) ? "border-primary bg-primary/5" : "border-input hover:border-primary/50",
                          )}>
                            <input type="checkbox" checked={formData.features.includes(need)} onChange={() => toggleNeed(need)}
                              className="h-4 w-4 accent-[var(--primary)]" />
                            {need}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <Field label="Description du projet" required htmlFor="description">
                      <textarea id="description" name="description" required minLength={10} rows={6} value={formData.description} onChange={handleChange}
                        className={`${inputClass} resize-y`} placeholder="Lieu, surface, équipements existants, objectifs..." />
                    </Field>
                    <dl className="grid gap-x-6 gap-y-2 rounded-lg bg-secondary p-5 text-sm sm:grid-cols-3">
                      <div><dt className="text-muted-foreground">Projet</dt><dd className="font-medium text-foreground">{formData.project_type || "—"}</dd></div>
                      <div><dt className="text-muted-foreground">Budget</dt><dd className="font-medium text-foreground">{formData.budget || "—"}</dd></div>
                      <div><dt className="text-muted-foreground">Délai</dt><dd className="font-medium text-foreground">{formData.timeline || "—"}</dd></div>
                    </dl>
                    {status === "error" && <FormError>{errorMsg}</FormError>}
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                  <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)} className={step === 0 ? "invisible" : ""}>
                    <ArrowLeft className="mr-1 h-4 w-4" /> Précédent
                  </Button>
                  {step < steps.length - 1 ? (
                    <Button type="button" onClick={next} className="h-11 px-6">
                      Continuer <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={status === "loading"} className="h-11 px-6">
                      {status === "loading" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi...</> : "Envoyer la demande"}
                    </Button>
                  )}
                </div>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Vous préférez nous appeler ?{" "}
                <a href={company.phoneHref} className="font-medium text-foreground hover:text-primary">{company.phone}</a>
              </p>
            </>
          )}
        </div>
      </Section>

      <Footer />
    </main>
  )
}
