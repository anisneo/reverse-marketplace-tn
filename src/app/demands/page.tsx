"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  Search, MapPin, Tag, Clock, ChevronRight,
  Bike, Car, Zap, Smartphone, Filter, SlidersHorizontal
} from "lucide-react"

const categoryIcons: Record<string, any> = {
  moto: Bike,
  voiture: Car,
  velo: Bike,
  trottinette: Zap,
  electronique: Smartphone,
}

const categoryColors: Record<string, string> = {
  moto: "bg-orange-100 text-orange-600",
  voiture: "bg-blue-100 text-blue-600",
  velo: "bg-green-100 text-green-600",
  trottinette: "bg-purple-100 text-purple-600",
  electronique: "bg-pink-100 text-pink-600",
}

const conditionLabels: Record<string, string> = {
  NEW: "Neuf",
  LIKE_NEW: "Comme neuf",
  GOOD: "Bon état",
  FAIR: "État correct",
  ANY: "Peu importe",
}

const statusLabels: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "bg-green-100 text-green-700" },
  FULFILLED: { label: "Satisfaite", color: "bg-gray-100 text-gray-600" },
  EXPIRED: { label: "Expirée", color: "bg-red-100 text-red-600" },
  CANCELLED: { label: "Annulée", color: "bg-red-100 text-red-600" },
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `Il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  return `Il y a ${days}j`
}

export default function DemandsPage() {
  const supabase = createClient()

  const [demands, setDemands] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("order")

      setCategories(cats || [])

      let query = supabase
        .from("demands")
        .select(`
          id, title, description, budget_min, budget_max, currency,
          city, condition, status, created_at, expires_at,
          criteria,
          category:categories(id, name, slug),
          user:users(id, first_name, last_name, rating),
          offers(id)
        `)
        .eq("status", "ACTIVE")
        .order("created_at", { ascending: false })

      if (selectedCategory) {
        const cat = (cats || []).find((c: any) => c.slug === selectedCategory)
        if (cat) query = query.eq("category_id", cat.id)
      }

      if (selectedCity) query = query.eq("city", selectedCity)

      if (search) query = query.ilike("title", `%${search}%`)

      const { data } = await query.limit(40)
      setDemands(data || [])
      setLoading(false)
    }

    load()
  }, [selectedCategory, selectedCity, search])

  const cities = [
    "Tunis", "Ariana", "Ben Arous", "Sousse", "Sfax", "Monastir",
    "Bizerte", "Nabeul", "Gabès", "Gafsa",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-xl font-bold text-blue-600 shrink-0">
              Trouve-Moi.tn
            </Link>
            <div className="flex-1 max-w-lg relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une demande..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filtres</span>
              </button>
              <Link href="/demands/new" className="btn-primary">
                + Demande
              </Link>
            </div>
          </div>

          {/* Filtres */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-3 pb-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field w-auto text-sm"
              >
                <option value="">Toutes catégories</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input-field w-auto text-sm"
              >
                <option value="">Toutes les villes</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {(selectedCategory || selectedCity || search) && (
                <button
                  onClick={() => { setSelectedCategory(""); setSelectedCity(""); setSearch("") }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          )}

          {/* Category pills */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("")}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !selectedCategory
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tout
            </button>
            {categories.map((cat: any) => {
              const Icon = categoryIcons[cat.slug]
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug === selectedCategory ? "" : cat.slug)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {loading ? "Chargement..." : `${demands.length} demande${demands.length !== 1 ? "s" : ""} active${demands.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-6" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : demands.length === 0 ? (
          <div className="text-center py-20">
            <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune demande trouvée</h3>
            <p className="text-gray-500 mb-6">Soyez le premier à poster ce que vous cherchez.</p>
            <Link href="/demands/new" className="btn-primary">
              Poster une demande
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demands.map((demand: any) => {
              const slug = demand.category?.slug || ""
              const Icon = categoryIcons[slug]
              const colorClass = categoryColors[slug] || "bg-gray-100 text-gray-600"
              const status = statusLabels[demand.status] || statusLabels.ACTIVE
              const offerCount = demand.offers?.length || 0

              return (
                <Link
                  key={demand.id}
                  href={`/demands/${demand.id}`}
                  className="card group hover:border-blue-300 hover:shadow-md transition-all block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`rounded-lg p-2 ${colorClass}`}>
                      {Icon && <Icon className="h-4 w-4" />}
                    </div>
                    <span className={`badge ${status.color}`}>{status.label}</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {demand.title}
                  </h3>

                  {demand.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{demand.description}</p>
                  )}

                  <div className="space-y-1.5 mb-4">
                    {(demand.budget_min || demand.budget_max) && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Tag className="h-3.5 w-3.5 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {demand.budget_min && demand.budget_max
                            ? `${demand.budget_min.toLocaleString()} – ${demand.budget_max.toLocaleString()} ${demand.currency}`
                            : demand.budget_max
                            ? `Jusqu'à ${demand.budget_max.toLocaleString()} ${demand.currency}`
                            : `Dès ${demand.budget_min?.toLocaleString()} ${demand.currency}`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {demand.city}
                      {demand.region && ` · ${demand.region}`}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      {timeAgo(demand.created_at)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {demand.user?.first_name} {demand.user?.last_name?.charAt(0)}.
                    </span>
                    <div className="flex items-center gap-2">
                      {offerCount > 0 && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {offerCount} offre{offerCount > 1 ? "s" : ""}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
