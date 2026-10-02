import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check, MapPin, Users, Wrench, SlidersHorizontal } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Container, CtaBand, Eyebrow, Section, SectionHeading } from "@/components/site/layout"
import { company, processSteps, services, stats } from "@/lib/site"

const strengths = [
  { icon: MapPin, title: "Une équipe locale", description: `Basés à ${company.city}, nous intervenons rapidement et connaissons les contraintes du terrain béninois.` },
  { icon: Users, title: "Un interlocuteur unique", description: "La même équipe vous accompagne de l'étude à la mise en service, puis pour la maintenance." },
  { icon: SlidersHorizontal, title: "Des solutions sur mesure", description: "Chaque installation est dimensionnée selon votre besoin, votre site et votre budget." },
  { icon: Wrench, title: "Un suivi dans la durée", description: "Maintenance, assistance et évolutions : nous restons à vos côtés après l'installation." },
]

const audiences = ["Entreprises", "Commerces", "Institutions", "Hôtels et résidences", "Événementiel", "Particuliers"]

export default function HomePage() {
  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-white pt-[72px]">
        <div aria-hidden className="absolute inset-y-0 right-0 hidden w-[42%] bg-secondary lg:block" />
        <Container className="relative grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7 lg:pr-8">
            <Eyebrow>Ingénierie technologique · Bénin, depuis {company.foundedYear}</Eyebrow>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] text-balance">
              Écrans LED, énergie solaire, domotique et IoT, de l'étude à la mise en service.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              INOVA Makers conçoit, installe et maintient des équipements technologiques pour les entreprises,
              les institutions et les particuliers. {company.slogan}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6">
                <Link href="/quote">Demander un devis <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6">
                <Link href="/services">Découvrir nos services</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Réponse sous 24 h ouvrées · Intervention dans tout le Bénin</p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-white p-2 shadow-[0_24px_60px_-24px_rgba(10,22,40,0.25)]">
              <p className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Nos domaines d'expertise</p>
              <ul>
                {services.map((s) => (
                  <li key={s.key}>
                    <Link href={s.href} className="group flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-secondary">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                        <s.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-foreground">{s.name}</span>
                        <span className="block text-sm text-muted-foreground sm:truncate">{s.tagline}</span>
                      </span>
                      <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Chiffres clés */}
      <section className="border-b border-border bg-white">
        <Container>
          <dl className="grid grid-cols-2 divide-border lg:grid-cols-4 lg:divide-x">
            {stats.map((s) => (
              <div key={s.label} className="py-10 lg:px-8 lg:first:pl-0">
                <dt className="text-sm text-muted-foreground">{s.label}</dt>
                <dd className="mt-2 text-4xl font-semibold tracking-tight text-foreground">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Services */}
      <Section tone="muted">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Nos services"
            title="Quatre expertises, une seule équipe"
            description="Nous couvrons l'ensemble du projet : étude, fourniture des équipements, installation, mise en service et maintenance."
          />
          <Button asChild variant="outline" className="h-11 self-start lg:self-auto">
            <Link href="/services">Tous nos services <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <Link
              key={s.key}
              href={s.href}
              className="group flex flex-col rounded-2xl border border-border bg-white p-8 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-foreground">{s.name}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.summary}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {s.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {h}
                  </li>
                ))}
              </ul>
              <span className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                En savoir plus <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Méthode */}
      <Section>
        <SectionHeading
          eyebrow="Notre méthode"
          title="Un projet maîtrisé, étape par étape"
          description="Une démarche simple et transparente, pour que vous sachiez toujours où en est votre projet."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <li key={step.title} className="bg-white p-8">
              <span className="text-sm font-semibold text-primary">Étape {String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Pourquoi INOVA */}
      <Section tone="muted">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Pourquoi INOVA Makers"
              title={`Plus de ${new Date().getFullYear() - company.foundedYear} ans au service des projets technologiques au Bénin`}
              description={`Depuis ${company.foundedYear}, nous avons mené plus de 50 projets pour plus de 80 clients, avec la même exigence : des installations fiables, bien expliquées et suivies.`}
            />
            <div className="mt-10">
              <p className="text-sm font-semibold text-foreground">Nous accompagnons</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {audiences.map((a) => (
                  <li key={a} className="rounded-full border border-border bg-white px-4 py-1.5 text-sm text-foreground/80">{a}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {strengths.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-white p-7">
                <s.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-5 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand />
      <Footer />
    </main>
  )
}
