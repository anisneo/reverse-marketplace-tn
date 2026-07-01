"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  Bike, Car, Zap, Smartphone, ChevronRight, ChevronLeft, Check, 
  Search, MapPin, Tag, Clock, X, Info, Sparkles, Plus, Trash2,
  Fuel, Gauge, Calendar, Palette, Users, Settings, HardDrive, Battery,
  Cpu, Monitor, Camera, Hash, Type, Wrench, Shield, Truck, Navigation,
  Thermometer, Volume2, Disc, Watch, Bike as BikeIcon, Package
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

// ============================================
// CATÉGORIES AVEC CRITÈRES SPÉCIFIQUES
// ============================================

interface CriterionField {
  key: string
  label: string
  type: "text" | "number" | "select" | "multiselect" | "boolean" | "range"
  placeholder?: string
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
  unit?: string
  icon: React.ElementType
  required?: boolean
  helperText?: string
}

interface CategoryConfig {
  id: string
  name: string
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
  textColor: string
  shadowColor: string
  description: string
  criteria: CriterionField[]
}

const categories: CategoryConfig[] = [
  {
    id: "moto",
    name: "Moto",
    icon: Bike,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
    shadowColor: "shadow-orange-500/20",
    description: "Scooters, motos, cross, sportives, roadsters...",
    criteria: [
      {
        key: "marque",
        label: "Marque",
        type: "select",
        icon: Tag,
        options: [
          { value: "yamaha", label: "Yamaha" },
          { value: "honda", label: "Honda" },
          { value: "kawasaki", label: "Kawasaki" },
          { value: "suzuki", label: "Suzuki" },
          { value: "ducati", label: "Ducati" },
          { value: "bmw", label: "BMW" },
          { value: "triumph", label: "Triumph" },
          { value: "kymco", label: "Kymco" },
          { value: "piaggio", label: "Piaggio" },
          { value: "vespa", label: "Vespa" },
          { value: "sym", label: "SYM" },
          { value: "benelli", label: "Benelli" },
          { value: "cfmoto", label: "CF Moto" },
          { value: "autre", label: "Autre" },
        ],
        required: true,
      },
      {
        key: "modele",
        label: "Modèle",
        type: "text",
        placeholder: "Ex: MT-07, TMAX, Ninja 400...",
        icon: Type,
        required: true,
      },
      {
        key: "type_moto",
        label: "Type de moto",
        type: "select",
        icon: BikeIcon,
        options: [
          { value: "sportive", label: "Sportive" },
          { value: "roadster", label: "Roadster / Naked" },
          { value: "trail", label: "Trail / Aventure" },
          { value: "custom", label: "Custom / Cruiser" },
          { value: "scooter", label: "Scooter" },
          { value: "maxi_scooter", label: "Maxi-scooter" },
          { value: "cross", label: "Cross / Enduro" },
          { value: "supermotard", label: "Supermotard" },
          { value: "trial", label: "Trial" },
          { value: "125cc", label: "125cc" },
          { value: "50cc", label: "50cc" },
          { value: "electrique", label: "Électrique" },
        ],
        required: true,
      },
      {
        key: "cylindree",
        label: "Cylindrée (cm³)",
        type: "select",
        icon: Gauge,
        options: [
          { value: "50", label: "50 cm³" },
          { value: "125", label: "125 cm³" },
          { value: "250", label: "250 cm³" },
          { value: "300", label: "300 cm³" },
          { value: "400", label: "400 cm³" },
          { value: "500", label: "500 cm³" },
          { value: "600", label: "600 cm³" },
          { value: "650", label: "650 cm³" },
          { value: "750", label: "750 cm³" },
          { value: "800", label: "800 cm³" },
          { value: "900", label: "900 cm³" },
          { value: "1000", label: "1000 cm³ et plus" },
        ],
      },
      {
        key: "annee_min",
        label: "Année minimum",
        type: "number",
        placeholder: "2015",
        icon: Calendar,
        min: 1950,
        max: 2026,
      },
      {
        key: "kilometrage_max",
        label: "Kilométrage max (km)",
        type: "number",
        placeholder: "30000",
        icon: Gauge,
        min: 0,
        step: 1000,
      },
      {
        key: "carburant",
        label: "Carburant",
        type: "select",
        icon: Fuel,
        options: [
          { value: "essence", label: "Essence" },
          { value: "diesel", label: "Diesel" },
          { value: "electrique", label: "Électrique" },
          { value: "hybride", label: "Hybride" },
        ],
      },
      {
        key: "couleur",
        label: "Couleur préférée",
        type: "text",
        placeholder: "Noir, rouge, bleu...",
        icon: Palette,
      },
      {
        key: "permis",
        label: "Permis requis",
        type: "select",
        icon: Shield,
        options: [
          { value: "A1", label: "A1 (125cc max)" },
          { value: "A2", label: "A2 (jusqu'à 47ch)" },
          { value: "A", label: "A (toutes cylindrées)" },
        ],
      },
      {
        key: "premiere_main",
        label: "Première main uniquement",
        type: "boolean",
        icon: Users,
      },
      {
        key: "abs",
        label: "ABS obligatoire",
        type: "boolean",
        icon: Shield,
      },
      {
        key: "carnet_entretien",
        label: "Carnet d'entretien",
        type: "boolean",
        icon: Wrench,
      },
    ],
  },
  {
    id: "voiture",
    name: "Voiture",
    icon: Car,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    shadowColor: "shadow-blue-500/20",
    description: "Berlines, SUVs, citadines, utilitaires, coupés...",
    criteria: [
      {
        key: "marque",
        label: "Marque",
        type: "select",
        icon: Tag,
        required: true,
        options: [
          { value: "renault", label: "Renault" },
          { value: "peugeot", label: "Peugeot" },
          { value: "citroen", label: "Citroën" },
          { value: "volkswagen", label: "Volkswagen" },
          { value: "bmw", label: "BMW" },
          { value: "mercedes", label: "Mercedes-Benz" },
          { value: "audi", label: "Audi" },
          { value: "toyota", label: "Toyota" },
          { value: "hyundai", label: "Hyundai" },
          { value: "kia", label: "Kia" },
          { value: "seat", label: "SEAT" },
          { value: "skoda", label: "Škoda" },
          { value: "ford", label: "Ford" },
          { value: "fiat", label: "Fiat" },
          { value: "nissan", label: "Nissan" },
          { value: "honda", label: "Honda" },
          { value: "mazda", label: "Mazda" },
          { value: "suzuki", label: "Suzuki" },
          { value: "dacia", label: "Dacia" },
          { value: "jeep", label: "Jeep" },
          { value: "land_rover", label: "Land Rover" },
          { value: "porsche", label: "Porsche" },
          { value: "tesla", label: "Tesla" },
          { value: "autre", label: "Autre" },
        ],
      },
      {
        key: "modele",
        label: "Modèle",
        type: "text",
        placeholder: "Ex: Clio 4, Golf 7, Tucson...",
        icon: Type,
        required: true,
      },
      {
        key: "type_voiture",
        label: "Type de véhicule",
        type: "select",
        icon: Car,
        required: true,
        options: [
          { value: "citadine", label: "Citadine" },
          { value: "berline", label: "Berline" },
          { value: "suv", label: "SUV / 4x4" },
          { value: "monospace", label: "Monospace" },
          { value: "break", label: "Break" },
          { value: "coupé", label: "Coupé" },
          { value: "cabriolet", label: "Cabriolet" },
          { value: "pickup", label: "Pickup" },
          { value: "utilitaire", label: "Utilitaire" },
          { value: "electrique", label: "Électrique" },
          { value: "hybride", label: "Hybride" },
        ],
      },
      {
        key: "carburant",
        label: "Carburant",
        type: "select",
        icon: Fuel,
        required: true,
        options: [
          { value: "essence", label: "Essence" },
          { value: "diesel", label: "Diesel" },
          { value: "electrique", label: "Électrique" },
          { value: "hybride", label: "Hybride" },
          { value: "gpl", label: "GPL" },
        ],
      },
      {
        key: "boite_vitesse",
        label: "Boîte de vitesses",
        type: "select",
        icon: Settings,
        options: [
          { value: "manuelle", label: "Manuelle" },
          { value: "automatique", label: "Automatique" },
          { value: "sequentielle", label: "Séquentielle" },
          { value: "cvt", label: "CVT" },
        ],
      },
      {
        key: "annee_min",
        label: "Année minimum",
        type: "number",
        placeholder: "2018",
        icon: Calendar,
        min: 1980,
        max: 2026,
      },
      {
        key: "kilometrage_max",
        label: "Kilométrage max (km)",
        type: "number",
        placeholder: "100000",
        icon: Gauge,
        min: 0,
        step: 5000,
      },
      {
        key: "puissance_min",
        label: "Puissance min (ch)",
        type: "number",
        placeholder: "90",
        icon: Zap,
        min: 0,
        max: 1000,
      },
      {
        key: "nb_portes",
        label: "Nombre de portes",
        type: "select",
        icon: Truck,
        options: [
          { value: "3", label: "3 portes" },
          { value: "5", label: "5 portes" },
          { value: "4", label: "4 portes" },
        ],
      },
      {
        key: "nb_places",
        label: "Nombre de places",
        type: "select",
        icon: Users,
        options: [
          { value: "2", label: "2 places" },
          { value: "4", label: "4 places" },
          { value: "5", label: "5 places" },
          { value: "7", label: "7 places et plus" },
        ],
      },
      {
        key: "couleur",
        label: "Couleur préférée",
        type: "text",
        placeholder: "Noir, blanc, gris...",
        icon: Palette,
      },
      {
        key: "premiere_main",
        label: "Première main",
        type: "boolean",
        icon: Users,
      },
      {
        key: "climatisation",
        label: "Climatisation",
        type: "boolean",
        icon: Thermometer,
      },
      {
        key: "gps",
        label: "GPS / Navigation",
        type: "boolean",
        icon: Navigation,
      },
      {
        key: "camera_recul",
        label: "Caméra de recul",
        type: "boolean",
        icon: Camera,
      },
      {
        key: "toit_ouvrant",
        label: "Toit ouvrant / panoramique",
        type: "boolean",
        icon: Disc,
      },
      {
        key: "regulateur_vitesse",
        label: "Régulateur de vitesse",
        type: "boolean",
        icon: Gauge,
      },
      {
        key: "sieges_cuir",
        label: "Sièges en cuir",
        type: "boolean",
        icon: Shield,
      },
      {
        key: "jantes_alu",
        label: "Jantes aluminium",
        type: "boolean",
        icon: Disc,
      },
    ],
  },
  {
    id: "velo",
    name: "Vélo",
    icon: Bike,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-600",
    shadowColor: "shadow-green-500/20",
    description: "VTT, route, électrique, pliant, gravel, urbain...",
    criteria: [
      {
        key: "type_velo",
        label: "Type de vélo",
        type: "select",
        icon: BikeIcon,
        required: true,
        options: [
          { value: "vtt", label: "VTT (Vélo Tout Terrain)" },
          { value: "route", label: "Vélo de route" },
          { value: "electrique", label: "Vélo électrique (VAE)" },
          { value: "pliant", label: "Vélo pliant" },
          { value: "gravel", label: "Gravel" },
          { value: "urbain", label: "Vélo urbain / Hollandais" },
          { value: "bmx", label: "BMX" },
          { value: "enfant", label: "Vélo enfant" },
          { value: "tandem", label: "Tandem" },
          { value: "cargo", label: "Vélo cargo" },
          { value: "fixie", label: "Fixie / Single speed" },
        ],
      },
      {
        key: "marque",
        label: "Marque",
        type: "select",
        icon: Tag,
        options: [
          { value: "giant", label: "Giant" },
          { value: "trek", label: "Trek" },
          { value: "specialized", label: "Specialized" },
          { value: "cannondale", label: "Cannondale" },
          { value: "scott", label: "Scott" },
          { value: "btwin", label: "Btwin / Decathlon" },
          { value: "canyon", label: "Canyon" },
          { value: "cube", label: "Cube" },
          { value: "lapierre", label: "Lapierre" },
          { value: "orbea", label: "Orbea" },
          { value: "bmc", label: "BMC" },
          { value: "look", label: "Look" },
          { value: "peugeot", label: "Peugeot" },
          { value: "autre", label: "Autre" },
        ],
      },
      {
        key: "taille_cadre",
        label: "Taille du cadre",
        type: "select",
        icon: Hash,
        options: [
          { value: "xs", label: "XS (34-38cm)" },
          { value: "s", label: "S (38-42cm)" },
          { value: "m", label: "M (42-46cm)" },
          { value: "l", label: "L (46-50cm)" },
          { value: "xl", label: "XL (50-54cm)" },
          { value: "xxl", label: "XXL (54cm+)" },
        ],
      },
      {
        key: "taille_roues",
        label: "Taille des roues",
        type: "select",
        icon: Disc,
        options: [
          { value: "20", label: "20 pouces" },
          { value: "24", label: "24 pouces" },
          { value: "26", label: "26 pouces" },
          { value: "27.5", label: "27.5 pouces" },
          { value: "29", label: "29 pouces" },
          { value: "700c", label: "700c (Route)" },
        ],
      },
      {
        key: "materiau_cadre",
        label: "Matériau du cadre",
        type: "select",
        icon: Wrench,
        options: [
          { value: "aluminium", label: "Aluminium" },
          { value: "carbone", label: "Carbone" },
          { value: "acier", label: "Acier" },
          { value: "titane", label: "Titane" },
        ],
      },
      {
        key: "nb_vitesses",
        label: "Nombre de vitesses",
        type: "select",
        icon: Settings,
        options: [
          { value: "1", label: "1 vitesse" },
          { value: "3", label: "3 vitesses" },
          { value: "7", label: "7 vitesses" },
          { value: "8", label: "8 vitesses" },
          { value: "9", label: "9 vitesses" },
          { value: "10", label: "10 vitesses" },
          { value: "11", label: "11 vitesses" },
          { value: "12", label: "12 vitesses" },
        ],
      },
      {
        key: "suspension",
        label: "Suspension",
        type: "select",
        icon: Wrench,
        options: [
          { value: "rigide", label: "Rigide (sans suspension)" },
          { value: "avant", label: "Avant uniquement" },
          { value: "double", label: "Double suspension" },
        ],
      },
      {
        key: "autonomie_min",
        label: "Autonomie min (km) — VAE",
        type: "number",
        placeholder: "50",
        icon: Battery,
        min: 0,
        step: 10,
        helperText: "Uniquement pour vélos électriques",
      },
      {
        key: "couleur",
        label: "Couleur",
        type: "text",
        placeholder: "Noir, rouge...",
        icon: Palette,
      },
      {
        key: "freins_disque",
        label: "Freins à disque",
        type: "boolean",
        icon: Disc,
      },
      {
        key: "eclairage",
        label: "Éclairage intégré",
        type: "boolean",
        icon: Zap,
      },
      {
        key: "porte_bagages",
        label: "Porte-bagages",
        type: "boolean",
        icon: Truck,
      },
    ],
  },
  {
    id: "trottinette",
    name: "Trottinette",
    icon: Zap,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
    shadowColor: "shadow-purple-500/20",
    description: "Électrique, adulte, enfant, tout-terrain, pliable...",
    criteria: [
      {
        key: "type_trottinette",
        label: "Type",
        type: "select",
        icon: Zap,
        required: true,
        options: [
          { value: "electrique", label: "Électrique" },
          { value: "manuelle", label: "Manuelle / Push" },
          { value: "enfant", label: "Enfant" },
          { value: "tout_terrain", label: "Tout-terrain" },
          { value: "pliant", label: "Pliable" },
        ],
      },
      {
        key: "marque",
        label: "Marque",
        type: "select",
        icon: Tag,
        options: [
          { value: "xiaomi", label: "Xiaomi" },
          { value: "segway", label: "Segway-Ninebot" },
          { value: "dualtron", label: "Dualtron" },
          { value: "kaabo", label: "Kaabo" },
          { value: "zero", label: "Zero / Speedual" },
          { value: "turbowheel", label: "Turbowheel" },
          { value: "inokim", label: "Inokim" },
          { value: "etwow", label: "E-TWOW" },
          { value: "mercane", label: "Mercane" },
          { value: "autre", label: "Autre" },
        ],
      },
      {
        key: "puissance_moteur",
        label: "Puissance moteur (W)",
        type: "select",
        icon: Zap,
        options: [
          { value: "250", label: "250W (légal route)" },
          { value: "350", label: "350W" },
          { value: "500", label: "500W" },
          { value: "800", label: "800W" },
          { value: "1000", label: "1000W" },
          { value: "1200", label: "1200W+" },
          { value: "2000", label: "2000W+" },
          { value: "3000", label: "3000W+" },
        ],
      },
      {
        key: "autonomie_min",
        label: "Autonomie min (km)",
        type: "number",
        placeholder: "30",
        icon: Battery,
        min: 0,
        step: 5,
      },
      {
        key: "vitesse_max_min",
        label: "Vitesse max min (km/h)",
        type: "number",
        placeholder: "25",
        icon: Gauge,
        min: 0,
        max: 100,
      },
      {
        key: "poids_max",
        label: "Charge max (kg)",
        type: "number",
        placeholder: "100",
        icon: Users,
        min: 0,
        max: 200,
      },
      {
        key: "roues_pouces",
        label: "Taille des roues",
        type: "select",
        icon: Disc,
        options: [
          { value: "6", label: "6 pouces" },
          { value: "8", label: "8 pouces" },
          { value: "8.5", label: "8.5 pouces" },
          { value: "10", label: "10 pouces" },
          { value: "11", label: "11 pouces" },
          { value: "12", label: "12 pouces" },
          { value: "13", label: "13 pouces" },
        ],
      },
      {
        key: "suspension",
        label: "Suspension",
        type: "select",
        icon: Wrench,
        options: [
          { value: "aucune", label: "Aucune" },
          { value: "avant", label: "Avant" },
          { value: "arriere", label: "Arrière" },
          { value: "double", label: "Double" },
        ],
      },
      {
        key: "couleur",
        label: "Couleur",
        type: "text",
        placeholder: "Noir, blanc...",
        icon: Palette,
      },
      {
        key: "freins_disque",
        label: "Freins à disque",
        type: "boolean",
        icon: Disc,
      },
      {
        key: "eclairage",
        label: "Éclairage avant/arrière",
        type: "boolean",
        icon: Zap,
      },
      {
        key: "clignotants",
        label: "Clignotants",
        type: "boolean",
        icon: Navigation,
      },
      {
        key: "pliante",
        label: "Pliable",
        type: "boolean",
        icon: Wrench,
      },
    ],
  },
  {
    id: "electronique",
    name: "Électronique",
    icon: Smartphone,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-600",
    shadowColor: "shadow-pink-500/20",
    description: "Téléphones, PC, tablettes, consoles, accessoires...",
    criteria: [
      {
        key: "type_electronique",
        label: "Type de produit",
        type: "select",
        icon: Smartphone,
        required: true,
        options: [
          { value: "smartphone", label: "Smartphone" },
          { value: "ordinateur_portable", label: "Ordinateur portable" },
          { value: "ordinateur_bureau", label: "Ordinateur de bureau" },
          { value: "tablette", label: "Tablette" },
          { value: "console", label: "Console de jeux" },
          { value: "montre_connectee", label: "Montre connectée" },
          { value: "ecran", label: "Écran / Moniteur" },
          { value: "casque", label: "Casque / Écouteurs" },
          { value: "appareil_photo", label: "Appareil photo" },
          { value: "enceinte", label: "Enceinte / Enceinte connectée" },
          { value: "drone", label: "Drone" },
          { value: "accessoire", label: "Accessoire" },
        ],
      },
      {
        key: "marque",
        label: "Marque",
        type: "select",
        icon: Tag,
        required: true,
        options: [
          { value: "apple", label: "Apple" },
          { value: "samsung", label: "Samsung" },
          { value: "xiaomi", label: "Xiaomi" },
          { value: "huawei", label: "Huawei" },
          { value: "oppo", label: "OPPO" },
          { value: "oneplus", label: "OnePlus" },
          { value: "google", label: "Google" },
          { value: "sony", label: "Sony" },
          { value: "microsoft", label: "Microsoft" },
          { value: "dell", label: "Dell" },
          { value: "hp", label: "HP" },
          { value: "lenovo", label: "Lenovo" },
          { value: "asus", label: "ASUS" },
          { value: "acer", label: "Acer" },
          { value: "msi", label: "MSI" },
          { value: "nintendo", label: "Nintendo" },
          { value: "playstation", label: "PlayStation (Sony)" },
          { value: "xbox", label: "Xbox (Microsoft)" },
          { value: "autre", label: "Autre" },
        ],
      },
      {
        key: "modele",
        label: "Modèle",
        type: "text",
        placeholder: "Ex: iPhone 14 Pro, Galaxy S23, PS5...",
        icon: Type,
      },
      {
        key: "stockage",
        label: "Stockage",
        type: "select",
        icon: HardDrive,
        options: [
          { value: "16", label: "16 Go" },
          { value: "32", label: "32 Go" },
          { value: "64", label: "64 Go" },
          { value: "128", label: "128 Go" },
          { value: "256", label: "256 Go" },
          { value: "512", label: "512 Go" },
          { value: "1", label: "1 To" },
          { value: "2", label: "2 To" },
          { value: "4", label: "4 To+" },
        ],
      },
      {
        key: "ram",
        label: "RAM (Go)",
        type: "select",
        icon: Cpu,
        options: [
          { value: "2", label: "2 Go" },
          { value: "4", label: "4 Go" },
          { value: "6", label: "6 Go" },
          { value: "8", label: "8 Go" },
          { value: "12", label: "12 Go" },
          { value: "16", label: "16 Go" },
          { value: "32", label: "32 Go" },
          { value: "64", label: "64 Go+" },
        ],
      },
      {
        key: "taille_ecran",
        label: "Taille écran (pouces)",
        type: "select",
        icon: Monitor,
        options: [
          { value: "moins_5", label: "Moins de 5\"" },
          { value: "5_6", label: "5\" - 6\"" },
          { value: "6_7", label: "6\" - 7\"" },
          { value: "7_10", label: "7\" - 10\"" },
          { value: "10_13", label: "10\" - 13\"" },
          { value: "13_15", label: "13\" - 15\"" },
          { value: "15_17", label: "15\" - 17\"" },
          { value: "plus_17", label: "Plus de 17\"" },
        ],
      },
      {
        key: "processeur",
        label: "Processeur / Chip",
        type: "text",
        placeholder: "Ex: Snapdragon 8 Gen 2, M2, i7...",
        icon: Cpu,
      },
      {
        key: "couleur",
        label: "Couleur",
        type: "text",
        placeholder: "Noir, blanc, bleu...",
        icon: Palette,
      },
      {
        key: "5g",
        label: "5G",
        type: "boolean",
        icon: Zap,
      },
      {
        key: "double_sim",
        label: "Double SIM",
        type: "boolean",
        icon: Smartphone,
      },
      {
        key: "batterie_neuve",
        label: "Batterie neuve / santé > 85%",
        type: "boolean",
        icon: Battery,
      },
      {
        key: "chargeur_inclus",
        label: "Chargeur inclus",
        type: "boolean",
        icon: Zap,
      },
      {
        key: "boite_origine",
        label: "Boîte d'origine",
        type: "boolean",
        icon: Package,
      },
      {
        key: "garantie",
        label: "Encore sous garantie",
        type: "boolean",
        icon: Shield,
      },
    ],
  },
]

