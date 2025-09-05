'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou senha incorretos')
        return
      }

      // Buscar a sessão para obter o role do usuário
      const session = await getSession()
      
      if (session?.user) {
        // Redirecionar baseado no role
        switch (session.user.role) {
          case 'COORDINATOR':
            router.push('/dashboard')
            break
          case 'TEACHER':
            router.push('/dashboard')
            break
          case 'STUDENT':
            router.push('/dashboard')
            break
          default:
            router.push('/services')
        }
      }
    } catch (error) {
      console.error('Erro no login:', error)
      setError('Erro interno. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithTestAccount = async (testEmail: string, testPassword: string) => {
    setEmail(testEmail)
    setPassword(testPassword)
    
    const result = await signIn('credentials', {
      email: testEmail,
      password: testPassword,
      redirect: false,
    })

    if (!result?.error) {
      const session = await getSession()
      if (session?.user) {
        switch (session.user.role) {
          case 'COORDINATOR':
          case 'TEACHER':
          case 'STUDENT':
            router.push('/dashboard')
            break
          default:
            router.push('/services')
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">NAF</span>
          </div>
          <CardTitle className="text-2xl">Entrar no Sistema</CardTitle>
          <CardDescription>
            Faça login para acessar o NAF
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@example.com"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Senha</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                disabled={isLoading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Contas de Teste - Clique para Entrar</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => loginWithTestAccount('aluno1@naf.teste', '123456')}
                className="bg-blue-50 hover:bg-blue-100 p-3 rounded-md transition-colors text-left"
                disabled={isLoading}
              >
                <div className="font-semibold text-blue-800">👨‍🎓 Aluno</div>
                <div className="text-blue-600">aluno1@naf.teste</div>
                <div className="text-blue-600">123456</div>
              </button>
              
              <button
                onClick={() => loginWithTestAccount('professor1@naf.teste', '123456')}
                className="bg-green-50 hover:bg-green-100 p-3 rounded-md transition-colors text-left"
                disabled={isLoading}
              >
                <div className="font-semibold text-green-800">👩‍🏫 Professor</div>
                <div className="text-green-600">professor1@naf.teste</div>
                <div className="text-green-600">123456</div>
              </button>
              
              <button
                onClick={() => loginWithTestAccount('coordenador@naf.teste', '123456')}
                className="bg-purple-50 hover:bg-purple-100 p-3 rounded-md transition-colors text-left"
                disabled={isLoading}
              >
                <div className="font-semibold text-purple-800">👨‍💼 Coordenador</div>
                <div className="text-purple-600">coordenador@naf.teste</div>
                <div className="text-purple-600">123456</div>
              </button>
              
              <button
                onClick={() => loginWithTestAccount('usuario1@naf.teste', '123456')}
                className="bg-gray-50 hover:bg-gray-100 p-3 rounded-md transition-colors text-left"
                disabled={isLoading}
              >
                <div className="font-semibold text-gray-800">👤 Usuário</div>
                <div className="text-gray-600">usuario1@naf.teste</div>
                <div className="text-gray-600">123456</div>
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Não tem uma conta? </span>
            <Link href="/register" className="text-blue-600 hover:underline">
              Cadastre-se
            </Link>
          </div>
          
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:underline">
              Voltar ao início
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
