import { createClient } from '@supabase/supabase-js'
import { mockSupabaseAdmin } from './mock-supabase'

// Configuração segura - usar mock sempre até configurar Supabase real
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Usar mock sempre por enquanto (até configurar Supabase real)
const USE_MOCK = true

// Log de debug para verificar configuração
console.log('🔧 Supabase config:', {
  hasUrl: !!supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  hasServiceKey: !!supabaseServiceKey,
  useMock: USE_MOCK,
  environment: process.env.NODE_ENV
})

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