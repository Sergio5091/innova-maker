// =========================================================
// Contenu central du site INOVA Makers.
// Modifier ici les coordonnées, chiffres, services et réseaux sociaux :
// toutes les pages lisent ce fichier.
// =========================================================
import {
  Monitor, Sun, Home, Cpu,
  Tv, Signpost, Clock, LayoutPanelTop,
  PanelTop, BatteryCharging, Gauge, Wrench,
  Lightbulb, ShieldCheck, Thermometer, Smartphone,
  CircuitBoard, Radio, Layers, Workflow,
  type LucideIcon,
} from "lucide-react"

export const company = {
  name: "INOVA Makers",
  slogan: "Vous avez l'idée. Nous avons l'ingénierie.",
  foundedYear: 2014,
  city: "Godomey",
  country: "Bénin",
  address: "Aïmevo – Godomey, Bénin",
  phone: "+229 44 55 77 77",
  phoneHref: "tel:+22944557777",
  email: "contact@inovamakers.io",
  hours: [
    { days: "Lundi – Vendredi", time: "9h – 18h" },
    { days: "Samedi", time: "9h – 14h" },
    { days: "Dimanche", time: "Fermé" },
  ],
}

// Chiffres clés — uniquement des valeurs réelles
export const stats = [
  { value: String(company.foundedYear), label: "Année de création" },
  { value: "50+", label: "Projets réalisés" },
  { value: "80+", label: "Clients accompagnés" },
  { value: "4", label: "Domaines d'expertise" },
]

// Réseaux sociaux : ajouter les liens réels ici (ils s'affichent automatiquement dans le footer).
// Exemple : { label: "Facebook", href: "https://facebook.com/inovamakers" }
export const socialLinks: { label: string; href: string }[] = []

export type Offering = { icon: LucideIcon; title: string; description: string }

export type Service = {
  key: string
  href: string
  /** Slug du service en base (GET /api/services/:slug), si le service existe dans l'admin */
  apiSlug?: string
  icon: LucideIcon
  name: string
  tagline: string
  summary: string
  intro: string
  highlights: string[]
  offerings: Offering[]
  applications: { title: string; description: string }[]
}

