"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { company, navigation, services } from "@/lib/site"

export function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Ferme les menus au changement de page
  useEffect(() => { setMobileOpen(false); setServicesOpen(false) }, [pathname])

  // Ferme le menu Services au clic extérieur ou avec Échap
  useEffect(() => {
    if (!servicesOpen) return
    const onClick = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setServicesOpen(false)
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [servicesOpen])

  const normalized = pathname.replace(/\/$/, "") || "/"
  const isActive = (href: string) => normalized === href || normalized.startsWith(`${href}/`)
  const servicesActive = services.some((s) => isActive(s.href)) || isActive("/services")

  const linkClass = (active: boolean) =>
    cn(
      "rounded-md px-3 py-2 text-[15px] font-medium transition-colors",
      active ? "text-primary" : "text-foreground/75 hover:text-foreground",
    )

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow",
        scrolled ? "border-border shadow-[0_1px_12px_rgba(10,22,40,0.06)]" : "border-transparent",
      )}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Navigation principale">
        <Link href="/" className="flex shrink-0 items-center" aria-label="INOVA Makers — Accueil">
          <img src="/logoINOVAMakers.svg" alt="INOVA Makers" className="h-9 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 lg:flex">
          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              onClick={() => setServicesOpen((o) => !o)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              className={cn(linkClass(servicesActive), "flex items-center gap-1")}
            >
              Services
              <ChevronDown className={cn("h-4 w-4 transition-transform", servicesOpen && "rotate-180")} />
            </button>

            {servicesOpen && (
              <div className="absolute left-1/2 top-full mt-3 w-[560px] -translate-x-1/2 rounded-xl border border-border bg-white p-3 shadow-xl">
                <div className="grid grid-cols-2 gap-1">
                  {services.map((s) => (
                    <Link
                      key={s.key}
                      href={s.href}
                      className="flex gap-3 rounded-lg p-3 transition-colors hover:bg-secondary"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <s.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-foreground">{s.name}</span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{s.tagline}</span>
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/services"
                  className="mt-2 block rounded-lg bg-secondary px-4 py-3 text-sm font-medium text-foreground hover:text-primary"
                >
                  Voir tous nos services →
                </Link>
              </div>
            )}
          </div>

          {navigation.main.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(isActive(l.href))}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <a href={company.phoneHref} className="flex items-center gap-2 text-sm font-medium text-foreground/75 hover:text-foreground">
            <Phone className="h-4 w-4" /> {company.phone}
          </a>
          <Button asChild className="h-10 px-5">
            <Link href="/quote">Demander un devis</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="-mr-2 rounded-md p-2 text-foreground lg:hidden"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-border bg-white lg:hidden">
          <div className="space-y-6 px-6 py-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Services</p>
              <div className="space-y-1">
                {services.map((s) => (
                  <Link key={s.key} href={s.href} className="flex items-center gap-3 rounded-lg py-2 text-foreground">
                    <s.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{s.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="space-y-1 border-t border-border pt-4">
              {navigation.main.map((l) => (
                <Link key={l.href} href={l.href} className="block rounded-lg py-2 font-medium text-foreground">
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 border-t border-border pt-6">
              <Button asChild size="lg">
                <Link href="/quote">Demander un devis</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={company.phoneHref}><Phone className="mr-2 h-4 w-4" /> {company.phone}</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
