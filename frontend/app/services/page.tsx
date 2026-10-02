import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/site/layout"
import { processSteps, services } from "@/lib/site"

export const metadata: Metadata = {
  title: "Nos services",
  description: "Affichage LED, énergie solaire, domotique, ingénierie et IoT : découvrez les expertises d'INOVA Makers.",
}

export default function ServicesPage() {
  return (
    <main>
      <Navigation />

      <PageHero
        eyebrow="Nos services"
        title="Quatre expertises pour vos projets technologiques"
        description="De l'étude à la maintenance, nous prenons en charge l'ensemble de votre projet avec une seule équipe et un seul interlocuteur."
        breadcrumb={[{ label: "Services" }]}
      />

      <Section>
        <div className="divide-y divide-border border-y border-border">
          {services.map((s) => (
            <article key={s.key} className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </span>
                <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{s.name}</h2>
                <p className="mt-2 font-medium text-primary">{s.tagline}</p>
              </div>
              <div className="lg:col-span-7">
                <p className="text-lg leading-relaxed text-muted-foreground">{s.intro}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {s.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-foreground/80">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> {h}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-8 h-11">
                  <Link href={s.href}>Découvrir {s.name} <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Notre méthode" title="Comment nous travaillons" />
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <li key={step.title} className="border-t-2 border-primary pt-6">
              <span className="text-sm font-semibold text-primary">Étape {String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand />
      <Footer />
    </main>
  )
}
