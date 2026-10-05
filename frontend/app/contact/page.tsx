"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle2, ArrowRight } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PageHero, Section } from "@/components/site/layout"
import { Field, FormError, cardClass, inputClass } from "@/components/site/form"
import { company } from "@/lib/site"
import { api } from "@/lib/api"

const emptyForm = { name: "", email: "", phone: "", company: "", subject: "", message: "", type: "general" }

export default function ContactPage() {
  const [formData, setFormData] = useState(emptyForm)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")
    try {
      await api.post("/contacts", formData)
      setStatus("success")
      setFormData(emptyForm)
    } catch (err: any) {
      setStatus("error")
      setErrorMsg(err.message || "Une erreur est survenue. Réessayez.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const contactItems = [
    { icon: Phone, label: "Téléphone", value: company.phone, href: company.phoneHref },
    { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
    { icon: MapPin, label: "Adresse", value: company.address },
  ]

  return (
    <main>
      <Navigation />

      <PageHero
        eyebrow="Contact"
        title="Parlons de votre projet"
        description="Une question, un besoin d'information ou un projet à lancer ? Écrivez-nous, notre équipe vous répond sous 24 h ouvrées."
        breadcrumb={[{ label: "Contact" }]}
      />

      <Section tone="muted">
        <div className="grid items-start gap-8 lg:grid-cols-12">
          <div className={cardClass("lg:col-span-7")}>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Envoyez-nous un message</h2>

            {status === "success" ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
                <h3 className="mt-4 text-xl font-semibold text-foreground">Message envoyé</h3>
                <p className="mt-2 text-muted-foreground">Merci, nous vous répondons sous 24 h ouvrées.</p>
                <Button onClick={() => setStatus("idle")} variant="outline" className="mt-6">Envoyer un autre message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Nom complet" required htmlFor="name">
                    <input id="name" name="name" required value={formData.name} onChange={handleChange} className={inputClass} autoComplete="name" />
                  </Field>
                  <Field label="Email" required htmlFor="email">
                    <input id="email" type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} autoComplete="email" />
                  </Field>
                  <Field label="Téléphone" htmlFor="phone">
                    <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+229" autoComplete="tel" />
                  </Field>
                  <Field label="Entreprise" htmlFor="company">
                    <input id="company" name="company" value={formData.company} onChange={handleChange} className={inputClass} autoComplete="organization" />
                  </Field>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  <Field label="Sujet" required htmlFor="subject" className="sm:col-span-2">
                    <input id="subject" name="subject" required value={formData.subject} onChange={handleChange} className={inputClass} />
                  </Field>
                  <Field label="Type de demande" htmlFor="type">
                    <select id="type" name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                      <option value="general">Information</option>
                      <option value="support">Support technique</option>
                      <option value="partnership">Partenariat</option>
                      <option value="complaint">Réclamation</option>
                    </select>
                  </Field>
                </div>

                <Field label="Message" required htmlFor="message">
                  <textarea id="message" name="message" required minLength={10} rows={6} value={formData.message} onChange={handleChange}
                    className={`${inputClass} resize-y`} placeholder="Décrivez votre besoin..." />
                </Field>

                {status === "error" && <FormError>{errorMsg}</FormError>}

                <Button type="submit" size="lg" disabled={status === "loading"} className="h-12 w-full sm:w-auto sm:px-8">
                  {status === "loading" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...</> : "Envoyer le message"}
                </Button>
              </form>
            )}
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className={cardClass()}>
              <h2 className="text-lg font-semibold text-foreground">Coordonnées</h2>
              <ul className="mt-6 space-y-5">
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm text-muted-foreground">{label}</span>
                      {href ? (
                        <a href={href} className="font-medium text-foreground hover:text-primary">{value}</a>
                      ) : (
                        <span className="font-medium text-foreground">{value}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={cardClass()}>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Clock className="h-5 w-5 text-primary" /> Horaires
              </h2>
              <dl className="mt-5 divide-y divide-border">
                {company.hours.map((h) => (
                  <div key={h.days} className="flex justify-between py-3 text-sm">
                    <dt className="text-muted-foreground">{h.days}</dt>
                    <dd className="font-medium text-foreground">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl bg-ink p-8 text-white">
              <h2 className="text-lg font-semibold">Vous avez un projet précis ?</h2>
              <p className="mt-2 text-white/70">Décrivez-le en quelques étapes pour recevoir une proposition chiffrée.</p>
              <Button asChild className="mt-6 h-11">
                <Link href="/quote">Demander un devis <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      <Footer />
    </main>
  )
}
