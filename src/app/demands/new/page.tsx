"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  Bike, 
  Car, 
  Zap, 
  Smartphone, 
  ChevronRight, 
  ChevronLeft, 
  Check,
  Search,
  MapPin,
  Tag,
  Clock,
  ArrowRight,
  X,
  Info,
  Sparkles
} from "lucide-react"
import Link from "next/link"

const categories = [
  { 
    id: "moto", 
    name: "Moto", 
    icon: Bike, 
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
    shadowColor: "shadow-orange-500/20",
    description: "Scooters, motos, cross, sportives..."
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
    description: "Berlines, SUVs, citadines, utilitaires..."
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
    description: "VTT, route, électrique, pliant..."
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
    description: "Électrique, adulte, enfant, tout-terrain..."
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
    description: "Téléphones, PC, tablettes, consoles..."
  },
]

const conditions = [
  { value: "NEW", label: "Neuf", description: "Jamais utilisé, emballage d'origine" },
  { value: "LIKE_NEW", label: "Comme neuf", description: "Utilisé quelques fois, impeccable" },
  { value: "GOOD", label: "Bon état", description: "Signes d'usage légers, fonctionne parfaitement" },
  { value: "FAIR", label: "État correct", description: "Usure visible mais fonctionnel" },
  { value: "ANY", label: "Peu importe", description: "Tous les états acceptés" },
]

const cities = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", "Bizerte", "Béja",
  "Jendouba", "Le Kef", "Siliana", "Sousse", "Monastir", "Mahdia", "Sfax", "Kairouan",
  "Kasserine", "Sidi Bouzid", "Gabès", "Medenine", "Tataouine", "Gafsa", "Tozeur", "Kebili"
]

const stepLabels = [
  { num: 1, label: "Catégorie", icon: Search },
  { num: 2, label: "Détails", icon: Tag },
  { num: 3, label: "Spécificités", icon: Sparkles },
]

