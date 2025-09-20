import { createClient } from '@supabase/supabase-js'
import { mockSupabaseAdmin } from './mock-supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Usar mock se não tiver configuração real ou se estiver em desenvolvimento
const USE_MOCK = !supabaseUrl || !supabaseServiceKey || supabaseServiceKey === supabaseAnonKey || process.env.NODE_ENV === 'development'

export const supabase = USE_MOCK ? mockSupabaseAdmin : createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = USE_MOCK ? mockSupabaseAdmin : createClient(supabaseUrl, supabaseServiceKey)

export interface CoordinatorUser {
  id: string
  email: string
  password: string
  created_at: string
  last_login?: string
  is_active: boolean
}

export interface CoordinatorSession {
  id: string
  user_id: string
  token: string
  expires_at: string
  created_at: string
}