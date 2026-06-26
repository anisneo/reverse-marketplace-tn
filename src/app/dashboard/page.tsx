"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { 
  Plus, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Bike, 
  Car, 
  Smartphone, 
  Zap, 
  Clock,
  MapPin,
  Tag,
  ChevronRight
} from "lucide-react"

const categoryIcons: Record<string, React.ElementType> = {
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

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [demands, setDemands] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"demands" | "offers" | "alerts">("demands")

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }
    setUser(user)
    fetchDemands(user.id)
    fetchOffers(user.id)
    setLoading(false)
  }

  async function fetchDemands(userId: string) {
    const { data } = await supabase
      .from("demands")
      .select("*, category:categories(name, slug, icon)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    
    setDemands(data || [])
  }

  async function fetchOffers(userId: string) {
    const { data } = await supabase
      .from("offers")
      .select("*, demand:demands(title), seller:users(first_name, last_name)")
      .eq("seller_id", userId)
      .order("created_at", { ascending: false })
    
    setOffers(data || [])
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Trouve-Moi<span className="text-blue-600">.tn</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.user_metadata?.first_name || "Utilisateur"}
              </span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome + Actions */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bonjour, {user?.user_metadata?.first_name || "Anis"} ! 👋
          </h1>
          <p className="text-gray-600 mb-6">
            Gérez vos demandes et offres en un seul endroit.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/demands/new"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvelle demande
            </Link>
            
            <Link 
              href="/dashboard/alerts"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Mes alertes
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
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
          <button
            onClick={() => setActiveTab("demands")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "demands" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Mes demandes
          </button>
          <button
            onClick={() => setActiveTab("offers")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "offers" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Mes offres
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "alerts" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Alertes
          </button>
        </div>

        {/* Content */}
        {activeTab === "demands" && (
          <div>
            {demands.length === 0 ? (
              <div className="card text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune demande
                </h3>
                <p className="text-gray-600 mb-4">
                  Vous n'avez pas encore posté de demande.
                </p>
                <Link href="/demands/new" className="btn-primary">
                  Poster une demande
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {demands.map((demand) => {
                  const Icon = categoryIcons[demand.category?.slug] || Search
                  const colorClass = categoryColors[demand.category?.slug] || "bg-gray-100 text-gray-600"
                  
                  return (
                    <div key={demand.id} className="card hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className={`rounded-lg p-3 ${colorClass}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {demand.title}
                            </h3>
                            <span className={`badge ${
                              demand.status === "ACTIVE" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {demand.status === "ACTIVE" ? "Active" : demand.status}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {demand.description || "Pas de description"}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {demand.city}
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="h-4 w-4" />
                              {demand.budget_max ? `${demand.budget_max} TND` : "Budget non défini"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(demand.created_at).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </div>
                        
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "offers" && (
          <div>
            {offers.length === 0 ? (
              <div className="card text-center py-12">
                <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune offre
                </h3>
                <p className="text-gray-600">
                  Vous n'avez pas encore reçu d'offres.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {offer.demand?.title || "Demande"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Offre de {offer.price} TND
                        </p>
                      </div>
                      <span className={`badge ${
                        offer.status === "PENDING" 
                          ? "bg-yellow-100 text-yellow-700" 
                          : offer.status === "ACCEPTED"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {offer.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="card text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune alerte
            </h3>
            <p className="text-gray-600 mb-4">
              Configurez des alertes pour être notifié des nouvelles demandes.
            </p>
            <Link href="/dashboard/alerts" className="btn-primary">
              Créer une alerte
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}