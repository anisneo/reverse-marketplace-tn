"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  ArrowLeft, MapPin, Tag, Clock, Star, CheckCircle,
  Bike, Car, Zap, Smartphone, Send, AlertCircle,
  ShieldCheck, User, ChevronDown, ChevronUp
} from "lucide-react"

const categoryIcons: Record<string, any> = {
  moto: Bike, voiture: Car, velo: Bike, trottinette: Zap, electronique: Smartphone,
}

const conditionLabels: Record<string, string> = {
  NEW: "Neuf", LIKE_NEW: "Comme neuf", GOOD: "Bon état", FAIR: "État correct", ANY: "Peu importe",
}

const criteriaLabels: Record<string, string> = {
  marque: "Marque", modele: "Modèle", annee: "Année", kilometrage: "Kilométrage",
  cylindree: "Cylindrée", carburant: "Carburant", boite: "Boîte de vitesses",
  type: "Type", taille: "Taille", autonomie: "Autonomie", vitesse_max: "Vitesse max",
  capacite: "Capacité",
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return "Hier"
  return `Il y a ${days} jours`
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
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("id, first_name, last_name, role, rating, review_count")
          .eq("id", user.id)
          .single()
        setCurrentUser(profile)
      }

      // Récupérer la demande
      const { data } = await supabase
        .from("demands")
        .select(`
          id, title, description, budget_min, budget_max, currency,
          city, region, condition, status, criteria, created_at, expires_at,
          category:categories(id, name, slug),
          user:users(id, first_name, last_name, rating, review_count, created_at),
          offers(
            id, price, description, status, created_at,
            seller:users(id, first_name, last_name, rating, review_count)
          )
        `)
        .eq("id", id)
        .single()

      setDemand(data)

      // Vérifier si l'utilisateur a déjà fait une offre
      if (user && data?.offers) {
        const existing = data.offers.find((o: any) => o.seller?.id === user.id)
        if (existing) setExistingOffer(existing)
      }

      setLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="card">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-100 rounded w-full mb-2" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!demand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Demande introuvable</h2>
          <Link href="/demands" className="btn-primary">Voir toutes les demandes</Link>
        </div>
      </div>
    )
  }

  const Icon = categoryIcons[demand.category?.slug] || Tag
  const criteria = demand.criteria || {}
  const criteriaEntries = Object.entries(criteria).filter(([, v]) => v)
  const isOwner = currentUser?.id === demand.user?.id
  const isSeller = currentUser?.role === "SELLER" || currentUser?.role === "BOTH"
  const canOffer = !isOwner && isSeller && demand.status === "ACTIVE" && !existingOffer

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-3">
          <Link href="/demands" className="text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link href="/" className="text-lg font-bold text-blue-600">Trouve-Moi.tn</Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-500 truncate">{demand.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Titre & catégorie */}
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge bg-blue-50 text-blue-700">
                  <Icon className="h-3 w-3 mr-1" />
                  {demand.category?.name}
                </span>
                <span className={`badge ${demand.condition === "ANY" ? "bg-gray-100 text-gray-600" : "bg-amber-50 text-amber-700"}`}>
                  {conditionLabels[demand.condition] || demand.condition}
                </span>
                {daysLeft(demand.expires_at) <= 5 && (
                  <span className="badge bg-red-50 text-red-600">
                    Expire dans {daysLeft(demand.expires_at)}j
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">{demand.title}</h1>

              {demand.description && (
                <p className="text-gray-600 leading-relaxed mb-4">{demand.description}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {demand.city}{demand.region ? `, ${demand.region}` : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {timeAgo(demand.created_at)}
                </span>
              </div>
            </div>

            {/* Critères */}
            {criteriaEntries.length > 0 && (
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4">Critères recherchés</h2>
                <div className="grid grid-cols-2 gap-3">
                  {(showAllCriteria ? criteriaEntries : criteriaEntries.slice(0, 4)).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-400 mb-0.5">{criteriaLabels[key] || key}</div>
                      <div className="text-sm font-medium text-gray-900">{value as string}</div>
                    </div>
                  ))}
                </div>
                {criteriaEntries.length > 4 && (
                  <button
                    onClick={() => setShowAllCriteria(!showAllCriteria)}
                    className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    {showAllCriteria ? (
                      <><ChevronUp className="h-4 w-4" /> Voir moins</>
                    ) : (
                      <><ChevronDown className="h-4 w-4" /> Voir tout ({criteriaEntries.length} critères)</>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Offres reçues */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">
                Offres reçues
                {demand.offers?.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {demand.offers.length}
                  </span>
                )}
              </h2>

              {submitSuccess && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-lg px-4 py-3 mb-4">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">Votre offre a bien été envoyée !</span>
                </div>
              )}

              {demand.offers?.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  Aucune offre pour l'instant. Soyez le premier !
                </p>
              ) : (
                <div className="space-y-3">
                  {demand.offers.map((offer: any) => (
                    <div key={offer.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-medium text-sm text-gray-900">
                            {offer.seller?.first_name} {offer.seller?.last_name?.charAt(0)}.
                          </span>
                          <span className="font-bold text-blue-600 shrink-0">
                            {offer.price.toLocaleString()} {demand.currency}
                          </span>
                        </div>
                        {offer.seller?.rating > 0 && (
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs text-gray-500">{offer.seller.rating.toFixed(1)} ({offer.seller.review_count} avis)</span>
                          </div>
                        )}
                        {offer.description && (
                          <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{timeAgo(offer.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Budget */}
            <div className="card">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Budget</h3>
              {demand.budget_min || demand.budget_max ? (
                <div className="text-2xl font-bold text-gray-900">
                  {demand.budget_min && demand.budget_max
                    ? `${demand.budget_min.toLocaleString()} – ${demand.budget_max.toLocaleString()}`
                    : demand.budget_max
                    ? `Jusqu'à ${demand.budget_max.toLocaleString()}`
                    : `Dès ${demand.budget_min?.toLocaleString()}`}
                  <span className="text-base font-normal text-gray-500 ml-1">{demand.currency}</span>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Non précisé</p>
              )}
            </div>

            {/* Demandeur */}
            <div className="card">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Demandeur</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {demand.user?.first_name} {demand.user?.last_name?.charAt(0)}.
                  </p>
                  {demand.user?.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-gray-500">{demand.user.rating.toFixed(1)} ({demand.user.review_count} avis)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Offre */}
            {existingOffer ? (
              <div className="card bg-green-50 border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Offre envoyée</p>
                    <p className="text-xs text-green-600">
                      {existingOffer.price.toLocaleString()} {demand.currency}
                    </p>
                  </div>
                </div>
              </div>
            ) : canOffer ? (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-1">Faire une offre</h3>
                <p className="text-xs text-gray-500 mb-4">Proposez votre prix directement au demandeur.</p>

                {!showOfferForm ? (
                  <button onClick={() => setShowOfferForm(true)} className="btn-primary w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Proposer mon prix
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Prix proposé ({demand.currency}) *
                      </label>
                      <input
                        type="number"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        placeholder="Ex : 4500"
                        className="input-field"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description (optionnel)
                      </label>
                      <textarea
                        value={offerDescription}
                        onChange={(e) => setOfferDescription(e.target.value)}
                        placeholder="État du produit, photos disponibles, livraison possible..."
                        className="input-field resize-none"
                        rows={3}
                      />
                    </div>

                    {submitError && (
                      <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-lg px-3 py-2">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="text-xs">{submitError}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowOfferForm(false)}
                        className="btn-secondary flex-1 text-sm"
                        disabled={submitting}
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSubmitOffer}
                        disabled={submitting || !offerPrice}
                        className="btn-primary flex-1 text-sm"
                      >
                        {submitting ? "Envoi..." : "Envoyer"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Transaction sécurisée
                </div>
              </div>
            ) : !currentUser ? (
              <div className="card">
                <p className="text-sm text-gray-600 mb-3">Connectez-vous pour faire une offre.</p>
                <Link href="/login" className="btn-primary w-full text-center block">
                  Se connecter
                </Link>
              </div>
            ) : isOwner ? (
              <div className="card bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-700 font-medium">C'est votre demande</p>
                <p className="text-xs text-blue-500 mt-1">Les vendeurs peuvent vous faire des offres.</p>
              </div>
            ) : null}

            {/* Expiration */}
            <div className="text-xs text-gray-400 text-center">
              Expire dans {daysLeft(demand.expires_at)} jour{daysLeft(demand.expires_at) > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