export default function NewDemandPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    categoryId: searchParams.get("category") || "",
    title: "",
    description: "",
    criteria: {} as Record<string, string>,
    budgetMin: "",
    budgetMax: "",
    city: "",
    region: "",
    condition: "ANY",
  })

  const selectedCategory = categories.find((c) => c.id === formData.categoryId)

  function updateCriteria(key: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      criteria: { ...prev.criteria, [key]: value },
    }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")

    console.log("=== DÉBUT PUBLICATION ===")
    console.log("Catégorie sélectionnée:", formData.categoryId)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("Vous devez être connecté pour publier une demande")
      setLoading(false)
      return
    }

    console.log("Utilisateur connecté:", user.id)

    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("slug", formData.categoryId)
      .maybeSingle()

    console.log("Résultat requête catégorie:", { categoryData, categoryError })

    if (categoryError) {
      console.log("Erreur catégorie:", categoryError)
      setError("Erreur lors de la récupération de la catégorie: " + categoryError.message)
      setLoading(false)
      return
    }

    if (!categoryData) {
      console.log("Catégorie non trouvée pour slug:", formData.categoryId)
      setError("Catégorie non trouvée: " + formData.categoryId)
      setLoading(false)
      return
    }

    console.log("Catégorie trouvée:", categoryData)

    const insertData = {
      title: formData.title,
      description: formData.description || null,
      category_id: categoryData.id,
      criteria: formData.criteria,
      budget_min: formData.budgetMin ? parseFloat(formData.budgetMin) : null,
      budget_max: formData.budgetMax ? parseFloat(formData.budgetMax) : null,
      currency: "TND",
      city: formData.city,
      region: formData.region || null,
      condition: formData.condition,
      status: "ACTIVE",
      user_id: user.id,
    }

    console.log("Données à insérer:", insertData)

    const { error: insertError } = await supabase.from("demands").insert(insertData)

    if (insertError) {
      console.log("Erreur insertion:", insertError)
      setError("Erreur lors de la publication: " + insertError.message)
      setLoading(false)
      return
    }

    console.log("Demande publiée avec succès!")
    console.log("=== FIN PUBLICATION ===")

    router.push("/dashboard")
    router.refresh()
  }

  const canProceed = () => {
    if (step === 1) return !!formData.categoryId
    if (step === 2) return !!formData.title && !!formData.city
    if (step === 3) return true
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Trouve-Moi<span className="text-gray-400">.tn</span>
              </span>
            </Link>
            
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
              Annuler
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Poster une demande
          </h1>
          <p className="text-gray-600 text-lg">
            Décrivez ce que vous cherchez, les vendeurs viendront à vous
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {stepLabels.map((s, i) => {
              const isActive = step === s.num
              const isCompleted = step > s.num
              const Icon = s.icon

              return (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                          : isActive
                          ? "bg-blue-100 text-blue-600 border-2 border-blue-500"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive || isCompleted ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                        isCompleted ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 sm:p-8">
          {/* Step 1: Category */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Quelle catégorie ?
                </h2>
                <p className="text-gray-600">
                  Sélectionnez le type de produit que vous recherchez
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  const isSelected = formData.categoryId === cat.id

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                      className={`group relative overflow-hidden rounded-2xl border-2 p-6 transition-all text-left ${
                        isSelected
                          ? `${cat.borderColor} ${cat.bgColor} shadow-lg ${cat.shadowColor}`
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 rounded-bl-full transition-opacity`}></div>
                      
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${cat.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-7 h-7 ${cat.textColor}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`text-lg font-semibold ${isSelected ? cat.textColor : "text-gray-900"}`}>
                              {cat.name}
                            </h3>
                            {isSelected && (
                              <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center`}>
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && selectedCategory && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${selectedCategory.bgColor} ${selectedCategory.textColor} text-sm font-medium mb-4`}>
                  <selectedCategory.icon className="w-4 h-4" />
                  {selectedCategory.name}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Détails de votre recherche
                </h2>
                <p className="text-gray-600">
                  Plus vous êtes précis, plus vous recevrez d'offres pertinentes
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Titre de la demande <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                    placeholder={`Ex: ${selectedCategory.name} ${selectedCategory.id === "voiture" ? "Clio 4 diesel" : selectedCategory.id === "moto" ? "Yamaha MT-07" : "iPhone 14 Pro"}...`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all min-h-[120px] resize-y"
                    placeholder="Précisez vos critères : couleur préférée, accessoires souhaités, année, kilométrage maximum..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget minimum <span className="text-gray-400 font-normal">(TND)</span>
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.budgetMin}
                        onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget maximum <span className="text-red-500">*</span> <span className="text-gray-400 font-normal">(TND)</span>
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.budgetMax}
                        onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder="10000"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all appearance-none bg-white"
                      required
                    >
                      <option value="">Choisir une ville</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    État souhaité
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {conditions.map((cond) => (
                      <button
                        key={cond.value}
                        onClick={() => setFormData({ ...formData, condition: cond.value })}
                        className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                          formData.condition === cond.value
                            ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold ${
                            formData.condition === cond.value ? "text-blue-700" : "text-gray-900"
                          }`}>
                            {cond.label}
                          </span>
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

          {/* Step 3: Specific criteria */}
          {step === 3 && selectedCategory && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${selectedCategory.bgColor} ${selectedCategory.textColor} text-sm font-medium mb-4`}>
                  <Sparkles className="w-4 h-4" />
                  {selectedCategory.name}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Critères spécifiques
                </h2>
                <p className="text-gray-600">
                  Ajoutez des détails pour affiner votre recherche
                </p>
              </div>

              <div className="space-y-5">
                {selectedCategory.id === "voiture" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Marque</label>
                        <input
                          type="text"
                          value={formData.criteria["marque"] || ""}
                          onChange={(e) => updateCriteria("marque", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          placeholder="Renault, Peugeot, Volkswagen..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Modèle</label>
                        <input
                          type="text"
                          value={formData.criteria["modele"] || ""}
                          onChange={(e) => updateCriteria("modele", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          placeholder="Clio, 208, Golf..."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Année min</label>
                        <input
                          type="number"
                          value={formData.criteria["annee_min"] || ""}
                          onChange={(e) => updateCriteria("annee_min", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          placeholder="2018"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Kilométrage max</label>
                        <input
                          type="number"
                          value={formData.criteria["kilometrage_max"] || ""}
                          onChange={(e) => updateCriteria("kilometrage_max", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          placeholder="100000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Carburant</label>
                        <select
                          value={formData.criteria["carburant"] || ""}
                          onChange={(e) => updateCriteria("carburant", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all appearance-none bg-white"
                        >
                          <option value="">Tous</option>
                          <option value="essence">Essence</option>
                          <option value="diesel">Diesel</option>
                          <option value="hybride">Hybride</option>
                          <option value="electrique">Électrique</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {selectedCategory.id === "moto" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Marque</label>
                        <input
                          type="text"
                          value={formData.criteria["marque"] || ""}
                          onChange={(e) => updateCriteria("marque", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          placeholder="Yamaha, Honda, Kawasaki..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Modèle</label>
                        <input
                          type="text"
                          value={formData.criteria["modele"] || ""}
                          onChange={(e) => updateCriteria("modele", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          placeholder="MT-07, CBR500R..."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cylindrée</label>
                        <input
                          type="text"
                          value={formData.criteria["cylindree"] || ""}
                          onChange={(e) => updateCriteria("cylindree", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          placeholder="125cc, 600cc, 1000cc..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Année</label>
                        <input
                          type="number"
                          value={formData.criteria["annee"] || ""}
                          onChange={(e) => updateCriteria("annee", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          placeholder="2020"
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedCategory.id === "electronique" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                        <select
                          value={formData.criteria["type"] || ""}
                          onChange={(e) => updateCriteria("type", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all appearance-none bg-white"
                        >
                          <option value="">Choisir...</option>
                          <option value="smartphone">Smartphone</option>
                          <option value="ordinateur">Ordinateur</option>
                          <option value="tablette">Tablette</option>
                          <option value="console">Console de jeux</option>
                          <option value="accessoire">Accessoire</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Marque</label>
                        <input
                          type="text"
                          value={formData.criteria["marque"] || ""}
                          onChange={(e) => updateCriteria("marque", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          placeholder="Apple, Samsung, Sony..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Modèle / Référence</label>
                      <input
                        type="text"
                        value={formData.criteria["modele"] || ""}
                        onChange={(e) => updateCriteria("modele", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder="iPhone 14 Pro, Galaxy S23, MacBook Pro..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Capacité / Stockage</label>
                      <input
                        type="text"
                        value={formData.criteria["capacite"] || ""}
                        onChange={(e) => updateCriteria("capacite", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder="128GB, 256GB, 512GB..."
                      />
                    </div>
                  </>
                )}

                {(selectedCategory.id === "velo" || selectedCategory.id === "trottinette") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Marque</label>
                      <input
                        type="text"
                        value={formData.criteria["marque"] || ""}
                        onChange={(e) => updateCriteria("marque", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder="Décathlon, Xiaomi, Specialized..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {selectedCategory.id === "velo" ? "Taille / Type" : "Autonomie"}
                      </label>
                      <input
                        type="text"
                        value={formData.criteria[selectedCategory.id === "velo" ? "taille" : "autonomie"] || ""}
                        onChange={(e) => updateCriteria(selectedCategory.id === "velo" ? "taille" : "autonomie", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder={selectedCategory.id === "velo" ? "S, M, L, VTT, route..." : "30km, 50km, 65km..."}
                      />
                    </div>
                  </div>
                )}

                {/* Generic fields for all categories */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Informations complémentaires
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Couleur préférée
                    </label>
                    <input
                      type="text"
                      value={formData.criteria["couleur"] || ""}
                      onChange={(e) => updateCriteria("couleur", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                      placeholder="Noir, blanc, rouge..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between items-center pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Retour
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                Suivant
                <ChevronRight className="w-5 h-5" />
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

        {/* Help text */}
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