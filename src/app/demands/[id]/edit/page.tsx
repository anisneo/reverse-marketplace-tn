"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import Navbar from "@/components/Navbar"
import {
  Bike, Car, Zap, Smartphone, Search, Tag, MapPin, Clock,
  Check, ChevronLeft, ChevronRight, Info, Sparkles, Plus, Trash2, X, Save
} from "lucide-react"

const categories = [
  { id: "moto", name: "Moto", icon: Bike, color: "from-orange-500 to-red-500", bgColor: "bg-orange-50", borderColor: "border-orange-200", textColor: "text-orange-600", shadowColor: "shadow-orange-500/20", description: "Scooters, motos, cross, sportives..." },
  { id: "voiture", name: "Voiture", icon: Car, color: "from-blue-500 to-indigo-600", bgColor: "bg-blue-50", borderColor: "border-blue-200", textColor: "text-blue-600", shadowColor: "shadow-blue-500/20", description: "Berlines, SUVs, citadines, utilitaires..." },
  { id: "velo", name: "Vélo", icon: Bike, color: "from-green-500 to-emerald-600", bgColor: "bg-green-50", borderColor: "border-green-200", textColor: "text-green-600", shadowColor: "shadow-green-500/20", description: "VTT, route, électrique, pliant..." },
  { id: "trottinette", name: "Trottinette", icon: Zap, color: "from-purple-500 to-violet-600", bgColor: "bg-purple-50", borderColor: "border-purple-200", textColor: "text-purple-600", shadowColor: "shadow-purple-500/20", description: "Électrique, adulte, enfant, tout-terrain..." },
  { id: "electronique", name: "Électronique", icon: Smartphone, color: "from-pink-500 to-rose-600", bgColor: "bg-pink-50", borderColor: "border-pink-200", textColor: "text-pink-600", shadowColor: "shadow-pink-500/20", description: "Téléphones, PC, tablettes, consoles..." },
]

const conditions = [
  { value: "NEW", label: "Neuf", description: "Jamais utilisé, emballage d'origine" },
  { value: "LIKE_NEW", label: "Comme neuf", description: "Utilisé quelques fois, impeccable" },
  { value: "GOOD", label: "Bon état", description: "Signes d'usage légers, fonctionne parfaitement" },
  { value: "FAIR", label: "État correct", description: "Usure visible mais fonctionnel" },
  { value: "ANY", label: "Peu importe", description: "Tous les états acceptés" },
]

