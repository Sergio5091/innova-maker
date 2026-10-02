"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ServiceForm } from "@/components/admin/service-form"

// Page statique : l'id est passé en paramètre (?id=...) pour rester compatible avec output: "export"
function EditService() {
  const id = useSearchParams().get("id")
  if (!id) return <p className="text-sm text-destructive">Identifiant du service manquant.</p>
  return <ServiceForm serviceId={id} />
}

export default function EditServicePage() {
  return (
    <Suspense fallback={null}>
      <EditService />
    </Suspense>
  )
}
