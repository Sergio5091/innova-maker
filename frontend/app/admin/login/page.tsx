"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { images } from "@/lib/site"

const inputClass =
  "w-full rounded-lg border border-input bg-white py-3 pl-11 pr-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Déjà connecté : direction le dashboard
  useEffect(() => {
    if (localStorage.getItem("admin_token")) router.replace("/admin")
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const data = await api.post("/auth/login", form)
      localStorage.setItem("admin_token", data.token)
      localStorage.setItem("admin_user", JSON.stringify(data.admin))
      router.push("/admin")
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects")
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Panneau visuel */}
      <aside className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between lg:p-12">
        <img src={images.hero.src} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />

        <Link href="/" className="relative" aria-label="INOVA Makers — Accueil">
          <img src="/logoINOVAMakers-blanc.svg" alt="INOVA Makers" className="h-10 w-auto" />
        </Link>

        <div className="relative max-w-md text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5c9dff]">Espace administration</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-balance">
            Gérez votre site, vos demandes et votre catalogue.
          </h1>
          <ul className="mt-8 space-y-3 text-white/75">
            <li>Demandes de contact et de devis</li>
            <li>Produits, articles et services</li>
            <li>Abonnés à la newsletter</li>
          </ul>
        </div>

        <p className="relative text-sm text-white/50">© {new Date().getFullYear()} INOVA Makers</p>
      </aside>

      {/* Formulaire */}
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:hidden" aria-label="INOVA Makers — Accueil">
            <img src="/logoINOVAMakers.svg" alt="INOVA Makers" className="h-8 w-auto" />
          </Link>
          <Link href="/" className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Retour au site
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">Connexion</h2>
          <p className="mt-2 text-muted-foreground">Accès réservé à l'équipe INOVA Makers.</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">Adresse email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="username"
                  autoFocus
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="vous@inovamakers.io"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">Mot de passe</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="h-12 w-full text-[15px]">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion...</> : "Se connecter"}
            </Button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground">
            Mot de passe oublié ? Contactez l'administrateur du site.
          </p>
        </div>
      </main>
    </div>
  )
}
