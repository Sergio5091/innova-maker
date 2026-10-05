"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ArticleForm } from "@/components/admin/article-form"

// Page statique : l'id est passé en paramètre (?id=...) pour rester compatible avec output: "export"
function EditArticle() {
  const id = useSearchParams().get("id")
  if (!id) return <p className="text-sm text-destructive">Identifiant de l'article manquant.</p>
  return <ArticleForm articleId={id} />
}

export default function EditArticlePage() {
  return (
    <Suspense fallback={null}>
      <EditArticle />
    </Suspense>
  )
}
