import { cn } from "@/lib/utils"

// Champs de formulaire homogènes pour les pages publiques (contact, devis).

export const inputClass =
  "w-full rounded-lg border border-input bg-white px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"

export function Field({
  label, required, htmlFor, className, children,
}: {
  label: string
  required?: boolean
  htmlFor?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-foreground">
        {label}{required && <span className="text-primary"> *</span>}
      </label>
      {children}
    </div>
  )
}

export function FormError({ children }: { children: React.ReactNode }) {
  return <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{children}</p>
}

export function cardClass(className?: string) {
  return cn("rounded-2xl border border-border bg-white p-6 sm:p-8", className)
}
