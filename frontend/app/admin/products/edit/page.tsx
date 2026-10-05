"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"

// Page statique : l'id est passé en paramètre (?id=...) pour rester compatible avec output: "export"
function EditProduct() {
  const id = useSearchParams().get("id")
  if (!id) return <p className="text-sm text-destructive">Identifiant du produit manquant.</p>
  return <ProductForm productId={id} />
}

export default function EditProductPage() {
  return (
    <Suspense fallback={null}>
      <EditProduct />
    </Suspense>
  )
}
