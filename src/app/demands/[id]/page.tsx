"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import Navbar from "@/components/Navbar"
import {
  ArrowLeft,
  MapPin,
  Tag,
  Clock,
  Star,
  CheckCircle,
  Bike,
  Car,
  Zap,
  Smartphone,
  Send,
  AlertCircle,
  ShieldCheck,
  User,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Package,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  Bookmark,
  ChevronRight
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

const conditionLabels: Record<string, { label: string; color: string; bgColor: string }> = {
  NEW: { label: "Neuf", color: "text-green-700", bgColor: "bg-green-50" },
  LIKE_NEW: { label: "Comme neuf", color: "text-blue-700", bgColor: "bg-blue-50" },
  GOOD: { label: "Bon état", color: "text-amber-700", bgColor: "bg-amber-50" },
  FAIR: { label: "État correct", color: "text-orange-700", bgColor: "bg-orange-50" },
  ANY: { label: "Peu importe", color: "text-gray-700", bgColor: "bg-gray-50" },
}

const statusLabels: Record<string, { label: string; color: string; bgColor: string }> = {
  ACTIVE: { label: "Active", color: "text-green-700", bgColor: "bg-green-50" },
  FULFILLED: { label: "Satisfaite", color: "text-gray-600", bgColor: "bg-gray-50" },
  EXPIRED: { label: "Expirée", color: "text-red-700", bgColor: "bg-red-50" },
  CANCELLED: { label: "Annulée", color: "text-red-700", bgColor: "bg-red-50" },
}

const criteriaLabels: Record<string, string> = {
  marque: "Marque",
  modele: "Modèle",
  annee: "Année",
  kilometrage: "Kilométrage",
  cylindree: "Cylindrée",
  carburant: "Carburant",
  boite: "Boîte de vitesses",
  type: "Type",
  taille: "Taille",
  autonomie: "Autonomie",
  vitesse_max: "Vitesse max",
  capacité: "Capacité",
  couleur: "Couleur",
  puissance: "Puissance",
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

function daysLeft(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.floor(diff / 86400000))
}

export default function DemandDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const id = params.id as string

  const [demand, setDemand] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [offerPrice, setOfferPrice] = useState("")
  const [offerDescription, setOfferDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [showAllCriteria, setShowAllCriteria] = useState(false)
  const [existingOffer, setExistingOffer] = useState<any>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      try {
        // ─── 1. Récupérer l'utilisateur connecté ───
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from("users")
            .select("id, first_name, last_name, role, rating, review_count")
            .eq("id", user.id)
            .single()

          if (profile) {
            setCurrentUser(profile)
          }
        }

        // ─── 2. Récupérer la demande ───
        const { data: demandData, error: demandError } = await supabase
          .from("demands")
          .select(`
            id, title, description, budget_min, budget_max, currency,
            locations, condition, status, criteria, created_at, expires_at,
            category:categories!demands_category_id_fkey(id, name, slug),
            user:users!demands_user_id_fkey(id, first_name, last_name, rating, review_count, created_at),
            offers(
              id, price, description, status, created_at,
              seller:users!offers_seller_id_fkey(id, first_name, last_name, rating, review_count)
            )
          `)
          .eq("id", id)
          .limit(1)

        if (demandError) {
          console.error("Erreur Supabase:", demandError)
          setError(demandError.message)
          setLoading(false)
          return
        }

        if (!demandData || demandData.length === 0) {
          setError("Cette demande n'existe pas ou a été supprimée.")
          setLoading(false)
          return
        }

        const data = demandData[0]
        setDemand(data)

        // ─── 3. Vérifier si l'utilisateur a déjà fait une offre ───
        if (user && data?.offers) {
          const existing = data.offers.find((o: any) => o.seller?.id === user.id)
          if (existing) setExistingOffer(existing)
        }
      } catch (err: any) {
        console.error("Erreur catch:", err)
        setError(err.message || "Erreur de chargement")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  async function handleSubmitOffer() {
    if (!currentUser) {
      router.push("/login")
      return
    }

    const price = parseFloat(offerPrice)
    if (!price || price <= 0) {
      setSubmitError("Veuillez entrer un prix valide")
      return
    }

    setSubmitting(true)
    setSubmitError("")

    const { error } = await supabase.from("offers").insert({
      demand_id: id,
      seller_id: currentUser.id,
      price,
      description: offerDescription.trim() || null,
      status: "PENDING",
    })

    if (error) {
      setSubmitError(error.message)
      setSubmitting(false)
      return
    }

    setSubmitSuccess(true)
    setShowOfferForm(false)

    // Rafraîchir les offres
    const { data } = await supabase
      .from("offers")
      .select("id, price, description, status, created_at, seller:users(id, first_name, last_name, rating)")
      .eq("demand_id", id)

    setDemand((prev: any) => ({ ...prev, offers: data || [] }))
    setSubmitting(false)
  }

  // ─── ÉTAT : CHARGEMENT ───
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="h-20 bg-gray-100 rounded-xl" />
              <div className="h-20 bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── ÉTAT : ERREUR ───
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-12">
            <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Oups !</h3>
            <p className="text-gray-500 mb-2">{error}</p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Réessayer
              </button>
              <Link
                href="/demands"
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── ÉTAT : PAS DE DEMANDE ───
  if (!demand) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-12">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Demande introuvable</h3>
            <p className="text-gray-500 mb-6">Cette demande n'existe plus ou a été supprimée.</p>
            <Link
              href="/demands"
              className="inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Voir toutes les demandes
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const Icon = categoryIcons[demand.category?.slug] || Tag
  const slug = demand.category?.slug || ""
  const colorClass = categoryBgColors[slug] || "bg-gray-100"
  const textColorClass = categoryTextColors[slug] || "text-gray-600"
  const gradientClass = categoryColors[slug] || "from-gray-500 to-gray-600"
  const criteria = demand.criteria || {}
  const criteriaEntries = Object.entries(criteria).filter(([, v]) => v)
  const isOwner = currentUser?.id === demand.user?.id
  const isSeller = currentUser?.role === "SELLER" || currentUser?.role === "BOTH"
  const canOffer = !isOwner && isSeller && demand.status === "ACTIVE" && !existingOffer
  const status = statusLabels[demand.status] || statusLabels.ACTIVE
  const condition = conditionLabels[demand.condition] || conditionLabels.ANY
  const daysLeftValue = daysLeft(demand.expires_at)

  // Get first location
  const firstLocation = demand.locations?.[0]
  const city = firstLocation?.governorate || "Tunisie"
  const delegations = firstLocation?.delegations || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/demands"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux demandes
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
              <div className={`p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r ${gradientClass} bg-opacity-5`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-7 h-7 ${textColorClass}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                        {demand.category?.name}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${condition.bgColor} ${condition.color}`}>
                        {condition.label}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </span>
                      {daysLeftValue <= 5 && daysLeftValue > 0 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-600">
                          <Clock className="w-3 h-3 mr-1" />
                          Expire dans {daysLeftValue}j
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{demand.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-800">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {city}
                        {delegations.length > 0 && ` · ${delegations.join(", ")}`}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {timeAgo(demand.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {demand.description && (
                <div className="p-6 sm:p-8 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-700 mb-3">Description</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {demand.description}
                  </p>
                </div>
              )}

              {/* Criteria */}
              {criteriaEntries.length > 0 && (
                <div className="p-6 sm:p-8">
                  <h2 className="text-sm font-semibold text-gray-700 mb-4">Critères recherchés</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {(showAllCriteria ? criteriaEntries : criteriaEntries.slice(0, 4)).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-xl px-4 py-3">
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                          {criteriaLabels[key] || key}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{value as string}</div>
                      </div>
                    ))}
                  </div>
                  {criteriaEntries.length > 4 && (
                    <button
                      onClick={() => setShowAllCriteria(!showAllCriteria)}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      {showAllCriteria ? (
                        <><ChevronUp className="w-4 h-4" /> Voir moins</>
                      ) : (
                        <><ChevronDown className="w-4 h-4" /> Voir tout ({criteriaEntries.length} critères)</>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Offers Section */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  Offres reçues
                  {demand.offers?.length > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                      {demand.offers.length}
                    </span>
                  )}
                </h2>
              </div>

              {submitSuccess && (
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-700">Offre envoyée avec succès !</p>
                    <p className="text-sm text-green-600">Le demandeur sera notifié de votre proposition.</p>
                  </div>
                </div>
              )}

              {demand.offers?.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500">Aucune offre pour l'instant</p>
                  <p className="text-sm text-gray-400">Soyez le premier à faire une offre !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {demand.offers.map((offer: any) => (
                    <div key={offer.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {offer.seller?.first_name?.[0] || "V"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <span className="font-semibold text-gray-900">
                                {offer.seller?.first_name} {offer.seller?.last_name?.charAt(0)}.
                              </span>
                              {offer.seller?.rating > 0 && (
                                <span className="inline-flex items-center gap-1 ml-2 text-sm text-amber-500">
                                  <Star className="w-3 h-3 fill-current" />
                                  {offer.seller.rating.toFixed(1)}
                                </span>
                              )}
                            </div>
                            <span className="text-lg font-bold text-blue-600">
                              {offer.price.toLocaleString()} {demand.currency}
                            </span>
                          </div>
                          {offer.description && (
                            <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">{timeAgo(offer.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Budget</h3>
              {(demand.budget_min || demand.budget_max) ? (
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {demand.budget_min && demand.budget_max
                      ? `${demand.budget_min.toLocaleString()} – ${demand.budget_max.toLocaleString()}`
                      : demand.budget_max
                      ? `Jusqu'à ${demand.budget_max.toLocaleString()}`
                      : `Dès ${demand.budget_min?.toLocaleString()}`}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{demand.currency}</div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Budget non précisé</p>
              )}
            </div>

            {/* User Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Demandeur</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                  {demand.user?.first_name?.[0] || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {demand.user?.first_name} {demand.user?.last_name?.charAt(0)}.
                  </p>
                  {demand.user?.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-gray-500">
                        {demand.user.rating.toFixed(1)} ({demand.user.review_count || 0} avis)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Offer CTA */}
            {existingOffer ? (
              <div className="bg-green-50 border border-green-200 rounded-3xl p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-700">Offre envoyée</p>
                    <p className="text-sm text-green-600">
                      {existingOffer.price.toLocaleString()} {demand.currency}
                    </p>
                    <p className="text-xs text-green-500 mt-1">En attente de réponse</p>
                  </div>
                </div>
              </div>
            ) : canOffer ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6">
                <h3 className="font-semibold text-gray-900 mb-1">Faire une offre</h3>
                <p className="text-sm text-gray-500 mb-4">Proposez votre prix au demandeur.</p>

                {!showOfferForm ? (
                  <button
                    onClick={() => setShowOfferForm(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all"
                  >
                    <Send className="w-5 h-5" />
                    Proposer mon prix
                  </button>
                ) : (
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmitOffer(); }}>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Prix proposé ({demand.currency}) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        placeholder="Ex: 4500"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description <span className="text-gray-400 font-normal">(optionnel)</span>
                      </label>
                      <textarea
                        value={offerDescription}
                        onChange={(e) => setOfferDescription(e.target.value)}
                        placeholder="État du produit, photos disponibles, livraison possible..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all min-h-[80px] resize-y"
                        rows={3}
                      />
                    </div>

                    {submitError && (
                      <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{submitError}</span>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowOfferForm(false)}
                        className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-900 font-medium rounded-xl transition-colors"
                        disabled={submitting}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={submitting || !offerPrice}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Envoi...
                          </>
                        ) : (
                          "Envoyer"
                        )}
                      </button>
                    </div>
                  </form>
                )}

                <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                  <ShieldCheck className="w-4 h-4" />
                  Transaction sécurisée
                </div>
              </div>
            ) : !currentUser ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6">
                <p className="text-sm text-gray-600 mb-4">Connectez-vous pour faire une offre.</p>
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                >
                  Se connecter
                </Link>
              </div>
            ) : isOwner ? (
              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-700">Votre demande</p>
                    <p className="text-sm text-blue-600">Les vendeurs peuvent vous faire des offres.</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/demands/${demand.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg font-medium transition-colors"
                  >
                    Modifier
                  </Link>
                  {demand.status === "ACTIVE" && (
                    <button
                      onClick={async () => {
                        if (confirm("Voulez-vous marquer cette demande comme satisfaite ?")) {
                          await supabase
                            .from("demands")
                            .update({ status: "FULFILLED" })
                            .eq("id", demand.id)
                          window.location.reload()
                        }
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-green-600 bg-green-100 hover:bg-green-200 rounded-lg font-medium transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Satisfaite
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            {/* Expiration */}
            {demand.status === "ACTIVE" && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  Expire dans {daysLeftValue} jour{daysLeftValue > 1 ? "s" : ""}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}