const tunisiaLocations: Record<string, string[]> = {
  "Tunis": ["Carthage", "La Médina", "Bab El Bhar", "Bab Souika", "El Omrane", "El Omrane Supérieur", "Ettahrir", "El Menzah", "Cité El Khadhra", "Le Bardo", "Sijoumi", "Ezzouhour", "El Hrairia", "Sidi Hassine", "El Quardia", "El Kabaria", "Sidi El Béchir", "Djebel Djelloud", "La Goulette", "Le Kram", "La Marsa"],
  "Ariana": ["L'Ariana Ville", "La Soukra", "Raoued", "Kalaat El Andalous", "Sidi Thabet", "Cité Ettadhamen", "El Mnihla"],
  "Ben Arous": ["Ben Arous", "La Nouvelle Médina", "El Mourouj", "Hammam Lif", "Hammam Chott", "Bou Mhel El Bassatine", "Ezzahra", "Radès", "Mégrine", "Mohamedia", "Fouchana", "Mornag"],
  "Manouba": ["Manouba", "Douar Hicher", "Oued Ellil", "Mornaguia", "Borj Amri", "Djedeida", "Tebourba", "El Battane"],
  "Nabeul": ["Nabeul", "Dar Chaabane El Fehri", "Béni Khiar", "Korba", "Menzel Temime", "Kélibia", "Soliman", "El Haouaria", "Béni Khalled", "Menzel Bouzelfa", "Bou Argoub", "El Mida", "Takelsa", "Hammam Ghezèze", "Grombalia", "Hammamet"],
  "Zaghouan": ["Zaghouan", "El Fahs", "Bir Mcherga", "Nadhour", "Saouaf", "Zriba"],
  "Bizerte": ["Bizerte Nord", "Bizerte Sud", "Ras Jebel", "Menzel Bourguiba", "Menzel Jemil", "Mateur", "Sejnane", "El Alia", "Joumine", "Ghezala", "Zarzouna", "Utique", "Ghar El Melh", "Tinja"],
  "Béja": ["Béja Nord", "Béja Sud", "Nefza", "Medjez El Bab", "Testour", "Téboursouk", "Amdoun", "Goubellat", "Thibar"],
  "Jendouba": ["Jendouba", "Bou Salem", "Tabarka", "Aïn Draham", "Fernana", "Beni M'Tir", "Ghardimaou", "Oued Meliz", "Balta Bou Aouane"],
  "Le Kef": ["Le Kef Est", "Le Kef Ouest", "Tajerouine", "Touiref", "Sakiet Sidi Youssef", "Nebeur", "Sers", "Dahmani", "Kalâat Senan", "Jerissa", "El Ksour"],
  "Siliana": ["Siliana Nord", "Siliana Sud", "Bou Arada", "Gaâfour", "El Krib", "Bourouis", "Makthar", "Er-Rouhia", "Kesra", "Bargou", "El Aroussa"],
  "Sousse": ["Sousse Médina", "Sousse Riadh", "Sousse Jawhara", "Sousse Sidi Abdelhamid", "Hammam Sousse", "Akouda", "Kalâa Kebira", "Sidi Bou Ali", "Hergla", "Enfidha", "Bouficha", "Kondar", "Sidi El Héni", "M'saken", "Kalâa Seghira", "Zaouia-Ksiba-Thrayet"],
  "Monastir": ["Monastir", "Ouerdanine", "Sahline", "Zermadine", "Béni Hassen", "Jemmel", "Bembla", "Moknine", "Bekalta", "Teboulba", "Ksar Hellal", "Ksibet El Mediouni", "Sayada-Lamta-Bou Hajar"],
  "Mahdia": ["Mahdia", "Bou Merdes", "Ouled Chamekh", "Chorbane", "Hebira", "Essouassi", "El Djem", "Chebba", "Melloulech", "Sidi Alouane", "Ksour Essef"],
  "Sfax": ["Sfax Ville", "Sfax Ouest", "Sakiet Ezzit", "Sakiet Eddaier", "Sfax Sud", "Thyna", "Agareb", "Djebeniana", "El Amra", "El Hencha", "Menzel Chaker", "Ghraïba", "Bir Ali Ben Khalifa", "Skhira", "Mahres", "Kerkennah"],
  "Kairouan": ["Kairouan Nord", "Kairouan Sud", "Echebika", "Sbikha", "El Ouslatia", "Haffouz", "El Alaa", "Hajeb El Ayoun", "Nasrallah", "Echrarda", "Bouhajla", "Hajeb El Oued"],
  "Kasserine": ["Kasserine Nord", "Kasserine Sud", "Ezzouhour", "Hassi Ferid", "Sbeitla", "Sbiba", "Djedeliane", "El Ayoun", "Thala", "Hidra", "Foussana", "Feriana", "Majel Bel Abbes"],
  "Sidi Bouzid": ["Sidi Bouzid Ouest", "Sidi Bouzid Est", "Jilma", "Cebbala Ouled Asker", "Bir El Hafey", "Sidi Ali Ben Aoun", "Menzel Bouzaiane", "Meknassy", "Souk Jedid", "Mezzouna", "Regueb", "Ouled Haffouz"],
  "Gabès": ["Gabès Médina", "Gabès Ouest", "Gabès Sud", "Ghannouch", "El Metouia", "Menzel El Habib", "El Hamma", "Matmata", "Nouvelle Matmata", "Mareth", "Oudhref"],
  "Medenine": ["Medenine Nord", "Medenine Sud", "Beni Khedech", "Ben Guerdane", "Zarzis", "Djerba Houmet Souk", "Djerba Midoun", "Djerba Ajim"],
  "Tataouine": ["Tataouine Nord", "Tataouine Sud", "Bir Lahmar", "Ghomrassen", "Dehiba", "Remada", "Smar", "Bir El Hafey"],
  "Gafsa": ["Gafsa Nord", "Gafsa Sud", "Sidi Bouzid", "El Ksar", "Moulares", "Redeyef", "Métlaoui", "Menzel El Habib", "Belkhir", "Sned", "El Guetar", "Oum El Araïes"],
  "Tozeur": ["Tozeur", "Degache", "Tamerza", "Nefta", "Hazoua", "El Hamma du Jérid"],
  "Kebili": ["Kebili Nord", "Kebili Sud", "Douz Nord", "Douz Sud", "Faouar", "El Faouar", "Souk Lahad"],
}

const stepLabels = [
  { num: 1, label: "Catégorie", icon: Search },
  { num: 2, label: "Détails", icon: Tag },
  { num: 3, label: "Spécificités", icon: Sparkles },
]

interface LocationEntry {
  governorate: string
  delegations: string[]
}

