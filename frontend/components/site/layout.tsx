import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { company } from "@/lib/site"

// Briques de mise en page communes à toutes les pages publiques.

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-6 lg:px-8", className)}>{children}</div>
}

export function Section({
  className, tone = "default", id, children,
}: {
  className?: string
  tone?: "default" | "muted"
  id?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={cn("py-20 lg:py-28", tone === "muted" && "bg-secondary", className)}>
      <Container>{children}</Container>
    </section>
  )
}

export function Eyebrow({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn("text-sm font-semibold uppercase tracking-[0.12em] text-primary", className)}>
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow, title, description, align = "left", className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl text-balance">{title}</h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  )
}

/** En-tête des pages intérieures : bandeau sombre, fil d'Ariane, titre et introduction. */
export function PageHero({
  eyebrow, title, description, breadcrumb, children,
}: {
  eyebrow?: string
  title: string
  description?: string
  breadcrumb?: { href?: string; label: string }[]
  children?: React.ReactNode
}) {
  return (
    <section className="bg-ink pt-32 pb-16 text-white lg:pt-40 lg:pb-20">
      <Container>
        {breadcrumb && (
          <nav aria-label="Fil d'Ariane" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-white">Accueil</Link>
            {breadcrumb.map((item) => (
              <span key={item.label} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                {item.href ? <Link href={item.href} className="hover:text-white">{item.label}</Link> : <span className="text-white/90">{item.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <div className="max-w-3xl">
          {eyebrow && <Eyebrow className="mb-4 text-[#5c9dff]">{eyebrow}</Eyebrow>}
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl text-balance">{title}</h1>
          {description && <p className="mt-6 text-lg leading-relaxed text-white/70">{description}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </Container>
    </section>
  )
}

/** Bandeau d'appel à l'action placé en bas des pages. */
export function CtaBand({
  title = "Un projet en tête ?",
  description = "Décrivez-nous votre besoin : nous revenons vers vous avec une proposition claire et chiffrée.",
}: { title?: string; description?: string }) {
  return (
    <section className="bg-primary">
      <Container className="flex flex-col items-start justify-between gap-8 py-16 lg:flex-row lg:items-center">
        <div className="max-w-2xl text-white">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl text-balance">{title}</h2>
          <p className="mt-3 text-lg text-white/80">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 bg-white px-6 text-primary hover:bg-white/90">
            <Link href="/quote">Demander un devis <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 border-white/40 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
            <a href={company.phoneHref}>{company.phone}</a>
          </Button>
        </div>
      </Container>
    </section>
  )
}
