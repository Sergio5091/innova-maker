import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/site/layout"
import { processSteps, services } from "@/lib/site"

/** Page détaillée d'un service, entièrement alimentée par lib/site.ts */
export function ServicePage({ serviceKey }: { serviceKey: string }) {
  const service = services.find((s) => s.key === serviceKey)!
  const others = services.filter((s) => s.key !== serviceKey)

  return (
    <main>
      <Navigation />

      <PageHero
        eyebrow={service.tagline}
        title={service.name}
        description={service.intro}
        breadcrumb={[{ href: "/services", label: "Services" }, { label: service.name }]}
      >
        <Button asChild size="lg" className="h-12 px-6">
          <Link href="/quote">Demander un devis <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
          <Link href="/contact">Parler à un expert</Link>
        </Button>
      </PageHero>

      {/* Prestations */}
      <Section>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Nos prestations" title="Ce que nous réalisons pour vous" />
            <ul className="mt-8 space-y-3">
              {service.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-foreground/80">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
            {service.offerings.map((o) => (
              <div key={o.title} className="rounded-2xl border border-border p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <o.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{o.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{o.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Domaines d'application */}
      <Section tone="muted">
        <SectionHeading eyebrow="Domaines d'application" title="Pour qui ?" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {service.applications.map((a) => (
            <div key={a.title} className="bg-white p-8">
              <h3 className="font-semibold text-foreground">{a.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{a.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Méthode */}
      <Section>
        <SectionHeading eyebrow="Notre méthode" title="Comment se déroule votre projet" />
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

      {/* Autres services */}
      <Section tone="muted" className="py-16 lg:py-20">
        <h2 className="text-xl font-semibold text-foreground">Nos autres expertises</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {others.map((s) => (
            <Link key={s.key} href={s.href} className="group flex items-center gap-4 rounded-xl border border-border bg-white p-5 transition-colors hover:border-primary/40">
              <s.icon className="h-6 w-6 shrink-0 text-primary" />
              <span className="flex-1">
                <span className="block font-semibold text-foreground">{s.name}</span>
                <span className="block text-sm text-muted-foreground">{s.tagline}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Parlons de votre projet"
        description={`Un besoin en ${service.name} ? Décrivez-nous votre projet : nous revenons vers vous avec une proposition claire et chiffrée.`}
      />
      <Footer />
    </main>
  )
}
