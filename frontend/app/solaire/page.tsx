import type { Metadata } from "next"
import { ServicePage } from "@/components/site/service-page"
import { services } from "@/lib/site"

const service = services.find((s) => s.key === "solar")!

export const metadata: Metadata = {
  title: "Énergie solaire",
  description: service.intro,
}

export default function Page() {
  return <ServicePage serviceKey="solar" />
}
