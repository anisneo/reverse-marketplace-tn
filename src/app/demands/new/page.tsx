"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Bike, Car, Zap, Smartphone, ChevronRight, ChevronLeft, Check } from "lucide-react"

const categories = [
  { id: "moto", name: "Moto", icon: Bike, fields: ["marque", "modele", "cylindree", "annee", "kilometrage"] },
  { id: "voiture", name: "Voiture", icon: Car, fields: ["marque", "modele", "annee", "kilometrage", "carburant", "boite"] },
  { id: "velo", name: "Vélo", icon: Bike, fields: ["type", "taille", "marque"] },
  { id: "trottinette", name: "Trottinette", icon: Zap, fields: ["marque", "autonomie", "vitesse_max"] },
  { id: "electronique", name: "Électronique", icon: Smartphone, fields: ["type", "marque", "modele", "capacite"] },
]

const conditions = [
  { value: "NEW", label: "Neuf" },
  { value: "LIKE_NEW", label: "Comme neuf" },
  { value: "GOOD", label: "Bon état" },
  { value: "FAIR", label: "État correct" },
  { value: "ANY", label: "Peu importe" },
]

const cities = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", "Bizerte", "Béja",
  "Jendouba", "Le Kef", "Siliana", "Sousse", "Monastir", "Mahdia", "Sfax", "Kairouan",
  "Kasserine", "Sidi Bouzid", "Gabès", "Medenine", "Tataouine", "Gafsa", "Tozeur", "Kebili"
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
      setError("Vous devez être connecté")
      setLoading(false)
      return
    }

    console.log("Utilisateur connecté:", user.id)

    // Get category from DB
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Poster une demande</h1>
          <p className="text-gray-600 mt-1">Décrivez ce que vous cherchez, les vendeurs viendront à vous</p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  s < step
                    ? "bg-blue-600 text-white"
                    : s === step
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-600"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s < step ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`h-1 flex-1 rounded ${s < step ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <div className="card">
          {/* Step 1: Category */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quelle catégorie ?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        formData.categoryId === cat.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Icon className={`h-8 w-8 ${formData.categoryId === cat.id ? "text-blue-600" : "text-gray-400"}`} />
                      <span className={`text-sm font-medium ${formData.categoryId === cat.id ? "text-blue-700" : "text-gray-700"}`}>
                        {cat.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && selectedCategory && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails de votre recherche</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la demande *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder={`Ex: ${selectedCategory.name} ${selectedCategory.fields[0]}...`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field min-h-[100px]"
                  placeholder="Précisez vos critères, couleur préférée, accessoires souhaités..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget min (TND)</label>
                  <input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget max (TND) *</label>
                  <input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                    className="input-field"
                    placeholder="10000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Choisir une ville</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">État souhaité</label>
                <div className="flex flex-wrap gap-2">
                  {conditions.map((cond) => (
                    <button
                      key={cond.value}
                      onClick={() => setFormData({ ...formData, condition: cond.value })}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        formData.condition === cond.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cond.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Specific criteria */}
          {step === 3 && selectedCategory && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Critères spécifiques - {selectedCategory.name}</h2>
              {selectedCategory.fields.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type="text"
                    value={formData.criteria[field] || ""}
                    onChange={(e) => updateCriteria(field, e.target.value)}
                    className="input-field"
                    placeholder={`Ex: ${field === "marque" ? "Yamaha, Honda..." : field === "modele" ? "MT-07, Civic..." : ""}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Retour
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-50"
              >
                Suivant
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Publication..." : "Publier ma demande"}
                <Check className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}