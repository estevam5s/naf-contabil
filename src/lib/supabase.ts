import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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