export const services: Service[] = [
  {
    key: "display",
    href: "/display",
    apiSlug: "display",
    icon: Monitor,
    name: "Affichage LED",
    tagline: "Écrans LED et affichage dynamique",
    summary: "Écrans LED intérieurs et extérieurs, enseignes dynamiques et horloges numériques.",
    intro:
      "Nous concevons, installons et maintenons des écrans LED et des systèmes d'affichage numérique pour rendre votre communication visible, de jour comme de nuit.",
    highlights: ["Écrans LED indoor et outdoor", "Enseignes dynamiques", "Horloges et afficheurs numériques", "Installation et maintenance"],
    offerings: [
      { icon: Tv, title: "Écrans LED grand format", description: "Écrans haute luminosité pour façades, événements, stades et centres commerciaux." },
      { icon: Signpost, title: "Enseignes dynamiques", description: "Enseignes lumineuses programmables pour commerces et agences." },
      { icon: Clock, title: "Horloges numériques", description: "Afficheurs d'heure et de température pour espaces publics et bâtiments." },
      { icon: LayoutPanelTop, title: "Affichage informatif", description: "Écrans d'information pour l'accueil, la communication interne ou les files d'attente." },
    ],
    applications: [
      { title: "Commerces et enseignes", description: "Mise en avant des offres et de la marque en vitrine ou en façade." },
      { title: "Événementiel", description: "Écrans pour concerts, conférences, salons et cérémonies." },
      { title: "Bâtiments et institutions", description: "Information du public, horaires et communication interne." },
      { title: "Espaces sportifs", description: "Affichage des scores et diffusion de contenus." },
    ],
  },
  {
    key: "solar",
    href: "/solaire",
    icon: Sun,
    name: "Énergie solaire",
    tagline: "Installations photovoltaïques et stockage",
    summary: "Kits et installations solaires, stockage par batteries et suivi de production.",
    intro:
      "Nous dimensionnons et installons des systèmes solaires adaptés à votre consommation, pour réduire votre facture et sécuriser votre alimentation face aux coupures.",
    highlights: ["Étude et dimensionnement", "Panneaux et onduleurs", "Stockage par batteries", "Suivi et maintenance"],
    offerings: [
      { icon: PanelTop, title: "Installations photovoltaïques", description: "Systèmes solaires pour habitations, bureaux, commerces et sites isolés." },
      { icon: BatteryCharging, title: "Stockage d'énergie", description: "Batteries et onduleurs pour garder le courant pendant les coupures." },
      { icon: Gauge, title: "Suivi de production", description: "Mesure de la production et de la consommation pour optimiser l'installation." },
      { icon: Wrench, title: "Maintenance", description: "Contrôle, nettoyage et remplacement des équipements dans la durée." },
    ],
    applications: [
      { title: "Entreprises et bureaux", description: "Réduction des coûts d'électricité et continuité d'activité." },
      { title: "Commerces", description: "Alimentation fiable de l'éclairage, du froid et des caisses." },
      { title: "Habitations", description: "Autonomie énergétique et confort au quotidien." },
      { title: "Sites isolés", description: "Alimentation de sites non raccordés au réseau." },
    ],
  },
  {
    key: "domotics",
    href: "/domotics",
    apiSlug: "domotics-service",
    icon: Home,
    name: "Domotique",
    tagline: "Bâtiments intelligents et sécurisés",
    summary: "Éclairage, climatisation, sécurité et contrôle d'accès pilotés depuis votre téléphone.",
    intro:
      "Nous rendons vos bâtiments plus confortables, plus sûrs et plus économes en automatisant l'éclairage, la climatisation, la sécurité et les accès.",
    highlights: ["Éclairage intelligent", "Gestion de la climatisation", "Vidéosurveillance", "Contrôle d'accès"],
    offerings: [
      { icon: Lightbulb, title: "Éclairage intelligent", description: "Scénarios, détection de présence et pilotage à distance." },
      { icon: Thermometer, title: "Gestion climatique", description: "Programmation et contrôle de la climatisation pour plus de confort et d'économies." },
      { icon: ShieldCheck, title: "Sécurité connectée", description: "Vidéosurveillance, alarmes et alertes sur smartphone." },
      { icon: Smartphone, title: "Contrôle d'accès", description: "Serrures connectées, badges et interphones vidéo." },
    ],
    applications: [
      { title: "Maisons individuelles", description: "Confort, sécurité et pilotage à distance de la maison." },
      { title: "Immeubles résidentiels", description: "Gestion des parties communes, accès et interphonie." },
      { title: "Bureaux et commerces", description: "Économies d'énergie et sécurité des locaux." },
      { title: "Hôtels et résidences", description: "Gestion des chambres et des accès." },
    ],
  },
  {
    key: "engineering",
    href: "/engineering",
    apiSlug: "engineering",
    icon: Cpu,
    name: "Ingénierie & IoT",
    tagline: "Objets connectés et prototypes sur mesure",
    summary: "Conseil, conception d'objets connectés, prototypage et automatisation.",
    intro:
      "De l'idée au prototype fonctionnel, nous concevons des objets connectés et des systèmes électroniques sur mesure pour répondre à vos besoins métier.",
    highlights: ["Conseil et étude de faisabilité", "Objets connectés (IoT)", "Prototypage électronique", "Automatisation"],
    offerings: [
      { icon: Lightbulb, title: "Conseil et faisabilité", description: "Analyse du besoin, choix technologiques et chiffrage de votre projet." },
      { icon: Radio, title: "Objets connectés", description: "Capteurs et équipements connectés pour collecter et suivre vos données." },
      { icon: CircuitBoard, title: "Prototypage électronique", description: "Conception de cartes et de prototypes fonctionnels pour valider un concept." },
      { icon: Workflow, title: "Automatisation", description: "Automatisation de processus et supervision d'équipements à distance." },
      { icon: Layers, title: "Intégration de systèmes", description: "Connexion de vos équipements existants à de nouvelles solutions." },
    ],
    applications: [
      { title: "Industrie et agro-industrie", description: "Suivi de machines, de températures et de niveaux." },
      { title: "Agriculture", description: "Capteurs d'humidité, irrigation automatisée." },
      { title: "Logistique", description: "Suivi d'équipements et de conditions de stockage." },
      { title: "Porteurs de projet", description: "Transformation d'une idée en prototype démontrable." },
    ],
  },
]

export const processSteps = [
  { title: "Écoute et étude", description: "Nous analysons votre besoin, votre site et vos contraintes." },
  { title: "Proposition", description: "Vous recevez une solution chiffrée et un planning clair." },
  { title: "Réalisation", description: "Nos techniciens installent et configurent les équipements." },
  { title: "Suivi", description: "Mise en service, formation et maintenance dans la durée." },
]

export const navigation = {
  main: [
    { href: "/shop", label: "Boutique" },
    { href: "/blog", label: "Actualités" },
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ],
}