// ============================================
// CONDITIONS
// ============================================

const conditions = [
  { value: "NEW", label: "Neuf", description: "Jamais utilisé, emballage d'origine" },
  { value: "LIKE_NEW", label: "Comme neuf", description: "Utilisé quelques fois, impeccable" },
  { value: "GOOD", label: "Bon état", description: "Signes d'usage légers, fonctionne parfaitement" },
  { value: "FAIR", label: "État correct", description: "Usure visible mais fonctionnel" },
  { value: "ANY", label: "Peu importe", description: "Tous les états acceptés" },
]

// ============================================
// LOCALISATIONS TUNISIE
// ============================================

const tunisiaLocations: Record<string, string[]> = {
  "Tunis": ["Carthage", "La Médina", "Bab El Bhar", "Bab Souika", "El Omrane", "El Omrane Supérieur", "Ettahrir", "El Menzah", "Cité El Khadhra", "Le Bardo", "Sijoumi", "Ezzouhour", "El Hrairia", "Sidi Hassine", "El Quardia", "El Kabaria", "Sidi El Béchir", "Djebel Djelloud", "La Goulette", "Le Kram", "La Marsa"],
  "Ariana": ["L'Ariana Ville", "La Soukra", "Raoued", "Kalaat El Andalous", "Sidi Thabet", "Cité Ettadhamen", "El Mnihla"],
  "Ben Arous": ["Ben Arous", "La Nouvelle Médina", "El Mourouj", "Hammam Lif", "Hammam Chott", "Bou Mhel El Bassatine", "Ezzahra", "Radès", "Mégrine", "Mohamedia", "Fouchana", "Mornag"],
  "Manouba": ["Manouba", "Douar Hicher", "Oued Ellil", "Mornaguia", "Borj Amri", "Djedeida", "Tebourba", "El Battane"],
  "Nabeul": ["Nabeul", "Dar Chaabane El Fehri", "Béni Khiar", "Korba", "Menzel Temime", "Kélibia", "Soliman", "El Haouaria", "Béni Khalled", "Menzel Bouzelfa", "Bou Argoub", "El Mida", "Takelsa", "Hammam Ghezèze", "Grombalia", "Hammamet"],
  "Zaghouan": ["Zaghouan", "El Fahs", "Bir Mcherga", "Nadhour", "Saouaf", "Zriba"],
  "Bizerte": ["Bizerte Nord", "Bizerte Sud", "Ras Jebel", "Menzel Bourguiba", "Menzel Jemil", "Mateur", "Sejnane", "El Alia", "Joumine", "Ghezala", "Zarzouna", "Utique", "Ghar El Melh", "Tinja"],
  "Béja": ["Béja Nord", "Béja Sud", "Nefza", "Medjez El Bab", "Testour", "Téboursouk", "Amdoun", "Goubellat", "Thibar"],
  "Jendouba": ["Jendouba", "Bou Salem", "Tabarka", "Aïn Draham", "Fernana", "Beni M'Tir", "Ghardimaou", "Oued Meliz", "Balta Bou Aouane"],
  "Le Kef": ["Le Kef Est", "Le Kef Ouest", "Tajerouine", "Touiref", "Sakiet Sidi Youssef", "Nebeur", "Sers", "Dahmani", "Kalâat Senan", "Jerissa", "El Ksour"],
  "Siliana": ["Siliana Nord", "Siliana Sud", "Bou Arada", "Gaâfour", "El Krib", "Bourouis", "Makthar", "Er-Rouhia", "Kesra", "Bargou", "El Aroussa"],
  "Sousse": ["Sousse Médina", "Sousse Riadh", "Sousse Jawhara", "Sousse Sidi Abdelhamid", "Hammam Sousse", "Akouda", "Kalâa Kebira", "Sidi Bou Ali", "Hergla", "Enfidha", "Bouficha", "Kondar", "Sidi El Héni", "M'saken", "Kalâa Seghira", "Zaouia-Ksiba-Thrayet"],
  "Monastir": ["Monastir", "Ouerdanine", "Sahline", "Zermadine", "Béni Hassen", "Jemmel", "Bembla", "Moknine", "Bekalta", "Teboulba", "Ksar Hellal", "Ksibet El Mediouni", "Sayada-Lamta-Bou Hajar"],
  "Mahdia": ["Mahdia", "Bou Merdes", "Ouled Chamekh", "Chorbane", "Hebira", "Essouassi", "El Djem", "Chebba", "Melloulech", "Sidi Alouane", "Ksour Essef"],
  "Sfax": ["Sfax Ville", "Sfax Ouest", "Sakiet Ezzit", "Sakiet Eddaier", "Sfax Sud", "Thyna", "Agareb", "Djebeniana", "El Amra", "El Hencha", "Menzel Chaker", "Ghraïba", "Bir Ali Ben Khalifa", "Skhira", "Mahres", "Kerkennah"],
  "Kairouan": ["Kairouan Nord", "Kairouan Sud", "Echebika", "Sbikha", "El Ouslatia", "Haffouz", "El Alaa", "Hajeb El Ayoun", "Nasrallah", "Echrarda", "Bouhajla", "Hajeb El Oued"],
  "Kasserine": ["Kasserine Nord", "Kasserine Sud", "Ezzouhour", "Hassi Ferid", "Sbeitla", "Sbiba", "Djedeliane", "El Ayoun", "Thala", "Hidra", "Foussana", "Feriana", "Majel Bel Abbes"],
  "Sidi Bouzid": ["Sidi Bouzid Ouest", "Sidi Bouzid Est", "Jilma", "Cebbala Ouled Asker", "Bir El Hafey", "Sidi Ali Ben Aoun", "Menzel Bouzaiane", "Meknassy", "Souk Jedid", "Mezzouna", "Regueb", "Ouled Haffouz"],
  "Gabès": ["Gabès Médina", "Gabès Ouest", "Gabès Sud", "Ghannouch", "El Metouia", "Menzel El Habib", "El Hamma", "Matmata", "Nouvelle Matmata", "Mareth", "Oudhref"],
  "Medenine": ["Medenine Nord", "Medenine Sud", "Beni Khedech", "Ben Guerdane", "Zarzis", "Djerba Houmet Souk", "Djerba Midoun", "Djerba Ajim"],
  "Tataouine": ["Tataouine Nord", "Tataouine Sud", "Bir Lahmar", "Ghomrassen", "Dehiba", "Remada", "Smar", "Bir El Hafey"],
  "Gafsa": ["Gafsa Nord", "Gafsa Sud", "Sidi Bouzid", "El Ksar", "Moulares", "Redeyef", "Métlaoui", "Menzel El Habib", "Belkhir", "Sned", "El Guetar", "Oum El Araïes"],
  "Tozeur": ["Tozeur", "Degache", "Tamerza", "Nefta", "Hazoua", "El Hamma du Jérid"],
  "Kebili": ["Kebili Nord", "Kebili Sud", "Douz Nord", "Douz Sud", "Faouar", "El Faouar", "Souk Lahad"],
}

