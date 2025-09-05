import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TestResult {
  endpoint: string
  method: string
  status: 'success' | 'error' | 'pending'
  message: string
  data?: any
}

export function SystemTest() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)
  const [testEmail, setTestEmail] = useState('teste@gmail.com')

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result])
  }

  const clearResults = () => {
    setResults([])
  }

  const testAPI = async (endpoint: string, method = 'GET', body?: any) => {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(endpoint, options)
      const data = await response.json()

      return {
        endpoint,
        method,
        status: response.ok ? 'success' as const : 'error' as const,
        message: response.ok ? 'Sucesso' : data.error || 'Erro desconhecido',
        data: response.ok ? data : null
      }
    } catch (error) {
      return {
        endpoint,
        method,
        status: 'error' as const,
        message: error instanceof Error ? error.message : 'Erro de rede',
        data: null
      }
    }
  }

  const runAllTests = async () => {
    setTesting(true)
    clearResults()

    const tests = [
      // Teste de serviços
      {
        name: 'Listar Serviços',
        test: () => testAPI('/api/services')
      },
      
      // Teste de demandas
      {
        name: 'Listar Demandas',
        test: () => testAPI('/api/demands')
      },
      
      // Teste de atendimentos
      {
        name: 'Listar Atendimentos',
        test: () => testAPI('/api/attendances')
      },
      
      // Teste de estatísticas do dashboard
      {
        name: 'Estatísticas Dashboard',
        test: () => testAPI('/api/dashboard/stats')
      },
      
      // Teste de orientações
      {
        name: 'Obter Orientações',
        test: () => testAPI('/api/guidance?serviceId=cpf')
      },
      
      // Teste de relatórios
      {
        name: 'Relatório Geral',
        test: () => testAPI('/api/reports?type=general')
      },
      
      {
        name: 'Relatório de Atendimentos',
        test: () => testAPI('/api/reports?type=attendances')
      },
      
      {
        name: 'Relatório de Demandas',
        test: () => testAPI('/api/reports?type=demands')
      },
      
      {
        name: 'Relatório de Serviços',
        test: () => testAPI('/api/reports?type=services')
      },
      
      // Teste de configuração de email
      {
        name: 'Teste Configuração Email',
        test: () => testAPI('/api/email')
      },
      
      // Teste de envio de email personalizado
      {
        name: 'Envio Email Personalizado',
        test: () => testAPI('/api/email', 'POST', {
          type: 'custom',
          data: {
            to: testEmail,
            subject: 'Teste Sistema NAF',
            html: '<h2>🧪 Teste de Integração</h2><p>Este é um teste do sistema de email do NAF!</p>'
          }
        })
      }
    ]

    for (const test of tests) {
      try {
        addResult({
          endpoint: test.name,
          method: 'TESTING',
          status: 'pending',
          message: 'Executando...'
        })

        const result = await test.test()
        
        // Atualizar o último resultado
        setResults(prev => {
          const newResults = [...prev]
          newResults[newResults.length - 1] = result
          return newResults
        })

        // Aguardar um pouco entre testes
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        addResult({
          endpoint: test.name,
          method: 'ERROR',
          status: 'error',
          message: error instanceof Error ? error.message : 'Erro inesperado'
        })
      }
    }

    setTesting(false)
  }

  const testSpecificIntegration = async (type: string) => {
    try {
      let result: TestResult

      switch (type) {
        case 'guidance':
          result = await testAPI('/api/guidance?serviceId=cpf-cadastro')
          break
        case 'email-welcome':
          result = await testAPI('/api/email', 'POST', {
            type: 'welcome',
            data: { userId: 'test-user-id' }
          })
          break
        case 'reports-pdf':
          result = await testAPI('/api/reports?type=general&format=pdf')
          break
        default:
          result = {
            endpoint: type,
            method: 'TEST',
            status: 'error',
            message: 'Tipo de teste não reconhecido'
          }
      }

      addResult(result)
    } catch (error) {
      addResult({
        endpoint: type,
        method: 'TEST',
        status: 'error',
        message: error instanceof Error ? error.message : 'Erro inesperado'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'pending': return 'text-yellow-600'
      default: return 'text-gray-600'
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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Sistema de Testes de Integração NAF</CardTitle>
          <CardDescription>
            Teste todas as funcionalidades e integrações do sistema NAF
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Email para teste (ex: teste@gmail.com)"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={runAllTests} 
                disabled={testing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {testing ? '⏳ Testando...' : '🚀 Executar Todos os Testes'}
              </Button>
              
              <Button 
                onClick={() => testSpecificIntegration('guidance')}
                variant="outline"
              >
                🧭 Testar Orientações
              </Button>
              
              <Button 
                onClick={() => testSpecificIntegration('email-welcome')}
                variant="outline"
              >
                📧 Testar Email
              </Button>
              
              <Button 
                onClick={() => testSpecificIntegration('reports-pdf')}
                variant="outline"
              >
                📊 Testar Relatórios
              </Button>
              
              <Button 
                onClick={clearResults}
                variant="outline"
              >
                🗑️ Limpar Resultados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📋 Resultados dos Testes</CardTitle>
            <CardDescription>
              {results.filter(r => r.status === 'success').length} sucessos, {' '}
              {results.filter(r => r.status === 'error').length} erros, {' '}
              {results.filter(r => r.status === 'pending').length} pendentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {getStatusIcon(result.status)}
                    </span>
                    <div>
                      <div className="font-medium">{result.endpoint}</div>
                      <div className={`text-sm ${getStatusColor(result.status)}`}>
                        {result.method} - {result.message}
                      </div>
                    </div>
                  </div>
                  
                  {result.data && (
                    <details className="max-w-md">
                      <summary className="cursor-pointer text-sm text-blue-600">
                        Ver dados
                      </summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-32">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>📊 Status das Funcionalidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">🔐 Autenticação</h3>
              <p className="text-sm text-gray-600">
                Sistema de login com NextAuth.js implementado
              </p>
              <span className="text-green-600">✅ Funcionando</span>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">🗄️ APIs</h3>
              <p className="text-sm text-gray-600">
                APIs para serviços, demandas, atendimentos e dashboard
              </p>
              <span className="text-green-600">✅ Implementado</span>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">🧭 Sistema de Orientações</h3>
              <p className="text-sm text-gray-600">
                Orientações passo-a-passo para serviços NAF
              </p>
              <span className="text-green-600">✅ Implementado</span>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">📧 Email Automático</h3>
              <p className="text-sm text-gray-600">
                Envio automático de emails de confirmação e notificação
              </p>
              <span className="text-green-600">✅ Implementado</span>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">📊 Relatórios</h3>
              <p className="text-sm text-gray-600">
                Sistema completo de relatórios com estatísticas
              </p>
              <span className="text-green-600">✅ Implementado</span>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">💬 Chat/Suporte</h3>
              <p className="text-sm text-gray-600">
                Sistema de chat integrado para suporte
              </p>
              <span className="text-blue-600">🔄 Disponível</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SystemTest
