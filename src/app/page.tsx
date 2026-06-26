import Link from "next/link"
import { Search, Bike, Car, Smartphone, Zap, ArrowRight, Shield, Clock, MessageCircle } from "lucide-react"

const categories = [
  { name: "Motos", slug: "moto", icon: Bike, color: "bg-orange-100 text-orange-600" },
  { name: "Voitures", slug: "voiture", icon: Car, color: "bg-blue-100 text-blue-600" },
  { name: "Vélos", slug: "velo", icon: Bike, color: "bg-green-100 text-green-600" },
  { name: "Trottinettes", slug: "trottinette", icon: Zap, color: "bg-purple-100 text-purple-600" },
  { name: "Électronique", slug: "electronique", icon: Smartphone, color: "bg-pink-100 text-pink-600" },
]

const features = [
  { icon: Search, title: "Postez votre demande", description: "Décrivez ce que vous cherchez en quelques clics" },
  { icon: MessageCircle, title: "Recevez des offres", description: "Les vendeurs vous contactent avec leurs propositions" },
  { icon: Shield, title: "Comparez en toute sécurité", description: "Choisissez la meilleure offre, payez en toute confiance" },
  { icon: Clock, title: "Gagnez du temps", description: "Plus besoin de scroller des milliers d'annonces" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Ne cherchez plus,{' '}
            <span className="text-primary-600">faites venir</span> les offres à vous
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            La première marketplace inversée en Tunisie. Postez ce que vous cherchez 
            (moto, voiture, vélo, électronique...) et les vendeurs viennent à vous avec leurs meilleures offres.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demands/new"
              className="btn-primary text-base px-8 py-3"
            >
              Je cherche quelque chose
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="btn-secondary text-base px-8 py-3"
            >
              Je suis vendeur
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            Que cherchez-vous ?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/demands/new?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-md"
              >
                <div className={`rounded-full p-3 ${cat.color}`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <span className="font-medium text-gray-900 group-hover:text-primary-600">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à trouver ce que vous cherchez ?
          </h2>
          <p className="text-gray-600 mb-8">
            Rejoignez des milliers de Tunisiens qui utilisent déjà notre plateforme.
          </p>
          <Link
            href="/demands/new"
            className="btn-primary text-base px-8 py-3"
          >
            Poster ma première demande
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4">
        <div className="mx-auto max-w-6xl text-center text-sm text-gray-500">
          © 2024 Trouve-Moi.tn - Marketplace Inversé Tunisie
        </div>
      </footer>
    </div>
  )
}