// ============================================
// ÉTAPES
// ============================================

const stepLabels = [
  { num: 1, label: "Catégorie", icon: Search },
  { num: 2, label: "Détails", icon: Tag },
  { num: 3, label: "Spécificités", icon: Sparkles },
]

// ============================================
// INTERFACES
// ============================================

interface LocationEntry {
  governorate: string
  delegations: string[]
}

interface FormData {
  categoryId: string
  title: string
  description: string
  criteria: Record<string, string | boolean | number>
  budgetMin: string
  budgetMax: string
  locations: LocationEntry[]
  condition: string
}
// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function NewDemandForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()
  
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
  
    const [formData, setFormData] = useState<FormData>({
      categoryId: searchParams.get("category") || "",
      title: "",
      description: "",
      criteria: {},
      budgetMin: "",
      budgetMax: "",
      locations: [],
      condition: "ANY",
    })
  
    const selectedCategory = categories.find((c) => c.id === formData.categoryId)
  
    // ============================================
    // MISE À JOUR DES CRITÈRES SPÉCIFIQUES
    // ============================================
  
    function updateCriteria(key: string, value: string | boolean | number) {
      setFormData((prev) => ({ 
        ...prev, 
        criteria: { ...prev.criteria, [key]: value } 
      }))
    }
  
    function removeCriterion(key: string) {
      setFormData((prev) => {
        const newCriteria = { ...prev.criteria }
        delete newCriteria[key]
        return { ...prev, criteria: newCriteria }
      })
    }
  
    // ============================================
    // GESTION DES LOCALISATIONS
    // ============================================
  
    function addLocation() {
      setFormData((prev) => ({ 
        ...prev, 
        locations: [...prev.locations, { governorate: "", delegations: [] }] 
      }))
    }
  
    function removeLocation(index: number) {
      setFormData((prev) => ({ 
        ...prev, 
        locations: prev.locations.filter((_, i) => i !== index) 
      }))
    }
  
    function updateGovernorate(index: number, governorate: string) {
      setFormData((prev) => {
        const newLocations = [...prev.locations]
        newLocations[index] = { governorate, delegations: [] }
        return { ...prev, locations: newLocations }
      })
    }
  
    function toggleDelegation(index: number, delegation: string) {
      setFormData((prev) => {
        const newLocations = [...prev.locations]
        const entry = newLocations[index]
        const hasDelegation = entry.delegations.includes(delegation)
        newLocations[index] = {
          ...entry,
          delegations: hasDelegation
            ? entry.delegations.filter((d) => d !== delegation)
            : [...entry.delegations, delegation],
        }
        return { ...prev, locations: newLocations }
      })
    }
  
    function selectAllDelegations(index: number) {
      setFormData((prev) => {
        const newLocations = [...prev.locations]
        const entry = newLocations[index]
        const allDelegations = tunisiaLocations[entry.governorate] || []
        const allSelected = entry.delegations.length === allDelegations.length && allDelegations.length > 0
        newLocations[index] = { 
          ...entry, 
          delegations: allSelected ? [] : [...allDelegations] 
        }
        return { ...prev, locations: newLocations }
      })
    }
  
    // ============================================
    // VALIDATION PAR ÉTAPE
    // ============================================
  
    function getStepErrors(): string[] {
      const errors: string[] = []
      
      if (step === 1) {
        if (!formData.categoryId) errors.push("Veuillez sélectionner une catégorie")
      }
      
      if (step === 2) {
        if (!formData.title.trim()) errors.push("Le titre est obligatoire")
        if (formData.title.trim().length < 5) errors.push("Le titre doit faire au moins 5 caractères")
        if (formData.locations.length === 0) errors.push("Ajoutez au moins une zone de recherche")
        formData.locations.forEach((loc, i) => {
          if (!loc.governorate) errors.push(`Ville ${i + 1} : sélectionnez un gouvernorat`)
          if (loc.delegations.length === 0) errors.push(`Ville ${i + 1} : sélectionnez au moins une délégation`)
        })
        if (formData.budgetMax && formData.budgetMin && parseFloat(formData.budgetMax) < parseFloat(formData.budgetMin)) {
          errors.push("Le budget max doit être supérieur au budget min")
        }
      }
      
      if (step === 3) {
        // Vérifier les critères requis de la catégorie
        if (selectedCategory) {
          selectedCategory.criteria
            .filter(c => c.required)
            .forEach(c => {
              const value = formData.criteria[c.key]
              if (value === undefined || value === "" || value === false) {
                errors.push(`Le champ "${c.label}" est obligatoire`)
              }
            })
        }
      }
      
      return errors
    }
  
    const canProceed = () => getStepErrors().length === 0
  
    // ============================================
    // NAVIGATION ENTRE ÉTAPES
    // ============================================
  
    function goNext() {
      const errors = getStepErrors()
      if (errors.length > 0) {
        setError(errors[0])
        return
      }
      setError("")
      if (step < 3) setStep(step + 1)
    }
  
    function goBack() {
      setError("")
      if (step > 1) setStep(step - 1)
    }
  
    // ============================================
    // SOUMISSION
    // ============================================
  
    async function handleSubmit() {
      const errors = getStepErrors()
      if (errors.length > 0) {
        setError(errors[0])
        return
      }
  
      setLoading(true)
      setError("")
  
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError("Vous devez être connecté pour publier une demande")
          setLoading(false)
          return
        }
  
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("id, name, slug")
          .eq("slug", formData.categoryId)
          .maybeSingle()
  
        if (categoryError || !categoryData) {
          setError("Catégorie non trouvée : " + formData.categoryId)
          setLoading(false)
          return
        }
  
        // Nettoyer les critères vides
        const cleanCriteria: Record<string, string | boolean | number> = {}
        Object.entries(formData.criteria).forEach(([key, value]) => {
          if (value !== "" && value !== undefined && value !== null) {
            cleanCriteria[key] = value
          }
        })
  
        const { error: insertError } = await supabase.from("demands").insert({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          category_id: categoryData.id,
          criteria: cleanCriteria,
          budget_min: formData.budgetMin ? parseFloat(formData.budgetMin) : null,
          budget_max: formData.budgetMax ? parseFloat(formData.budgetMax) : null,
          currency: "TND",
          locations: formData.locations,
          condition: formData.condition,
          status: "ACTIVE",
          user_id: user.id,
        })
  
        if (insertError) {
          setError("Erreur lors de la publication : " + insertError.message)
          setLoading(false)
          return
        }
  
        router.push("/dashboard")
        router.refresh()
      } catch (err) {
        setError("Une erreur inattendue s'est produite")
        setLoading(false)
      }
    }
  
    // ============================================
    // RÉSUMÉ DES CRITÈRES REMPLIS
    // ============================================
  
    function getFilledCriteriaCount(): number {
      return Object.values(formData.criteria).filter(v => 
        v !== "" && v !== undefined && v !== null && v !== false
      ).length
    }
  
    function getTotalCriteriaCount(): number {
      return selectedCategory?.criteria.length || 0
    }
      // ============================================
  // RENDU DES CHAMPS DE CRITÈRES DYNAMIQUES
  // ============================================

  function renderCriterionField(field: CriterionField) {
    const value = formData.criteria[field.key]
    const Icon = field.icon

    const baseInputClass = "w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
    const baseSelectClass = "w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none bg-white appearance-none cursor-pointer"

    switch (field.type) {
      case "text":
        return (
          <div key={field.key}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.helperText && <p className="text-xs text-gray-400 mb-1.5">{field.helperText}</p>}
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={(value as string) || ""}
                onChange={(e) => updateCriteria(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={`${baseInputClass} pl-10`}
              />
            </div>
          </div>
        )

      case "number":
        return (
          <div key={field.key}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.helperText && <p className="text-xs text-gray-400 mb-1.5">{field.helperText}</p>}
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={(value as number) || ""}
                onChange={(e) => updateCriteria(field.key, e.target.value ? parseFloat(e.target.value) : "")}
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                step={field.step}
                className={`${baseInputClass} pl-10`}
              />
              {field.unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{field.unit}</span>}
            </div>
          </div>
        )

      case "select":
        return (
          <div key={field.key}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.helperText && <p className="text-xs text-gray-400 mb-1.5">{field.helperText}</p>}
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={(value as string) || ""}
                onChange={(e) => updateCriteria(field.key, e.target.value)}
                className={`${baseSelectClass} pl-10`}
              >
                <option value="">Choisir...</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
            </div>
          </div>
        )

      case "boolean":
        return (
          <div key={field.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
            onClick={() => updateCriteria(field.key, !value)}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${value ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900">{field.label}</span>
                {field.helperText && <p className="text-xs text-gray-400">{field.helperText}</p>}
              </div>
            </div>
            <div className={`w-12 h-7 rounded-full transition-colors relative ${value ? "bg-blue-500" : "bg-gray-300"}`}>
              <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // ============================================
  // RENDU PRINCIPAL
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Poster une demande</h1>
          <p className="text-gray-600 text-lg">Décrivez ce que vous cherchez, les vendeurs viendront à vous</p>
        </div>

        {/* Stepper */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {stepLabels.map((s, i) => {
              const isActive = step === s.num
              const isCompleted = step > s.num
              const Icon = s.icon
              return (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCompleted ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25" : isActive ? "bg-blue-100 text-blue-600 border-2 border-blue-500" : "bg-gray-100 text-gray-400"}`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${isActive || isCompleted ? "text-gray-900" : "text-gray-400"}`}>{s.label}</span>
                  </div>
                  {i < stepLabels.length - 1 && <div className={`flex-1 h-1 mx-4 rounded-full ${isCompleted ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-gray-200"}`} />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 animate-in slide-in-from-top-2">
            <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 sm:p-8">

          {/* ========== STEP 1 : CATÉGORIE ========== */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quelle catégorie ?</h2>
                <p className="text-gray-600">Sélectionnez le type de produit que vous recherchez</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  const isSelected = formData.categoryId === cat.id
                  return (
                    <button 
                      key={cat.id} 
                      onClick={() => setFormData({ ...formData, categoryId: cat.id, criteria: {} })}
                      className={`group relative overflow-hidden rounded-2xl border-2 p-6 transition-all text-left ${isSelected ? `${cat.borderColor} ${cat.bgColor} shadow-lg ${cat.shadowColor}` : "border-gray-200 hover:border-gray-300 hover:shadow-md"}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${cat.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-7 h-7 ${cat.textColor}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`text-lg font-semibold ${isSelected ? cat.textColor : "text-gray-900"}`}>{cat.name}</h3>
                            {isSelected && (
                              <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center`}>
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{cat.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ========== STEP 2 : DÉTAILS ========== */}
          {step === 2 && selectedCategory && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${selectedCategory.bgColor} ${selectedCategory.textColor} text-sm font-medium mb-4`}>
                  <selectedCategory.icon className="w-4 h-4" />
                  {selectedCategory.name}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Détails de votre recherche</h2>
                <p className="text-gray-600">Plus vous êtes précis, plus vous recevrez d'offres pertinentes</p>
              </div>

              <div className="space-y-5">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                    placeholder={`Ex: ${selectedCategory.name} ${selectedCategory.id === "voiture" ? "Clio 4 diesel" : selectedCategory.id === "moto" ? "Yamaha MT-07" : selectedCategory.id === "electronique" ? "iPhone 14 Pro" : "..."}`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all min-h-[120px] resize-y"
                    placeholder="Précisez vos critères, usage prévu, délais..."
                  />
                </div>

                {/* Budget */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Budget min (TND)</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="number" 
                        value={formData.budgetMin} 
                        onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" 
                        placeholder="0" 
                        min="0" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget max (TND) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="number" 
                        value={formData.budgetMax} 
                        onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" 
                        placeholder="10000" 
                        min="0" 
                      />
                    </div>
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Villes et délégations <span className="text-red-500">*</span>
                    </label>
                    <button 
                      onClick={addLocation} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Ajouter une ville
                    </button>
                  </div>

                  {formData.locations.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
                      <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Aucune ville sélectionnée. Cliquez sur "Ajouter une ville" pour commencer.</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {formData.locations.map((location, index) => {
                      const availableDelegations = tunisiaLocations[location.governorate] || []
                      const allSelected = location.delegations.length === availableDelegations.length && availableDelegations.length > 0
                      return (
                        <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 sm:p-5 space-y-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                              <span className="text-sm font-semibold text-gray-700">Zone {index + 1}</span>
                            </div>
                            <button 
                              onClick={() => removeLocation(index)} 
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Gouvernorat</label>
                            <select 
                              value={location.governorate} 
                              onChange={(e) => updateGovernorate(index, e.target.value)}
                              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none bg-white text-sm appearance-none"
                            >
                              <option value="">Choisir un gouvernorat</option>
                              {Object.keys(tunisiaLocations).map((gov) => (
                                <option key={gov} value={gov}>{gov}</option>
                              ))}
                            </select>
                          </div>

                          {location.governorate && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-gray-500">Délégations</label>
                                <button 
                                  onClick={() => selectAllDelegations(index)} 
                                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                  {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
                                </button>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {availableDelegations.map((delegation) => {
                                  const isSelected = location.delegations.includes(delegation)
                                  return (
                                    <button 
                                      key={delegation} 
                                      onClick={() => toggleDelegation(index, delegation)}
                                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all ${isSelected ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}
                                    >
                                      <div className="flex items-center gap-1.5">
                                        {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
                                        <span className="truncate">{delegation}</span>
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                              {location.delegations.length > 0 && (
                                <p className="mt-2 text-xs text-gray-500">
                                  {location.delegations.length} délégation{location.delegations.length > 1 ? "s" : ""} sélectionnée{location.delegations.length > 1 ? "s" : ""}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">État souhaité</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {conditions.map((cond) => (
                      <button 
                        key={cond.value} 
                        onClick={() => setFormData({ ...formData, condition: cond.value })}
                        className={`relative rounded-xl border-2 p-4 text-left transition-all ${formData.condition === cond.value ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold ${formData.condition === cond.value ? "text-blue-700" : "text-gray-900"}`}>{cond.label}</span>
                          {formData.condition === cond.value && (
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{cond.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========== STEP 3 : SPÉCIFICITÉS ========== */}
          {step === 3 && selectedCategory && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${selectedCategory.bgColor} ${selectedCategory.textColor} text-sm font-medium mb-4`}>
                  <Sparkles className="w-4 h-4" />
                  {selectedCategory.name}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Critères spécifiques</h2>
                <p className="text-gray-600">
                  {getFilledCriteriaCount() > 0 
                    ? `${getFilledCriteriaCount()}/${getTotalCriteriaCount()} critères renseignés` 
                    : "Affinez votre recherche avec les critères ci-dessous"}
                </p>
              </div>

              {/* Critères dynamiques */}
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedCategory.criteria
                    .filter(c => c.type !== "boolean")
                    .map((field) => renderCriterionField(field))}
                </div>

                {/* Booléens en bas */}
                {selectedCategory.criteria.some(c => c.type === "boolean") && (
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-gray-500" />
                      Options et équipements
                    </h3>
                    <div className="space-y-3">
                      {selectedCategory.criteria
                        .filter(c => c.type === "boolean")
                        .map((field) => renderCriterionField(field))}
                    </div>
                  </div>
                )}
              </div>

              {/* Résumé des zones */}
              {formData.locations.length > 0 && (
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    Zones de recherche
                  </h3>
                  <div className="space-y-3">
                    {formData.locations.map((loc, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{loc.governorate}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {loc.delegations.length === (tunisiaLocations[loc.governorate]?.length || 0) 
                              ? "Toutes les délégations" 
                              : loc.delegations.join(", ")}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {loc.delegations.length} délég.
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Résumé budget */}
              {(formData.budgetMin || formData.budgetMax) && (
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-500" />
                    Budget
                  </h3>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                    {formData.budgetMin ? `${formData.budgetMin} TND` : "0 TND"}
                    <ChevronRight className="w-4 h-4" />
                    {formData.budgetMax ? `${formData.budgetMax} TND` : "Illimité"}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== NAVIGATION ========== */}
          <div className="mt-10 flex justify-between items-center pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button 
                onClick={goBack} 
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Retour
              </button>
            ) : <div />}

            {step < 3 ? (
              <button 
                onClick={goNext}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all"
              >
                Suivant <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publication...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Publier ma demande
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            Votre demande sera visible pendant 30 jours
          </p>
        </div>
      </div>
    </div>
  )
}