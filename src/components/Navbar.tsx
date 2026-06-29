"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Search, User, UserPlus, Menu, X } from "lucide-react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
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

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Accueil</Link>
            <Link href="/demands" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Demandes</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Comment ça marche</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!loadingUser && (
              user ? (
                <>
                  <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    <User className="w-4 h-4" />Mon espace
                  </Link>
                  <button onClick={handleSignOut} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl hover:shadow-lg transition-all">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    <User className="w-4 h-4" />Connexion
                  </Link>
                  <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                    <UserPlus className="w-4 h-4" />Inscription
                  </Link>
                </>
              )
            )}
          </div>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link href="/" className="block py-2 text-gray-600 font-medium">Accueil</Link>
          <Link href="/demands" className="block py-2 text-gray-600 font-medium">Demandes</Link>
          <Link href="/about" className="block py-2 text-gray-600 font-medium">Comment ça marche</Link>
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 py-2 text-gray-700 font-medium">
                  <User className="w-4 h-4" />Mon espace
                </Link>
                <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2.5 text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl font-medium w-full">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-2 py-2 text-gray-700 font-medium">
                  <User className="w-4 h-4" />Connexion
                </Link>
                <Link href="/register" className="flex items-center gap-2 px-4 py-2.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-medium">
                  <UserPlus className="w-4 h-4" />Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}