export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "BUYER" | "SELLER" | "BOTH"
  avatar?: string
  rating: number
}

export interface Demand {
  id: string
  title: string
  description?: string
  category: Category
  criteria: Record<string, any>
  budgetMin?: number
  budgetMax?: number
  currency: string
  city: string
  region?: string
  condition: string
  status: string
  expiresAt: string
  user: User
  offers: Offer[]
  createdAt: string
}

export interface Category {
  id: string
  name: string
  nameAr?: string
  slug: string
  icon?: string
  description?: string
}

export interface Offer {
  id: string
  price: number
  description?: string
  images: string[]
  status: string
  seller: User
  demand: Demand
  messages: Message[]
  createdAt: string
}

export interface Message {
  id: string
  content: string
  sender: User
  receiver: User
  isRead: boolean
  createdAt: string
}

export interface Alert {
  id: string
  category: Category
  keywords: string[]
  city?: string
  region?: string
  budgetMin?: number
  budgetMax?: number
  isActive: boolean
}