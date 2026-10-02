import type { Metadata } from "next"
import { ServicePage } from "@/components/site/service-page"
import { services } from "@/lib/site"

const service = services.find((s) => s.key === "engineering")!

export const metadata: Metadata = {
  title: "Ingénierie & IoT",
  description: service.intro,
}

export default function Page() {
  return <ServicePage serviceKey="engineering" />
}
