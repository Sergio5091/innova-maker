import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { company, navigation, services, socialLinks } from "@/lib/site"

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="INOVA Makers — Accueil">
              <img src="/logoINOVAMakers-blanc.svg" alt="INOVA Makers" className="h-10 w-auto" />
            </Link>
            <p className="mt-6 max-w-sm leading-relaxed">
              Écrans LED, énergie solaire, domotique et IoT. Une équipe d'ingénierie basée à {company.city} depuis {company.foundedYear}.
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                {socialLinks.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white">Services</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.key}><Link href={s.href} className="hover:text-white">{s.name}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">Entreprise</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {navigation.main.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
              ))}
              <li><Link href="/quote" className="hover:text-white">Demander un devis</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{company.address}</li>
              <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0" /><a href={company.phoneHref} className="hover:text-white">{company.phone}</a></li>
              <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0" /><a href={`mailto:${company.email}`} className="hover:text-white">{company.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {company.name}. Tous droits réservés.</p>
          <Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link>
        </div>
      </div>
    </footer>
  )
}
