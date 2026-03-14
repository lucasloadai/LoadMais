import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type LeadInsert = {
  nome: string
  whatsapp: string
  ddd: string
  instagram?: string
  instagram_followers?: number
  instagram_verified?: boolean
  lead_score?: number
  lead_tier?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}
