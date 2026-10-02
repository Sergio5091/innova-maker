import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PageHero, Section } from "@/components/site/layout"
import { company } from "@/lib/site"

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
}

export default function LegalPage() {
  return (
    <main>
      <Navigation />
      <PageHero title="Mentions légales" breadcrumb={[{ label: "Mentions légales" }]} />

      <Section>
        <div className="article-content max-w-3xl">
          <h2>Éditeur du site</h2>
          <p>
            {company.name}<br />
            {company.address}<br />
            Téléphone : <a href={company.phoneHref}>{company.phone}</a><br />
            Email : <a href={`mailto:${company.email}`}>{company.email}</a>
            {/* À compléter : forme juridique, numéro RCCM, IFU, nom du directeur de la publication */}
          </p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé sur un serveur privé virtuel fourni par Namecheap, Inc. (Phoenix, Arizona, États-Unis)
            et distribué via le réseau Cloudflare, Inc. (San Francisco, Californie, États-Unis).
          </p>

          <h2>Données personnelles</h2>
          <p>
            Les informations transmises via les formulaires de contact, de demande de devis et d'inscription à la newsletter
            sont utilisées uniquement par {company.name} pour répondre à vos demandes et vous tenir informé. Elles ne sont ni
            vendues ni cédées à des tiers.
          </p>
          <p>
            Vous pouvez demander à tout moment l'accès, la rectification ou la suppression de vos données en écrivant à{" "}
            <a href={`mailto:${company.email}`}>{company.email}</a>.
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus de ce site (textes, logos, visuels) est la propriété de {company.name}, sauf mention
            contraire. Toute reproduction sans autorisation préalable est interdite.
          </p>
        </div>
      </Section>

      <Footer />
    </main>
  )
}