export default function EditDemandPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const id = params.id as string

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    criteria: {} as Record<string, string>,
    budgetMin: "",
    budgetMax: "",
    locations: [] as LocationEntry[],
    condition: "ANY",
  })

  useEffect(() => {
    async function loadDemand() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      const { data: demand } = await supabase
        .from("demands")
        .select("*, category:categories!demands_category_id_fkey(slug)")
        .eq("id", id)
        .single()

      if (!demand || demand.user_id !== user.id) { router.push("/dashboard"); return }

      let locations: LocationEntry[] = []
      if (demand.locations && Array.isArray(demand.locations) && demand.locations.length > 0) {
        locations = demand.locations
      }

      setFormData({
        categoryId: demand.category?.slug || "",
        title: demand.title || "",
        description: demand.description || "",
        criteria: demand.criteria || {},
        budgetMin: demand.budget_min?.toString() || "",
        budgetMax: demand.budget_max?.toString() || "",
        locations,
        condition: demand.condition || "ANY",
      })
      setLoading(false)
    }
    loadDemand()
  }, [id])

  const selectedCategory = categories.find((c) => c.id === formData.categoryId)

  function updateCriteria(key: string, value: string) {
    setFormData((prev) => ({ ...prev, criteria: { ...prev.criteria, [key]: value } }))
  }

  function addLocation() {
    setFormData((prev) => ({ ...prev, locations: [...prev.locations, { governorate: "", delegations: [] }] }))
  }

  function removeLocation(index: number) {
    setFormData((prev) => ({ ...prev, locations: prev.locations.filter((_, i) => i !== index) }))
  }

  function updateGovernorate(index: number, governorate: string) {
    setFormData((prev) => {
      const newLocations = [...prev.locations]
      newLocations[index] = { governorate, delegations: [] }
      return { ...prev, locations: newLocations }
    })
  }

  function toggleDelegation(index: number, delegation: string) {
    setFormData((prev) => {
      const newLocations = [...prev.locations]
      const entry = newLocations[index]
      const hasDelegation = entry.delegations.includes(delegation)
      newLocations[index] = { ...entry, delegations: hasDelegation ? entry.delegations.filter((d) => d !== delegation) : [...entry.delegations, delegation] }
      return { ...prev, locations: newLocations }
    })
  }

  function selectAllDelegations(index: number) {
    setFormData((prev) => {
      const newLocations = [...prev.locations]
      const entry = newLocations[index]
      const allDelegations = tunisiaLocations[entry.governorate] || []
      const allSelected = entry.delegations.length === allDelegations.length
      newLocations[index] = { ...entry, delegations: allSelected ? [] : [...allDelegations] }
      return { ...prev, locations: newLocations }
    })
  }

  async function handleSave() {
    setSaving(true)
    setError("")
    setSuccess(false)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError("Vous devez être connecté"); setSaving(false); return }

    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", formData.categoryId)
      .single()

    if (!categoryData) { setError("Catégorie non trouvée"); setSaving(false); return }

    const { error: updateError } = await supabase
      .from("demands")
      .update({
        title: formData.title,
        description: formData.description || null,
        category_id: categoryData.id,
        criteria: formData.criteria,
        budget_min: formData.budgetMin ? parseFloat(formData.budgetMin) : null,
        budget_max: formData.budgetMax ? parseFloat(formData.budgetMax) : null,
        locations: formData.locations,
        condition: formData.condition,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)

    if (updateError) { setError("Erreur : " + updateError.message); setSaving(false); return }

    setSuccess(true)
    setSaving(false)
    setTimeout(() => { router.push("/dashboard"); router.refresh() }, 1500)
  }

  const canProceed = () => {
    if (step === 1) return !!formData.categoryId
    if (step === 2) return !!formData.title && formData.locations.length > 0 && formData.locations.every(l => l.governorate && l.delegations.length > 0)
    return true
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Modifier la demande</h1>
          <p className="text-gray-600 text-lg">Modifiez les informations de votre demande</p>
        </div>

        {/* Stepper */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {stepLabels.map((s, i) => {
              const isActive = step === s.num
              const isCompleted = step > s.num
              const Icon = s.icon
              return (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCompleted ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25" : isActive ? "bg-blue-100 text-blue-600 border-2 border-blue-500" : "bg-gray-100 text-gray-400"}`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${isActive || isCompleted ? "text-gray-900" : "text-gray-400"}`}>{s.label}</span>
                  </div>
                  {i < stepLabels.length - 1 && <div className={`flex-1 h-1 mx-4 rounded-full ${isCompleted ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-gray-200"}`} />}
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

        {success && (
          <div className="mb-6 rounded-2xl bg-green-50 border border-green-200 p-4 flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">Demande mise à jour ! Redirection...</p>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 sm:p-8">
          {/* Step 1 — Catégorie */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quelle catégorie ?</h2>
                <p className="text-gray-600">Sélectionnez le type de produit que vous recherchez</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  const isSelected = formData.categoryId === cat.id
                  return (
                    <button key={cat.id} onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                      className={`group relative overflow-hidden rounded-2xl border-2 p-6 transition-all text-left ${isSelected ? `${cat.borderColor} ${cat.bgColor} shadow-lg ${cat.shadowColor}` : "border-gray-200 hover:border-gray-300 hover:shadow-md"}`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${cat.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-7 h-7 ${cat.textColor}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`text-lg font-semibold ${isSelected ? cat.textColor : "text-gray-900"}`}>{cat.name}</h3>
                            {isSelected && <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center`}><Check className="w-4 h-4 text-white" /></div>}
                          </div>
                          <p className="text-sm text-gray-500">{cat.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2 — Détails */}
          {step === 2 && selectedCategory && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Détails de votre recherche</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Titre <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-gray-400 font-normal">(optionnel)</span></label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all min-h-[120px] resize-y" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Budget min (TND)</label>
                    <input type="number" value={formData.budgetMin} onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" placeholder="0" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Budget max (TND) <span className="text-red-500">*</span></label>
                    <input type="number" value={formData.budgetMax} onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" placeholder="10000" min="0" />
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">Villes et délégations <span className="text-red-500">*</span></label>
                    <button onClick={addLocation} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <Plus className="w-4 h-4" />Ajouter une ville
                    </button>
                  </div>
                  {formData.locations.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
                      <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Aucune ville sélectionnée.</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    {formData.locations.map((location, index) => {
                      const availableDelegations = tunisiaLocations[location.governorate] || []
                      const allSelected = location.delegations.length === availableDelegations.length && availableDelegations.length > 0
                      return (
                        <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">Ville {index + 1}</span>
                            <button onClick={() => removeLocation(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <select value={location.governorate} onChange={(e) => updateGovernorate(index, e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none bg-white text-sm">
                            <option value="">Choisir un gouvernorat</option>
                            {Object.keys(tunisiaLocations).map((gov) => <option key={gov} value={gov}>{gov}</option>)}
                          </select>
                          {location.governorate && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-gray-500">Délégations</label>
                                <button onClick={() => selectAllDelegations(index)} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                                  {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
                                </button>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {availableDelegations.map((delegation) => {
                                  const isSelected = location.delegations.includes(delegation)
                                  return (
                                    <button key={delegation} onClick={() => toggleDelegation(index, delegation)}
                                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all ${isSelected ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                                      <div className="flex items-center gap-1.5">
                                        {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
                                        <span className="truncate">{delegation}</span>
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">État souhaité</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {conditions.map((cond) => (
                      <button key={cond.value} onClick={() => setFormData({ ...formData, condition: cond.value })}
                        className={`rounded-xl border-2 p-4 text-left transition-all ${formData.condition === cond.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold ${formData.condition === cond.value ? "text-blue-700" : "text-gray-900"}`}>{cond.label}</span>
                          {formData.condition === cond.value && <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                        </div>
                        <p className="text-xs text-gray-500">{cond.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Critères */}
          {step === 3 && selectedCategory && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Critères spécifiques</h2>
                <p className="text-gray-600">Ajoutez des détails pour affiner votre recherche</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Marque</label>
                  <input type="text" value={formData.criteria["marque"] || ""} onChange={(e) => updateCriteria("marque", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" placeholder="Renault, Yamaha..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Modèle</label>
                  <input type="text" value={formData.criteria["modele"] || ""} onChange={(e) => updateCriteria("modele", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" placeholder="Clio, MT-07..." />
                </div>
              </div>
              {formData.locations.length > 0 && (
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />Zones de recherche
                  </h3>
                  <div className="space-y-3">
                    {formData.locations.map((loc, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{loc.governorate}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {loc.delegations.length === (tunisiaLocations[loc.governorate]?.length || 0) ? "Toutes les délégations" : loc.delegations.join(", ")}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{loc.delegations.length} délég.</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex justify-between items-center pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                <ChevronLeft className="w-5 h-5" />Retour
              </button>
            ) : <div />}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} disabled={!canProceed()}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Suivant<ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handleSave} disabled={saving || success}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                {saving ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enregistrement...</> : <><Save className="w-5 h-5" />Enregistrer les modifications</>}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />Votre demande sera visible pendant 30 jours
          </p>
        </div>
      </div>
    </div>
  )
}