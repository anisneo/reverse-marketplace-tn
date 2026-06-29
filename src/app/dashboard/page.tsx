"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import Navbar from "@/components/Navbar"
import {
  Plus, Search, Bell, User, Bike, Car, Smartphone, Zap,
  Clock, MapPin, Tag, ChevronRight, Pencil, Trash2, MoreVertical
} from "lucide-react"

const categoryIcons: Record<string, React.ElementType> = {
  moto: Bike, voiture: Car, velo: Bike, trottinette: Zap, electronique: Smartphone,
}

const categoryColors: Record<string, string> = {
  moto: "bg-orange-100 text-orange-600",
  voiture: "bg-blue-100 text-blue-600",
  velo: "bg-green-100 text-green-600",
  trottinette: "bg-purple-100 text-purple-600",
  electronique: "bg-pink-100 text-pink-600",
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [demands, setDemands] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"demands" | "offers" | "alerts">("demands")
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => { checkUser() }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }
    setUser(user)
    fetchDemands(user.id)
    fetchOffers(user.id)
    setLoading(false)
  }

  async function fetchDemands(userId: string) {
    const { data } = await supabase
      .from("demands")
      .select("*, category:categories!demands_category_id_fkey(name, slug)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    setDemands(data || [])
  }

  async function fetchOffers(userId: string) {
    const { data } = await supabase
      .from("offers")
      .select("*, demand:demands!offers_demand_id_fkey(title)")
      .eq("seller_id", userId)
      .order("created_at", { ascending: false })
    setOffers(data || [])
  }

  async function handleDeleteDemand(demandId: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      setOpenMenuId(null); return
    }
    setDeleteLoading(demandId)
    const { error } = await supabase.from("demands").delete().eq("id", demandId)
    if (!error) setDemands((prev) => prev.filter((d) => d.id !== demandId))
    setDeleteLoading(null)
    setOpenMenuId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bonjour, {user?.user_metadata?.first_name || "Utilisateur"} ! 👋
          </h1>
          <p className="text-gray-600 mb-6">Gérez vos demandes et offres en un seul endroit.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/demands/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />Nouvelle demande
            </Link>
            <Link href="/dashboard/alerts" className="btn-secondary inline-flex items-center gap-2">
              <Bell className="h-4 w-4" />Mes alertes
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="text-2xl font-bold text-blue-600">{demands.length}</div>
            <div className="text-sm text-gray-600">Demandes</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-green-600">{offers.length}</div>
            <div className="text-sm text-gray-600">Offres reçues</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Alertes</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-orange-600">0</div>
            <div className="text-sm text-gray-600">Messages</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
          {(["demands", "offers", "alerts"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}>
              {tab === "demands" ? "Mes demandes" : tab === "offers" ? "Mes offres" : "Alertes"}
            </button>
          ))}
        </div>

        {/* Demands */}
        {activeTab === "demands" && (
          demands.length === 0 ? (
            <div className="card text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande</h3>
              <p className="text-gray-600 mb-4">Vous n'avez pas encore posté de demande.</p>
              <Link href="/demands/new" className="btn-primary">Poster une demande</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {demands.map((demand) => {
                const Icon = categoryIcons[demand.category?.slug] || Search
                const colorClass = categoryColors[demand.category?.slug] || "bg-gray-100 text-gray-600"
                const isMenuOpen = openMenuId === demand.id
                const locationLabel = Array.isArray(demand.locations) && demand.locations.length > 0
                  ? demand.locations.map((l: any) => l.gouvernorat || l.city || "").filter(Boolean).join(", ")
                  : "Tunisie"

                return (
                  <div key={demand.id} className="card hover:shadow-md transition-shadow relative">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-lg p-3 ${colorClass}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">{demand.title}</h3>
                          <div className="relative">
                            <button onClick={() => setOpenMenuId(isMenuOpen ? null : demand.id)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {isMenuOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden">
                                  <Link href={`/demands/${demand.id}/edit`} onClick={() => setOpenMenuId(null)}
                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                    <Pencil className="h-4 w-4 text-blue-500" />Modifier
                                  </Link>
                                  <button onClick={() => handleDeleteDemand(demand.id)}
                                    disabled={deleteLoading === demand.id}
                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50">
                                    <Trash2 className="h-4 w-4" />
                                    {deleteLoading === demand.id ? "Suppression..." : "Supprimer"}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{demand.description || "Pas de description"}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{locationLabel}</span>
                          <span className="flex items-center gap-1"><Tag className="h-4 w-4" />{demand.budget_max ? `${demand.budget_max} TND` : "Budget non défini"}</span>
                          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{new Date(demand.created_at).toLocaleDateString("fr-FR")}</span>
                          <span className={`badge ${demand.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                            {demand.status === "ACTIVE" ? "Active" : demand.status}
                          </span>
                        </div>
                      </div>
                      <Link href={`/demands/${demand.id}`} className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {/* Offers */}
        {activeTab === "offers" && (
          offers.length === 0 ? (
            <div className="card text-center py-12">
              <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre</h3>
              <p className="text-gray-600">Vous n'avez pas encore reçu d'offres.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {offers.map((offer) => (
                <div key={offer.id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{offer.demand?.title || "Demande"}</h3>
                      <p className="text-sm text-gray-600 mt-1">Offre de {offer.price} TND</p>
                    </div>
                    <span className={`badge ${
                      offer.status === "PENDING" ? "bg-yellow-100 text-yellow-700"
                      : offer.status === "ACCEPTED" ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                    }`}>{offer.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Alerts */}
        {activeTab === "alerts" && (
          <div className="card text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune alerte</h3>
            <p className="text-gray-600 mb-4">Configurez des alertes pour être notifié des nouvelles demandes.</p>
            <Link href="/dashboard/alerts" className="btn-primary">Créer une alerte</Link>
          </div>
        )}
      </main>
    </div>
  )
}