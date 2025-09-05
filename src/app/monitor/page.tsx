'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  timestamp?: string
  data?: any
}

interface SystemHealth {
  server: boolean
  database: boolean
  apis: number
  lastCheck: string
}

export default function SystemMonitor() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [health, setHealth] = useState<SystemHealth>({
    server: false,
    database: false,
    apis: 0,
    lastCheck: 'Nunca'
  })

  const resetTests = () => {
    const initialTests: TestResult[] = [
      { name: 'Conexão com Servidor', status: 'pending', message: 'Verificando...' },
      { name: 'API de Serviços', status: 'pending', message: 'Verificando...' },
      { name: 'API de Demandas', status: 'pending', message: 'Verificando...' },
      { name: 'API de Atendimentos', status: 'pending', message: 'Verificando...' },
      { name: 'API de Orientações', status: 'pending', message: 'Verificando...' },
      { name: 'API de Email', status: 'pending', message: 'Verificando...' },
      { name: 'API de Relatórios', status: 'pending', message: 'Verificando...' },
      { name: 'Sistema de Autenticação', status: 'pending', message: 'Verificando...' },
      { name: 'Dashboard Stats', status: 'pending', message: 'Verificando...' }
    ]
    setTests(initialTests)
  }

  const updateTest = (index: number, status: 'success' | 'error', message: string, data?: any) => {
    setTests(prev => prev.map((test, i) => 
      i === index 
        ? { ...test, status, message, timestamp: new Date().toLocaleTimeString('pt-BR'), data }
        : test
    ))
  }

  const runTests = useCallback(async () => {
    setIsRunning(true)
    resetTests()

    const baseUrl = 'http://localhost:5000'
    let successfulAPIs = 0

    // Teste 1: Conexão com servidor
    try {
      const response = await fetch(`${baseUrl}/api/auth/session`)
      if (response.ok) {
        updateTest(0, 'success', 'Servidor respondendo')
        setHealth(prev => ({ ...prev, server: true }))
      } else {
        updateTest(0, 'error', `Servidor com problemas: ${response.status}`)
      }
    } catch (error) {
      updateTest(0, 'error', 'Servidor não responde')
    }

    // Teste 2: API de Serviços
    try {
      const response = await fetch(`${baseUrl}/api/services`)
      if (response.ok) {
        const data = await response.json()
        updateTest(1, 'success', `${data.length} serviços encontrados`, data)
        successfulAPIs++
      } else {
        updateTest(1, 'error', `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      updateTest(1, 'error', 'Falha na conexão')
    }

    // Teste 3: API de Demandas
    try {
      const response = await fetch(`${baseUrl}/api/demands`)
      if (response.ok) {
        const data = await response.json()
        updateTest(2, 'success', `${data.length} demandas encontradas`, data)
        successfulAPIs++
      } else {
        updateTest(2, 'error', `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      updateTest(2, 'error', 'Falha na conexão')
    }

    // Teste 4: API de Atendimentos
    try {
      const response = await fetch(`${baseUrl}/api/attendances`)
      if (response.ok) {
        const data = await response.json()
        updateTest(3, 'success', `${data.length} atendimentos encontrados`, data)
        successfulAPIs++
      } else {
        updateTest(3, 'error', `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      updateTest(3, 'error', 'Falha na conexão')
    }

    // Teste 5: API de Orientações
    try {
      const response = await fetch(`${baseUrl}/api/guidance?serviceId=cpf-cadastro`)
      if (response.ok) {
        const data = await response.json()
        updateTest(4, 'success', 'Orientações funcionando', data)
        successfulAPIs++
      } else {
        updateTest(4, 'error', `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      updateTest(4, 'error', 'Falha na conexão')
    }

    // Teste 6: API de Email
    try {
      const response = await fetch(`${baseUrl}/api/email`)
      if (response.ok) {
        const data = await response.json()
        updateTest(5, 'success', 'Sistema de email configurado', data)
        successfulAPIs++
      } else {
        updateTest(5, 'error', `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      updateTest(5, 'error', 'Falha na conexão')
    }

    // Teste 7: API de Relatórios
    try {
      const response = await fetch(`${baseUrl}/api/reports?type=general`)
      if (response.ok) {
        const data = await response.json()
        updateTest(6, 'success', 'Relatórios funcionando', data)
        successfulAPIs++
      } else {
        updateTest(6, 'error', `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      updateTest(6, 'error', 'Falha na conexão')
    }

    // Teste 8: Sistema de Autenticação
    try {
      const response = await fetch(`${baseUrl}/api/auth/session`)
      if (response.ok) {
        const data = await response.json()
        updateTest(7, 'success', 'NextAuth funcionando', data)
        successfulAPIs++
      } else {
        updateTest(7, 'error', `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      updateTest(7, 'error', 'Falha na conexão')
    }

    // Teste 9: Dashboard Stats
    try {
      const response = await fetch(`${baseUrl}/api/dashboard/stats`)
      if (response.ok) {
        const data = await response.json()
        updateTest(8, 'success', 'Dashboard stats funcionando', data)
        successfulAPIs++
      } else {
        updateTest(8, 'error', `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      updateTest(8, 'error', 'Falha na conexão')
    }

    // Atualizar saúde do sistema
    setHealth(prev => ({
      ...prev,
      apis: successfulAPIs,
      database: successfulAPIs > 0,
      lastCheck: new Date().toLocaleTimeString('pt-BR')
    }))

    setIsRunning(false)
  }, [])

  // Auto-verificação a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRunning) {
        runTests()
      }
    }, 30000)

    // Executar imediatamente
    runTests()

    return () => clearInterval(interval)
  }, [runTests])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'error': return 'text-red-600 bg-red-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'pending': return '⏳'
      default: return '❓'
    }
  }

  const successCount = tests.filter(t => t.status === 'success').length
  const errorCount = tests.filter(t => t.status === 'error').length
  const pendingCount = tests.filter(t => t.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🖥️ Monitor do Sistema NAF
          </h1>
          <p className="text-gray-600">
            Monitoramento em tempo real de todas as funcionalidades
          </p>
        </div>

        {/* Status Geral */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Servidor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {health.server ? '🟢' : '🔴'}
                </span>
                <span className="font-bold">
                  {health.server ? 'Online' : 'Offline'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">APIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌐</span>
                <span className="font-bold">
                  {health.apis}/9 OK
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Banco</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {health.database ? '🗄️' : '💥'}
                </span>
                <span className="font-bold">
                  {health.database ? 'Conectado' : 'Erro'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Última Verificação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⏰</span>
                <span className="font-bold text-sm">
                  {health.lastCheck}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo dos Testes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Resumo dos Testes
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="ml-4"
              >
                {isRunning ? '🔄 Testando...' : '🚀 Executar Testes'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-green-600">Sucessos</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-red-600">Erros</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                <div className="text-sm text-yellow-600">Pendentes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Testes */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes dos Testes</CardTitle>
            <CardDescription>
              Status detalhado de cada componente do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tests.map((test, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">
                        {getStatusIcon(test.status)}
                      </span>
                      <div>
                        <div className="font-medium">{test.name}</div>
                        <div className="text-sm opacity-80">{test.message}</div>
                      </div>
                    </div>
                    {test.timestamp && (
                      <div className="text-xs opacity-60">
                        {test.timestamp}
                      </div>
                    )}
                  </div>
                  
                  {test.data && test.status === 'success' && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer opacity-80">
                        Ver detalhes da resposta
                      </summary>
                      <pre className="text-xs bg-white/50 p-2 rounded mt-1 overflow-auto max-h-32">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Links Rápidos */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>🔗 Links Rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/dashboard" className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-gray-50">
                <span className="text-2xl">🏠</span>
                <span>Dashboard</span>
              </a>
              
              <a href="/services" className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-gray-50">
                <span className="text-2xl">🛠️</span>
                <span>Serviços</span>
              </a>
              
              <a href="/api/guidance?serviceId=cpf-cadastro" className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-gray-50">
                <span className="text-2xl">🧭</span>
                <span>Orientações</span>
              </a>
              
              <a href="/api/reports?type=general" className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-gray-50">
                <span className="text-2xl">📊</span>
                <span>Relatórios</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
