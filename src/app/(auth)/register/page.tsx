"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Sparkles, Check } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "BUYER" as "BUYER" | "SELLER" | "BOTH",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères")
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: formData.role,
          },
        },
      })

      if (signUpError) {
        if (signUpError.message === "User already registered") {
          setError("Cet email est déjà utilisé. Veuillez vous connecter.")
        } else {
          setError(signUpError.message || "Erreur lors de l'inscription")
        }
        setLoading(false)
        return
      }

      if (data.user) {
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone || null,
          role: formData.role,
        })

        if (insertError) {
          console.log("Erreur insertion users:", insertError)
        }

        window.location.href = "/dashboard"
      }
    } catch (err) {
      setError("Erreur lors de l'inscription")
      setLoading(false)
    }
  }

  const roles = [
    { value: "BUYER" as const, label: "Acheteur", description: "Je cherche à acheter", icon: User },
    { value: "SELLER" as const, label: "Vendeur", description: "Je veux vendre mes produits", icon: Sparkles },
    { value: "BOTH" as const, label: "Les deux", description: "J'achète et je vends", icon: Check },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Trouve-Moi<span className="text-gray-400">.tn</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Créer un compte 🚀
          </h1>
          <p className="text-gray-600">
            Rejoignez la première marketplace inversée en Tunisie
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-500 text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                    placeholder="Ahmed"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                    placeholder="Ben Ali"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  placeholder="+216 XX XXX XXX"
                />
              </div>
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Je suis...
              </label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon
                  const isSelected = formData.role === role.value
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.value })}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
                      <span className={`text-sm font-semibold ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                        {role.label}
                      </span>
                      <span className="text-xs text-gray-500 text-center leading-tight">
                        {role.description}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 pl-12 pr-12 py-3.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  placeholder="Min. 6 caractères"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 mb-4">
              Déjà un compte ?
            </p>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-100 transition-all"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Se connecter
            </Link>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-gray-500">
          © 2024 Trouve-Moi.tn - Marketplace Inversé Tunisie
        </p>
      </div>
    </div>
  )
}