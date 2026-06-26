"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://plvuhqriyrhfmnzugtxa.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdnVocXJpeXJoZm1uenVndHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyOTU0NjMsImV4cCI6MjA5Nzg3MTQ2M30.H_wyLodB8gPu8HnJBJhgjdgntAvhMzNLKgEU5_HoxwY"

let client: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (client) return client

  client = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  return client
}