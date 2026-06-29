"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Navbar from "@/components/Navbar"
import {
  Search,
  Bike,
  Car,
  Smartphone,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  MessageCircle,
  User,
  UserPlus,
  TrendingUp,
  MapPin,
  Star,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Check,
  Award,
  Users,
  Package
} from "lucide-react"

const categories = [
  { name: "Motos", slug: "moto", icon: Bike, color: "from-orange-500 to-red-500", bgColor: "bg-orange-50", textColor: "text-orange-600", borderColor: "border-orange-200", description: "Scooters, motos, cross, sportives..." },
  { name: "Voitures", slug: "voiture", icon: Car, color: "from-blue-500 to-indigo-600", bgColor: "bg-blue-50", textColor: "text-blue-600", borderColor: "border-blue-200", description: "Berlines, SUVs, citadines, utilitaires..." },
  { name: "Vélos", slug: "velo", icon: Bike, color: "from-green-500 to-emerald-600", bgColor: "bg-green-50", textColor: "text-green-600", borderColor: "border-green-200", description: "VTT, route, électrique, pliant..." },
  { name: "Trottinettes", slug: "trottinette", icon: Zap, color: "from-purple-500 to-violet-600", bgColor: "bg-purple-50", textColor: "text-purple-600", borderColor: "border-purple-200", description: "Électrique, adulte, enfant, tout-terrain..." },
  { name: "Électronique", slug: "electronique", icon: Smartphone, color: "from-pink-500 to-rose-600", bgColor: "bg-pink-50", textColor: "text-pink-600", borderColor: "border-pink-200", description: "Téléphones, PC, tablettes, consoles..." },
]

const features = [
  { icon: Search, title: "Postez votre demande", description: "Décrivez ce que vous cherchez en quelques clics. C'est gratuit et rapide !", color: "bg-blue-100 text-blue-600" },
  { icon: MessageCircle, title: "Recevez des offres", description: "Les vendeurs viennent à vous avec leurs meilleures propositions.", color: "bg-green-100 text-green-600" },
  { icon: Shield, title: "Comparez en sécurité", description: "Choisissez la meilleure offre, payez en toute confiance sur la plateforme.", color: "bg-purple-100 text-purple-600" },
  { icon: Clock, title: "Gagnez du temps", description: "Plus besoin de scroller des milliers d'annonces. Les offres viennent à vous !", color: "bg-orange-100 text-orange-600" },
]

const stats = [
  { number: "10K+", label: "Demandes publiées", icon: Package },
  { number: "5K+", label: "Vendeurs actifs", icon: Users },
  { number: "98%", label: "Satisfaction client", icon: Award },
  { number: "24h", label: "Temps moyen de réponse", icon: Clock },
]

export default function HomePage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { email: data.user.email || "" } : null)
      setLoadingUser(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email || "" } : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            La première marketplace inversée en Tunisie
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Ne cherchez plus,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              faites venir
            </span>{" "}
            les offres à vous
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Postez ce que vous cherchez et les vendeurs viennent à vous avec leurs meilleures offres. Gratuit et sans engagement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/demands/new"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all"
            >
              <Search className="w-5 h-5" />
              Je cherche quelque chose
              <ArrowRight className="w-5 h-5" />
            </Link>
            {!user && (
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-lg transition-all"
              >
                <TrendingUp className="w-5 h-5" />
                Je suis vendeur
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-4 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="w-5 h-5 text-blue-500" />
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Que cherchez-vous ?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choisissez une catégorie et décrivez ce que vous voulez. Les vendeurs vous contacteront.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.slug}
                href={`/demands/new?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-transparent"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                <div className={`w-14 h-14 rounded-2xl ${cat.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${cat.textColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{cat.description}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                  Poster une demande
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
          <p className="text-gray-600 text-lg">3 étapes simples pour trouver ce que vous cherchez</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.slice(0, 3).map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="relative group">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-8 hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/25">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-12 lg:p-16 text-center shadow-xl shadow-blue-500/20">
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Rejoignez la communauté
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Prêt à trouver ce que vous cherchez ?
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
              Rejoignez des milliers de Tunisiens qui utilisent déjà Trouve-Moi.tn pour acheter et vendre en toute simplicité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demands/new"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-blue-600 bg-white rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <Search className="w-5 h-5" />
                Poster ma première demande
                <ArrowRight className="w-5 h-5" />
              </Link>
              {!user && (
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-2xl hover:bg-white/10 transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  Créer un compte
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6 text-center hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Trouve-Moi<span className="text-gray-500">.tn</span></span>
              </div>
              <p className="text-sm text-gray-400">La première marketplace inversée en Tunisie.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Catégories</h4>
              <ul className="space-y-2 text-sm">
                {categories.map(c => (
                  <li key={c.slug}>
                    <Link href={`/demands/new?category=${c.slug}`} className="hover:text-white transition-colors">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="hover:text-white transition-colors">Connexion</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Inscription</Link></li>
                <li><Link href="/demands" className="hover:text-white transition-colors">Toutes les demandes</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Comment ça marche</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Tunisie
                </li>
                <li className="text-gray-400">contact@trouve-moi.tn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            © 2024 Trouve-Moi.tn - Marketplace Inversée Tunisie. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}