'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, FileText, BarChart3, Database, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function PowerBIReports() {
  const { data: session } = useSession()
  const [reportType, setReportType] = useState('powerbi-dataset')
  const [format, setFormat] = useState('csv')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  // Verificar status da API ao carregar
  useState(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/reports/powerbi?type=general&format=json')
        setApiStatus(response.ok ? 'online' : 'offline')
      } catch {
        setApiStatus('offline')
      }
    }
    checkApiStatus()
  })

  const handleDownload = async () => {
    if (!session?.user || !['COORDINATOR', 'TEACHER'].includes(session.user.role)) {
      alert('Acesso negado')
      return
    }

    setIsGenerating(true)
    
    try {
      const params = new URLSearchParams({
        type: reportType,
        format,
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      })

      const response = await fetch(`/api/reports/powerbi?${params}`)
      
      if (response.ok) {
        if (format === 'csv') {
          // Download direto do CSV
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `relatorio-powerbi-${reportType}-${new Date().toISOString().split('T')[0]}.csv`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        } else {
          // JSON - mostrar dados e opção de download
          const data = await response.json()
          console.log('Dados do relatório:', data)
          
          // Download do JSON
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${data.filename || 'relatorio-powerbi.json'}`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }
        
        alert('Relatório gerado com sucesso!')
      } else {
        const error = await response.json()
        alert(`Erro: ${error.error}`)
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      alert('Erro ao gerar relatório')
    } finally {
      setIsGenerating(false)
    }
  }

  const openPowerBI = () => {
    window.open('https://app.powerbi.com/', '_blank')
  }

  if (!session?.user || !['COORDINATOR', 'TEACHER'].includes(session.user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Acesso Negado</h2>
            <p>Apenas coordenadores e professores podem acessar os relatórios do Power BI.</p>
            <Link href="/dashboard">
              <Button className="mt-4">Voltar ao Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 Relatórios Power BI
              </h1>
              <p className="text-gray-600">
                Gere e exporte dados para análise no Microsoft Power BI
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">← Voltar ao Dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Geração */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Gerar Dataset</span>
              </CardTitle>
              <CardDescription>
                Configure e gere datasets otimizados para Power BI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="reportType">Tipo de Relatório</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="powerbi-dataset">
                      Dataset Otimizado para Power BI
                    </SelectItem>
                    <SelectItem value="general">
                      Relatório Geral Completo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="format">Formato de Exportação</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (Recomendado para Power BI)</SelectItem>
                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Data Inicial</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Data Final</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleDownload} 
                disabled={isGenerating || apiStatus === 'offline'}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {isGenerating ? 'Gerando...' : 'Gerar e Baixar Dataset'}
              </Button>

              {apiStatus === 'offline' && (
                <div className="mt-2 p-2 bg-red-50 rounded text-center">
                  <span className="text-red-600 text-sm">⚠️ API offline - Verifique se o servidor está rodando</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações e Links */}
          <div className="space-y-6">
            {/* Power BI Online */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Microsoft Power BI</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Acesse o Power BI Online para criar dashboards interativos
                </p>
                <Button onClick={openPowerBI} className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir Power BI Online
                </Button>
              </CardContent>
            </Card>

            {/* Instruções Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Guia Rápido (2 min)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800">⚡ Setup Instantâneo</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Gere CSV/XLSX (botão abaixo)</li>
                    <li>2. Abra Power BI Online</li>
                    <li>3. &quot;Obter dados&quot; → &quot;Arquivo&quot;</li>
                    <li>4. Selecione o arquivo baixado</li>
                    <li>5. Crie gráficos!</li>
                  </ol>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold mb-1 text-green-800">📊 Gráficos Sugeridos</h4>
                  <p className="text-sm text-green-700">
                    Pizza (status), Barras (mensal), Top serviços, Horas por usuário
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-semibold mb-1 text-yellow-800">💡 Dica Pro</h4>
                  <p className="text-sm text-yellow-700">
                    CSV: melhor performance | XLSX: múltiplas planilhas
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status do Sistema */}
            <Card>
              <CardHeader>
                <CardTitle>🔋 Status do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">Servidor</span>
                    <span className="text-green-600 text-sm">✅ Online</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">Banco de Dados</span>
                    <span className="text-green-600 text-sm">✅ Conectado</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">API Power BI</span>
                    <span className={`text-sm ${
                      apiStatus === 'online' ? 'text-green-600' : 
                      apiStatus === 'offline' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {apiStatus === 'online' ? '✅ Funcionando' : 
                       apiStatus === 'offline' ? '❌ Offline' : '🔄 Verificando...'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-700 font-medium">
                    🎯 Pronto para gerar relatórios!
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Use o formulário ao lado para baixar dados
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
