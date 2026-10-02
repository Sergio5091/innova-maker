import type { Metadata } from "next"
import { Lightbulb, Award, ShieldCheck, Handshake } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Container, CtaBand, PageHero, Section, SectionHeading } from "@/components/site/layout"
import { company, stats } from "@/lib/site"

export const metadata: Metadata = {
  title: "À propos",
  description: `INOVA Makers, entreprise d'ingénierie technologique fondée en ${company.foundedYear} à ${company.city} (Bénin).`,
}

const values = [
  { icon: Lightbulb, title: "Innovation", description: "Nous choisissons des technologies modernes et éprouvées, adaptées à chaque besoin." },
  { icon: Award, title: "Qualité", description: "Des installations soignées, documentées et testées avant la mise en service." },
  { icon: ShieldCheck, title: "Fiabilité", description: "Des solutions conçues pour durer et fonctionner dans les conditions locales." },
  { icon: Handshake, title: "Proximité", description: "Une relation directe, des explications claires et un suivi après installation." },
]

export default function AboutPage() {
  const years = new Date().getFullYear() - company.foundedYear

  return (
    <main>
      <Navigation />

      <PageHero
        eyebrow="À propos"
        title={`Une équipe d'ingénierie au service de vos projets depuis ${company.foundedYear}`}
        description={`Fondée à ${company.city}, INOVA Makers conçoit, installe et maintient des solutions technologiques pour les entreprises, les institutions et les particuliers au ${company.country}.`}
        breadcrumb={[{ label: "À propos" }]}
      />

      {/* Histoire */}
      <Section>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Notre histoire" title={`Plus de ${years} ans d'expérience terrain`} />
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground lg:col-span-7">
            <p>
              INOVA Makers est née en {company.foundedYear} à {company.city} d'une conviction : la technologie doit être
              utile, fiable et accessible. Depuis, nous accompagnons nos clients sur des projets concrets dans quatre domaines :
              l'affichage LED, l'énergie solaire, la domotique, ainsi que l'ingénierie et l'IoT.
            </p>
            <p>
              Notre force : une équipe qui maîtrise l'ensemble de la chaîne, de l'étude technique à la maintenance. Vous avez
              un seul interlocuteur, qui connaît votre installation et reste disponible dans la durée.
            </p>
          </div>
        </div>
      </Section>

      {/* Chiffres */}
      <section className="border-y border-border bg-secondary">
        <Container>
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="py-10">
                <dt className="text-sm text-muted-foreground">{s.label}</dt>
                <dd className="mt-2 text-4xl font-semibold tracking-tight text-foreground">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Mission & vision */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Notre mission</p>
            <p className="mt-4 text-xl leading-relaxed text-foreground">
              Améliorer la performance des entreprises et la qualité de vie de nos clients grâce à des solutions
              technologiques fiables, bien installées et bien suivies.
            </p>
          </div>
          <div className="rounded-2xl border border-border p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Notre vision</p>
            <p className="mt-4 text-xl leading-relaxed text-foreground">
              Devenir le partenaire technologique de référence au {company.country} pour les entreprises, les bâtiments
              et les villes intelligentes, avec des solutions durables et adaptées aux réalités locales.
            </p>
          </div>
        </div>
      </Section>

      {/* Valeurs */}
      <Section tone="muted">
        <SectionHeading eyebrow="Nos valeurs" title="Ce qui guide notre travail" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-white p-7">
              <v.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{v.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand title="Travaillons ensemble" />
      <Footer />
    </main>
  )
}
