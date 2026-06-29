"use client"

import Link from "next/link"
import Navbar from "@/components/Navbar"
import {
  ArrowRight,
  Search,
  MessageCircle,
  Shield,
  Clock,
  Users,
  Award,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Zap,
  Smartphone,
  Bike,
  Car,
  Package,
  Star,
  MapPin,
  ChevronRight,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Postez votre demande",
    description: "Décrivez précisément ce que vous cherchez en quelques clics. C'est gratuit et sans engagement.",
    color: "from-blue-400 to-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-500"
  },
  {
    icon: MessageCircle,
    title: "Recevez des offres",
    description: "Les vendeurs qualifiés viennent à vous avec leurs meilleures propositions adaptées à vos critères.",
    color: "from-green-400 to-green-500",
    bgColor: "bg-green-50",
    textColor: "text-green-500"
  },
  {
    icon: Shield,
    title: "Comparez en sécurité",
    description: "Choisissez la meilleure offre parmi celles reçues et finalisez la transaction en toute confiance.",
    color: "from-purple-400 to-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-500"
  },
  {
    icon: Clock,
    title: "Gagnez du temps",
    description: "Plus besoin de parcourir des milliers d'annonces. Les offres pertinentes viennent directement à vous.",
    color: "from-orange-400 to-orange-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-500"
  }
]

const stats = [
  { number: "10K+", label: "Demandes publiées", icon: Package },
  { number: "5K+", label: "Vendeurs actifs", icon: Users },
  { number: "98%", label: "Satisfaction client", icon: Award },
  { number: "24h", label: "Temps moyen de réponse", icon: Clock },
]

const steps = [
  {
    number: "01",
    title: "Créez votre compte",
    description: "Inscrivez-vous gratuitement en quelques secondes pour commencer à utiliser la plateforme.",
    icon: Users
  },
  {
    number: "02",
    title: "Postez votre demande",
    description: "Décrivez ce que vous cherchez avec tous les détails importants (catégorie, budget, localisation...).",
    icon: Search
  },
  {
    number: "03",
    title: "Recevez des offres",
    description: "Les vendeurs intéressés vous contactent directement avec leurs propositions adaptées.",
    icon: MessageCircle
  },
  {
    number: "04",
    title: "Finalisez la transaction",
    description: "Comparez les offres, choisissez la meilleure et concluez la vente en toute sécurité.",
    icon: Shield
  }
]

const categories = [
  { name: "Motos", icon: Bike, color: "from-orange-400 to-orange-500" },
  { name: "Voitures", icon: Car, color: "from-blue-400 to-blue-500" },
  { name: "Vélos", icon: Bike, color: "from-green-400 to-green-500" },
  { name: "Trottinettes", icon: Zap, color: "from-purple-400 to-purple-500" },
  { name: "Électronique", icon: Smartphone, color: "from-pink-400 to-pink-500" },
]

const testimonials = [
  {
    name: "Ahmed Ben Salah",
    role: "Acheteur",
    avatar: "AB",
    content: "J'ai trouvé ma voiture idéale en moins de 48h grâce à Trouve-Moi.tn. Les vendeurs sont venus à moi avec des offres compétitives.",
    rating: 5,
    city: "Tunis"
  },
  {
    name: "Sara Miled",
    role: "Vendeuse",
    avatar: "SM",
    content: "La plateforme m'a permis de trouver des acheteurs sérieux rapidement. J'ai vendu ma moto en une semaine sans aucun effort.",
    rating: 5,
    city: "Sousse"
  },
  {
    name: "Karim Laabidi",
    role: "Acheteur",
    avatar: "KL",
    content: "Je cherchais un iPhone 14 Pro et j'ai reçu plusieurs offres intéressantes. La comparaison était facile et j'ai fait une excellente affaire.",
    rating: 4,
    city: "Sfax"
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-500 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            À propos de nous
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            La première marketplace <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              inversée en Tunisie
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Trouve-Moi.tn révolutionne la façon d'acheter et de vendre en Tunisie. 
            Postez ce que vous cherchez, les vendeurs viennent à vous.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demands/new"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl hover:shadow-xl hover:shadow-blue-400/25 hover:-translate-y-0.5 transition-all"
            >
              <Search className="w-5 h-5" />
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#comment-ca-marche"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-lg transition-all"
            >
              En savoir plus
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
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
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-500 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Processus simple
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            4 étapes simples pour trouver ce que vous cherchez en toute simplicité.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="relative group">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-400/25">
                    {step.number}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gray-200 -translate-y-1/2" />
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir Trouve-Moi.tn ?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Une plateforme conçue pour faciliter vos transactions en Tunisie.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-8 hover:shadow-xl transition-all">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Toutes les catégories
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Trouvez ce que vous cherchez dans nos nombreuses catégories.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <Link
                key={i}
                href={`/demands/new?category=${cat.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all hover:border-transparent"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-gray-600 group-hover:text-blue-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                <div className="mt-2 flex items-center justify-center text-sm font-medium text-gray-400 group-hover:text-blue-500 transition-colors">
                  Poster une demande
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-600 text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-current" />
            Témoignages
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ce que nos utilisateurs disent
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez les expériences de nos utilisateurs satisfaits.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{testimonial.role}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.city}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-400 to-blue-500 p-8 sm:p-12 lg:p-16 text-center shadow-xl shadow-blue-400/20">
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Rejoignez la communauté
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Prêt à trouver ce que vous cherchez ?
            </h2>
            <p className="text-blue-50 text-lg max-w-2xl mx-auto mb-8">
              Rejoignez des milliers de Tunisiens qui utilisent déjà Trouve-Moi.tn pour acheter et vendre en toute simplicité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demands/new"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-blue-500 bg-white rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <Search className="w-5 h-5" />
                Poster ma première demande
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-2xl hover:bg-white/10 transition-all"
              >
                <Users className="w-5 h-5" />
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-400/25">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Trouve-Moi<span className="text-gray-500">.tn</span></span>
              </div>
              <p className="text-sm text-gray-400">La première marketplace inversée en Tunisie.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link href="/demands" className="hover:text-white transition-colors">Demandes</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">À propos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Compte</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="hover:text-white transition-colors">Connexion</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Inscription</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Tableau de bord</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  contact@trouve-moi.tn
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Tunisie
                </li>
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