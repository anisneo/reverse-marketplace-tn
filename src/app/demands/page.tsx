"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import Navbar from "@/components/Navbar"
import {
  Search,
  MapPin,
  Tag,
  Clock,
  ChevronRight,
  Bike,
  Car,
  Zap,
  Smartphone,
  SlidersHorizontal,
  X,
  Plus,
  Filter,
  Sparkles,
  TrendingUp,
  Package,
  Users,
  Award
} from "lucide-react"

const categoryIcons: Record<string, any> = {
  moto: Bike,
  voiture: Car,
  velo: Bike,
  trottinette: Zap,
  electronique: Smartphone,
}

const categoryColors: Record<string, string> = {
  moto: "from-orange-500 to-red-500",
  voiture: "from-blue-500 to-indigo-600",
  velo: "from-green-500 to-emerald-600",
  trottinette: "from-purple-500 to-violet-600",
  electronique: "from-pink-500 to-rose-600",
}

const categoryBgColors: Record<string, string> = {
  moto: "bg-orange-50",
  voiture: "bg-blue-50",
  velo: "bg-green-50",
  trottinette: "bg-purple-50",
  electronique: "bg-pink-50",
}

const categoryTextColors: Record<string, string> = {
  moto: "text-orange-600",
  voiture: "text-blue-600",
  velo: "text-green-600",
  trottinette: "text-purple-600",
  electronique: "text-pink-600",
}

const conditionLabels: Record<string, string> = {
  NEW: "Neuf",
  LIKE_NEW: "Comme neuf",
  GOOD: "Bon état",
  FAIR: "État correct",
  ANY: "Peu importe",
}

const statusLabels: Record<string, { label: string; color: string; bgColor: string }> = {
  ACTIVE: { label: "Active", color: "text-green-700", bgColor: "bg-green-50" },
  FULFILLED: { label: "Satisfaite", color: "text-gray-600", bgColor: "bg-gray-50" },
  EXPIRED: { label: "Expirée", color: "text-red-700", bgColor: "bg-red-50" },
  CANCELLED: { label: "Annulée", color: "text-red-700", bgColor: "bg-red-50" },
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `Il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `Il y a ${days}j`
  const weeks = Math.floor(days / 7)
  return `Il y a ${weeks} sem.`
}

const cities = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
  "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
  "Gabès", "Medenine", "Tataouine", "Gafsa", "Tozeur", "Kebili"
]

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
          locations, condition, status, created_at, expires_at,
          criteria,
          category:categories!demands_category_id_fkey(id, name, slug),
          user:users!demands_user_id_fkey(id, first_name, last_name, rating),
          offers(id)
        `)
        .order("created_at", { ascending: false })

      if (selectedCategory) {
        const cat = (cats || []).find((c: any) => c.slug === selectedCategory)
        if (cat) query = query.eq("category_id", cat.id)
      }

      if (selectedCity) query = query.contains("locations", [{ governorate: selectedCity }])
      if (search) query = query.ilike("title", `%${search}%`)

      const { data, error } = await query.limit(40)

      console.log("DEMANDS:", data)
      console.log("ERROR:", error)
      console.log("COUNT:", data?.length)

      setDemands(data || [])
      setLoading(false)
    }

    load()
  }, [selectedCategory, selectedCity, search])

  // Get unique locations from demands
  const availableCities = [...new Set(
    demands.flatMap(d => d.locations?.map((l: any) => l.governorate) || [])
  )].filter(Boolean)

  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedCity("")
    setSearch("")
    setShowFilters(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Demandes d'achat
          </h1>
          <p className="text-gray-600 text-lg">
            Découvrez ce que les autres cherchent et proposez vos offres
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une demande..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtres
            </button>
            <Link
              href="/demands/new"
              className="inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-5 h-5" />
              Nouvelle demande
            </Link>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all appearance-none"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all appearance-none"
                  >
                    <option value="">Toutes les villes</option>
                    {availableCities.length > 0 ? availableCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    )) : cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                  Effacer les filtres
                </button>
              </div>
            </div>
          )}

          {/* Category Pills */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("")}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tout
            </button>
            {categories.map((cat: any) => {
              const Icon = categoryIcons[cat.slug]
              const isSelected = selectedCategory === cat.slug
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? "" : cat.slug)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {loading ? (
              "Chargement..."
            ) : (
              <>
                <span className="font-semibold text-gray-900">{demands.length}</span>
                {" "}demande{demands.length !== 1 ? "s" : ""} active{demands.length !== 1 ? "s" : ""}
              </>
            )}
          </p>
          {(selectedCategory || selectedCity || search) && (
            <p className="text-sm text-blue-600">
              Filtres actifs
            </p>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                  <div className="w-16 h-6 bg-gray-200 rounded-full" />
                </div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-6" />
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : demands.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-12">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune demande trouvée</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Aucune demande ne correspond à vos critères. Soyez le premier à poster ce que vous cherchez.
            </p>
            <Link
              href="/demands/new"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-5 h-5" />
              Poster une demande
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demands.map((demand: any) => {
              const slug = demand.category?.slug || ""
              const Icon = categoryIcons[slug]
              const colorClass = categoryBgColors[slug] || "bg-gray-100"
              const textColorClass = categoryTextColors[slug] || "text-gray-600"
              const gradientClass = categoryColors[slug] || "from-gray-500 to-gray-600"
              const status = statusLabels[demand.status] || statusLabels.ACTIVE
              const offerCount = demand.offers?.length || 0

              // Get first location
              const firstLocation = demand.locations?.[0]
              const city = firstLocation?.governorate || "Tunisie"

              return (
                <Link
                  key={demand.id}
                  href={`/demands/${demand.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {Icon && <Icon className={`w-6 h-6 ${textColorClass}`} />}
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 text-lg">
                    {demand.title}
                  </h3>

                  {demand.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {demand.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {(demand.budget_min || demand.budget_max) && (
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-semibold text-gray-900">
                          {demand.budget_min && demand.budget_max
                            ? `${demand.budget_min.toLocaleString()} – ${demand.budget_max.toLocaleString()} ${demand.currency}`
                            : demand.budget_max
                            ? `Jusqu'à ${demand.budget_max.toLocaleString()} ${demand.currency}`
                            : `Dès ${demand.budget_min?.toLocaleString()} ${demand.currency}`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{city}</span>
                      {demand.condition && (
                        <>
                          <span className="text-gray-300">·</span>
                          <span>{conditionLabels[demand.condition] || demand.condition}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{timeAgo(demand.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-600">
                      {demand.user?.first_name} {demand.user?.last_name?.charAt(0)}.
                      {demand.user?.rating && (
                        <span className="ml-2 text-amber-500">★ {demand.user.rating}</span>
                      )}
                    </span>
                    <div className="flex items-center gap-3">
                      {offerCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          <Package className="w-3 h-3" />
                          {offerCount} offre{offerCount > 1 ? "s" : ""}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Footer Stats */}
        {!loading && demands.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{demands.length}</p>
              <p className="text-sm text-gray-500">Demandes actives</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(demands.map(d => d.user?.id)).size}
              </p>
              <p className="text-sm text-gray-500">Acheteurs actifs</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {demands.reduce((acc, d) => acc + (d.offers?.length || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Offres proposées</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}