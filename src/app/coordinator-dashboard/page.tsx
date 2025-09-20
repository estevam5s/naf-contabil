'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Calendar,
  TrendingUp,
  FileText,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Target,
  ArrowLeft,
  LogOut,
  MessageCircle,
  Award,
  User,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'
import CoordinatorInterface from '@/components/chat/CoordinatorInterface'
import SimpleChart from '@/components/charts/SimpleChart'

interface MetricData {
  period: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
}

interface ServiceMetrics {
  service_name: string
  service_id?: string
  service_description?: string
  service_category?: string
  service_difficulty?: string
  is_featured?: boolean
  requests_count: number
  completed_count: number
  pending_count: number
  avg_duration_minutes: number
  satisfaction_rating: number
  views_count?: number
}

interface StudentData {
  student_name: string
  course: string
  total_attendances: number
  avg_rating: number
}

interface FiscalAppointmentData {
  totalAppointments: number
  pendingAppointments: number
  confirmedAppointments: number
  completedAppointments: number
  urgentAppointments: number
  serviceBreakdown: Record<string, {
    service_type: string
    service_title: string
    total: number
    pending: number
    confirmed: number
    completed: number
    urgent: number
  }>
  recentAppointments: Array<{
    protocol: string
    client_name: string
    service_title: string
    status: string
    urgency_level: string
    created_at: string
  }>
}

interface DashboardData {
  mainMetrics: {
    atendimentosMensais: number
    taxaConclusao: number
    tempoMedio: number
    satisfacao: number
  }
  services: ServiceMetrics[]
  students: StudentData[]
  weeklyData: Array<{
    day: string
    atendimentos: number
    agendamentos: number
  }>
  publicoAlvo: Array<{
    categoria: string
    quantidade: number
    percentual: number
  }>
  fiscalAppointments: FiscalAppointmentData
}

export default function CoordinatorDashboard() {
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('month')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // Carregar dados do dashboard
  useEffect(() => {
    const loadData = async () => {
      try {
        // Configurar usuário mock para demonstração
        setUser({ email: 'coordenador@naf.edu.br', name: 'Coordenador NAF' })

        // Buscar dados do dashboard
        const response = await fetch('/api/coordinator/simple-dashboard')

        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        } else {
          setError('Erro ao carregar dados do dashboard')
        }
      } catch (error) {
        setError('Erro de conexão')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('coordinator_token')
    localStorage.removeItem('coordinator_user')
    router.push('/coordinator-login')
  }

  const getMainMetrics = () => {
    if (!dashboardData) return []

    return [
      {
        title: 'Atendimentos Mensais',
        value: dashboardData.mainMetrics.atendimentosMensais,
        change: 12.5,
        trend: 'up' as const,
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      {
        title: 'Taxa de Conclusão',
        value: dashboardData.mainMetrics.taxaConclusao,
        change: 2.1,
        trend: 'up' as const,
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        suffix: '%'
      },
      {
        title: 'Tempo Médio',
        value: dashboardData.mainMetrics.tempoMedio,
        change: -5.2,
        trend: 'down' as const,
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        suffix: ' min'
      },
      {
        title: 'Satisfação',
        value: dashboardData.mainMetrics.satisfacao,
        change: 0.3,
        trend: 'up' as const,
        icon: Star,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        suffix: '/5'
      }
    ]
  }

  const exportReport = async (type: string, format: string = 'json') => {
    try {
      console.log(`📊 Exporting ${type} report in ${format} format with charts`)

      // Use the advanced reports API for all exports
      const response = await fetch(`/api/reports/advanced?type=${type}&format=${format}`)

      if (!response.ok) {
        throw new Error(`Erro ao gerar relatório: ${response.status}`)
      }

      if (format === 'json') {
        const data = await response.json()
        console.log('Report data with charts:', data)

        // Show enhanced success message with chart information
        const charts = data.charts
        const chartsInfo = charts ? `\nGráficos incluídos: ${Object.keys(charts.pieCharts).length} Pizza, ${Object.keys(charts.barCharts).length} Barras, ${Object.keys(charts.lineCharts).length} Linha` : ''

        alert(`✅ Relatório ${type} gerado com sucesso!${chartsInfo}\nDados e gráficos carregados no dashboard.`)
        return
      }

      // For other formats, trigger download with chart data included
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url

      // Enhanced filename with proper extensions
      const extensions = {
        'pdf': 'pdf',
        'txt': 'txt',
        'doc': 'docx',
        'docx': 'docx',
        'excel': 'xlsx',
        'powerbi': 'json'
      }

      const extension = extensions[format as keyof typeof extensions] || format
      const filename = `relatorio-naf-${type}-${new Date().toISOString().split('T')[0]}.${extension}`
      a.download = filename

      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      console.log(`✅ Report with charts downloaded: ${filename}`)
      alert(`✅ Relatório baixado com sucesso!\nArquivo: ${filename}\nIncluindo todos os gráficos e dados detalhados.`)

    } catch (error) {
      console.error('❌ Error exporting report:', error)
      alert('❌ Erro ao exportar relatório. Verifique sua conexão e tente novamente.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              onClick={() => window.location.reload()}
              className="ml-2"
              size="sm"
            >
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  const mainMetrics = getMainMetrics()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard do Coordenador
                </h1>
                <p className="text-gray-600">
                  Bem-vindo, {user?.email} | Acompanhe métricas e performance do NAF
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Ano</option>
              </select>
              <div className="flex items-center space-x-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  onChange={(e) => {
                    if (e.target.value) {
                      exportReport('general', e.target.value)
                      e.target.value = '' // Reset selection
                    }
                  }}
                  defaultValue=""
                >
                  <option value="">📊 Escolher Formato de Download</option>
                  <option value="json">📋 JSON (Visualizar no Dashboard)</option>
                  <option value="pdf">📄 PDF (Documento com Gráficos)</option>
                  <option value="txt">📝 TXT (Texto Simples)</option>
                  <option value="doc">📄 DOC (Word Document)</option>
                  <option value="docx">📄 DOCX (Word Document)</option>
                  <option value="excel">📈 Excel (Planilha Completa)</option>
                  <option value="powerbi">⚡ Power BI (Dashboard Interativo)</option>
                </select>
                <Button onClick={() => exportReport('general')}>
                  <Download className="h-4 w-4 mr-2" />
                  Gerar
                </Button>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainMetrics.map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.value.toLocaleString('pt-BR')}
                        {metric.suffix || ''}
                      </p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className={`h-4 w-4 ${
                          metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        }`} />
                        <span className={`text-sm ml-1 ${
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="students">Estudantes</TabsTrigger>
            <TabsTrigger value="fiscal">Orient. Fiscais</TabsTrigger>
            <TabsTrigger value="chat">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Atendimentos Semanais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Atendimentos por Dia da Semana
                  </CardTitle>
                  <CardDescription>
                    Análise visual da distribuição semanal de atendimentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleChart
                    type="bar"
                    data={dashboardData.weeklyData.map(day => ({
                      label: day.day,
                      value: day.atendimentos,
                      color: '#3B82F6'
                    }))}
                    height={250}
                    title="Atendimentos Realizados"
                  />

                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Comparativo Detalhado:</h4>
                    <div className="space-y-3">
                      {dashboardData.weeklyData.map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">{day.day}</span>
                            </div>
                            <span className="text-sm font-medium">{day.day === 'Seg' ? 'Segunda' : day.day === 'Ter' ? 'Terça' : day.day === 'Qua' ? 'Quarta' : day.day === 'Qui' ? 'Quinta' : day.day === 'Sex' ? 'Sexta' : day.day === 'Sáb' ? 'Sábado' : 'Domingo'}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-blue-600">{day.atendimentos}</div>
                            <div className="text-xs text-gray-500">{day.agendamentos} agendados</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Público-Alvo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    Distribuição do Público-Alvo
                  </CardTitle>
                  <CardDescription>
                    Segmentação visual das categorias atendidas pelo NAF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleChart
                    type="pie"
                    data={dashboardData.publicoAlvo.map((categoria, index) => ({
                      label: categoria.categoria,
                      value: categoria.quantidade,
                      color: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'][index % 4]
                    }))}
                    height={200}
                  />

                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Estatísticas Detalhadas:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {dashboardData.publicoAlvo.map((categoria, index) => (
                        <div key={index} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{categoria.categoria}</span>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'][index % 4] }}
                            />
                          </div>
                          <div className="text-lg font-bold text-gray-800">{categoria.quantidade}</div>
                          <div className="text-xs text-gray-600">{categoria.percentual}% do total</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertas e Notificações */}
            <Card>
              <CardHeader>
                <CardTitle>Alertas e Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Meta de atendimentos próxima do limite
                      </p>
                      <p className="text-xs text-yellow-600">
                        87% da meta mensal já atingida. Considere ampliar capacidade.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Novo relatório mensal disponível
                      </p>
                      <p className="text-xs text-blue-600">
                        Relatório de performance de outubro já pode ser exportado.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            {/* Performance Overview with Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Performance dos Serviços
                  </CardTitle>
                  <CardDescription>
                    Análise visual das solicitações por serviço
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleChart
                    type="bar"
                    data={dashboardData.services.map(service => ({
                      label: service.service_name.split(' ')[0], // First word for shorter labels
                      value: service.requests_count,
                      color: '#10B981'
                    }))}
                    height={200}
                    title="Solicitações por Serviço"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-600" />
                    Taxa de Conclusão
                  </CardTitle>
                  <CardDescription>
                    Distribuição de status dos atendimentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleChart
                    type="pie"
                    data={[
                      {
                        label: 'Concluídos',
                        value: dashboardData.services.reduce((total, service) => total + service.completed_count, 0),
                        color: '#10B981'
                      },
                      {
                        label: 'Pendentes',
                        value: dashboardData.services.reduce((total, service) => total + service.pending_count, 0),
                        color: '#F59E0B'
                      },
                      {
                        label: 'Em Andamento',
                        value: dashboardData.services.reduce((total, service) => total + (service.requests_count - service.completed_count - service.pending_count), 0),
                        color: '#3B82F6'
                      }
                    ]}
                    height={200}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Detailed Service Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Análise Detalhada dos Serviços</CardTitle>
                <CardDescription>
                  Métricas completas e indicadores de performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dashboardData.services.map((service, index) => (
                    <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                              #{index + 1}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{service.service_name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                {service.is_featured && (
                                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                    ⭐ Destaque
                                  </Badge>
                                )}
                                {service.service_difficulty && (
                                  <Badge variant="outline" className="text-xs">
                                    {service.service_difficulty}
                                  </Badge>
                                )}
                                {service.service_category && (
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                    {service.service_category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {service.service_description && (
                            <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg">
                              {service.service_description.length > 150
                                ? `${service.service_description.substring(0, 150)}...`
                                : service.service_description}
                            </p>
                          )}
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-lg font-bold text-yellow-600">{service.satisfaction_rating.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-gray-500">Satisfação</p>
                        </div>
                      </div>

                      {/* Professional Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{service.requests_count}</p>
                          <p className="text-xs text-blue-600 font-medium">Solicitações</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{service.completed_count}</p>
                          <p className="text-xs text-green-600 font-medium">Concluídos</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">{service.pending_count}</p>
                          <p className="text-xs text-orange-600 font-medium">Pendentes</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{service.avg_duration_minutes}</p>
                          <p className="text-xs text-purple-600 font-medium">Min/Atend.</p>
                        </div>
                        {service.views_count !== undefined && (
                          <div className="text-center p-3 bg-indigo-50 rounded-lg">
                            <p className="text-2xl font-bold text-indigo-600">{service.views_count}</p>
                            <p className="text-xs text-indigo-600 font-medium">Visualizações</p>
                          </div>
                        )}
                      </div>

                      {/* Progress Visualization */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-600">Taxa de Conclusão</span>
                          <span className="text-sm font-bold text-green-600">
                            {service.requests_count > 0 ? ((service.completed_count / service.requests_count) * 100).toFixed(1) : '0.0'}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${service.requests_count > 0 ? (service.completed_count / service.requests_count) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center pt-3 border-t">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Analytics
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Exportar
                          </Button>
                        </div>
                        {service.service_id && (
                          <Link href={`/services`}>
                            <Button size="sm">
                              Ver Detalhes Completos
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            {/* Enhanced Student Management with Portal Integration */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              {/* Student Overview Cards */}
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Portal Integrado dos Estudantes
                  </CardTitle>
                  <CardDescription>
                    Visão completa do painel dos estudantes integrada ao dashboard do coordenador
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">Atendimentos Ativos</span>
                      </div>
                      <p className="text-2xl font-bold text-emerald-700">
                        {dashboardData.students.reduce((total, student) => total + student.total_attendances, 0)}
                      </p>
                      <p className="text-xs text-emerald-600">Total pelos estudantes</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Avaliação Média</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        {dashboardData.students.length > 0
                          ? (dashboardData.students.reduce((total, student) => total + student.avg_rating, 0) / dashboardData.students.length).toFixed(1)
                          : '0.0'}
                      </p>
                      <p className="text-xs text-blue-600">Satisfação dos clientes</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">Estudantes Ativos</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-700">{dashboardData.students.length}</p>
                      <p className="text-xs text-purple-600">Realizando atendimentos</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Produtividade</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-700">92%</p>
                      <p className="text-xs text-orange-600">Taxa de eficiência</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance dos Estudantes */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Performance dos Estudantes</span>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Lista
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Ranking de performance e estatísticas detalhadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.students
                      .sort((a, b) => b.avg_rating - a.avg_rating)
                      .map((student, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                              #{index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{student.student_name}</p>
                              <p className="text-sm text-gray-600">{student.course}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-emerald-600">{student.total_attendances}</p>
                            <p className="text-xs text-gray-500">atendimentos</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="flex items-center justify-center mb-1">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="font-medium">{student.avg_rating.toFixed(1)}</span>
                            </div>
                            <p className="text-xs text-gray-600">Avaliação</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-medium text-blue-600 mb-1">85%</div>
                            <p className="text-xs text-gray-600">Taxa Conclusão</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-medium text-green-600 mb-1">Ativo</div>
                            <p className="text-xs text-gray-600">Status</p>
                          </div>
                        </div>

                        <div className="mt-3 flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <User className="h-3 w-3 mr-1" />
                            Ver Perfil
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Contatar
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Relatórios
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Capacitação e Treinamento */}
              <Card>
                <CardHeader>
                  <CardTitle>Sistema de Capacitação</CardTitle>
                  <CardDescription>
                    Treinamentos e desenvolvimento dos estudantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium text-green-800">Próximo Treinamento</h4>
                      </div>
                      <p className="text-sm text-green-700 font-medium">
                        "Novas regras do e-Social"
                      </p>
                      <p className="text-sm text-green-600">
                        📅 15/11/2024 às 14h00
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        👥 12 estudantes inscritos
                      </p>
                      <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700">
                        <Users className="h-3 w-3 mr-1" />
                        Gerenciar Inscrições
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Pipeline de Treinamentos:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <span className="text-sm">• Declaração de IR 2025</span>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Planejado</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                          <span className="text-sm">• Mudanças no MEI</span>
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Em análise</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm">• LGPD no atendimento</span>
                          <Badge className="bg-green-100 text-green-800 text-xs">Aprovado</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <Button variant="outline" className="w-full" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Criar Novo Treinamento
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Portal Integration Features */}
            <Card>
              <CardHeader>
                <CardTitle>Funcionalidades do Portal do Estudante</CardTitle>
                <CardDescription>
                  Acesso direto às principais funcionalidades disponíveis aos estudantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Target className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Dashboard</h3>
                        <p className="text-sm text-gray-600">Visão geral</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Estatísticas principais, próximos atendimentos e progresso
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Visualizar
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Atendimentos</h3>
                        <p className="text-sm text-gray-600">Gestão completa</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Agendamentos, histórico, status e avaliações
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Clock className="h-3 w-3 mr-1" />
                      Gerenciar
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Treinamentos</h3>
                        <p className="text-sm text-gray-600">Capacitação</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Módulos, progresso, certificações e avaliações
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Acompanhar
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Relatórios</h3>
                        <p className="text-sm text-gray-600">Performance</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Exportações, métricas pessoais e análises
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="h-3 w-3 mr-1" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fiscal" className="space-y-6">
            {/* Métricas dos Agendamentos Fiscais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Agendamentos</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {dashboardData.fiscalAppointments?.totalAppointments || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pendentes</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {dashboardData.fiscalAppointments?.pendingAppointments || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Confirmados</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {dashboardData.fiscalAppointments?.confirmedAppointments || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Urgentes</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {dashboardData.fiscalAppointments?.urgentAppointments || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Serviços Mais Solicitados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Serviços Mais Solicitados
                  </CardTitle>
                  <CardDescription>
                    Distribuição dos agendamentos por tipo de orientação fiscal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.fiscalAppointments?.serviceBreakdown &&
                      Object.values(dashboardData.fiscalAppointments.serviceBreakdown)
                        .sort((a, b) => b.total - a.total)
                        .slice(0, 6)
                        .map((service, index) => {
                          const percentage = dashboardData.fiscalAppointments?.totalAppointments
                            ? (service.total / dashboardData.fiscalAppointments.totalAppointments) * 100
                            : 0

                          return (
                            <div key={service.service_type} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-900">{service.service_title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {service.total} total
                                    </Badge>
                                    {service.urgent > 0 && (
                                      <Badge variant="destructive" className="text-xs">
                                        {service.urgent} urgente
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <span className="text-sm font-medium text-gray-600">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          )
                        })}
                  </div>
                </CardContent>
              </Card>

              {/* Agendamentos Recentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Agendamentos Recentes
                  </CardTitle>
                  <CardDescription>
                    Últimas solicitações de orientação fiscal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.fiscalAppointments?.recentAppointments?.map((appointment, index) => {
                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case 'PENDENTE': return 'bg-yellow-100 text-yellow-800'
                          case 'CONFIRMADO': return 'bg-blue-100 text-blue-800'
                          case 'CONCLUIDO': return 'bg-green-100 text-green-800'
                          case 'CANCELADO': return 'bg-red-100 text-red-800'
                          default: return 'bg-gray-100 text-gray-800'
                        }
                      }

                      const getUrgencyColor = (urgency: string) => {
                        switch (urgency) {
                          case 'URGENTE': return 'bg-red-100 text-red-800'
                          case 'ALTA': return 'bg-orange-100 text-orange-800'
                          case 'NORMAL': return 'bg-blue-100 text-blue-800'
                          case 'BAIXA': return 'bg-gray-100 text-gray-800'
                          default: return 'bg-gray-100 text-gray-800'
                        }
                      }

                      return (
                        <div key={appointment.protocol} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {appointment.client_name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {appointment.service_title}
                              </p>
                              <p className="text-xs text-gray-500 font-mono">
                                {appointment.protocol}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                              <Badge className={getUrgencyColor(appointment.urgency_level)}>
                                {appointment.urgency_level}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(appointment.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="min-h-[700px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Central de Atendimento via Chat
                </CardTitle>
                <CardDescription>
                  À esquerda: solicitações pendentes para aprovar. À direita: chat ativo com o cliente.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <CoordinatorInterface
                  coordinatorId={user?.id || 'coordinator'}
                  coordinatorName={user?.name || user?.email || 'Coordenador'}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Enhanced Report Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Central de Relatórios Avançados
                  </CardTitle>
                  <CardDescription>
                    Sistema completo de geração de relatórios com integração Supabase e Power BI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Dados em Tempo Real</span>
                      </div>
                      <p className="text-xs text-blue-600">Conectado ao Supabase</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Download className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">5 Formatos</span>
                      </div>
                      <p className="text-xs text-green-600">JSON, CSV, PDF, Excel, Power BI</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <PieChart className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">Gráficos Profissionais</span>
                      </div>
                      <p className="text-xs text-purple-600">Visualizações avançadas</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Insights IA</span>
                      </div>
                      <p className="text-xs text-orange-600">Análises automáticas</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Relatório Geral',
                        type: 'general',
                        description: 'Visão completa de todas as atividades e métricas do NAF',
                        icon: FileText,
                        color: 'text-blue-600',
                        bgColor: 'bg-blue-100',
                        metrics: ['Total de atendimentos', 'Estudantes ativos', 'Taxa de satisfação', 'Crescimento mensal']
                      },
                      {
                        title: 'Performance',
                        type: 'performance',
                        description: 'Análise detalhada do desempenho de estudantes e serviços',
                        icon: BarChart3,
                        color: 'text-green-600',
                        bgColor: 'bg-green-100',
                        metrics: ['Produtividade', 'Eficiência', 'Qualidade', 'Melhoria contínua']
                      },
                      {
                        title: 'Estudantes',
                        type: 'students',
                        description: 'Estatísticas e métricas específicas dos estudantes',
                        icon: Users,
                        color: 'text-purple-600',
                        bgColor: 'bg-purple-100',
                        metrics: ['Engajamento', 'Participação', 'Desenvolvimento', 'Capacitação']
                      },
                      {
                        title: 'Serviços',
                        type: 'services',
                        description: 'Performance e utilização dos serviços oferecidos',
                        icon: Star,
                        color: 'text-yellow-600',
                        bgColor: 'bg-yellow-100',
                        metrics: ['Demanda', 'Conclusão', 'Tempo médio', 'Satisfação']
                      },
                      {
                        title: 'Satisfação',
                        type: 'satisfaction',
                        description: 'Avaliação da satisfação e qualidade do atendimento',
                        icon: Star,
                        color: 'text-pink-600',
                        bgColor: 'bg-pink-100',
                        metrics: ['NPS', 'Avaliações', 'Feedback', 'Melhorias']
                      },
                      {
                        title: 'Power BI Dashboard',
                        type: 'powerbi',
                        description: 'Dashboard interativo para análise executiva',
                        icon: PieChart,
                        color: 'text-indigo-600',
                        bgColor: 'bg-indigo-100',
                        metrics: ['Dashboards', 'KPIs', 'Tendências', 'Projeções']
                      }
                    ].map((report, index) => {
                      const IconComponent = report.icon
                      return (
                        <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className={`w-12 h-12 ${report.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <IconComponent className={`h-6 w-6 ${report.color}`} />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium group-hover:text-blue-600 transition-colors">{report.title}</h3>
                                <p className="text-sm text-gray-600">{report.description}</p>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4">
                              <h4 className="text-xs font-medium text-gray-500 uppercase">Métricas Incluídas:</h4>
                              <div className="flex flex-wrap gap-1">
                                {report.metrics.map((metric, i) => (
                                  <span key={i} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                                    {metric}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                size="sm"
                                onClick={() => exportReport(report.type, 'json')}
                                variant="outline"
                                className="text-xs"
                              >
                                <BarChart3 className="h-3 w-3 mr-1" />
                                Visualizar
                              </Button>
                              <select
                                className="px-2 py-1 border border-gray-300 rounded text-xs"
                                onChange={(e) => {
                                  if (e.target.value) {
                                    exportReport(report.type, e.target.value)
                                    e.target.value = ''
                                  }
                                }}
                                defaultValue=""
                              >
                                <option value="">📊 Formato</option>
                                <option value="pdf">📄 PDF</option>
                                <option value="txt">📝 TXT</option>
                                <option value="doc">📄 DOC</option>
                                <option value="docx">📄 DOCX</option>
                                <option value="excel">📈 Excel</option>
                                <option value="powerbi">⚡ Power BI</option>
                              </select>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Export Section */}
            <Card>
              <CardHeader>
                <CardTitle>Exportação Rápida</CardTitle>
                <CardDescription>
                  Gere relatórios personalizados em poucos cliques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Relatório:</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="general">Relatório Geral</option>
                      <option value="performance">Performance</option>
                      <option value="students">Estudantes</option>
                      <option value="services">Serviços</option>
                      <option value="satisfaction">Satisfação</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Período:</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="7">Últimos 7 dias</option>
                      <option value="30">Últimos 30 dias</option>
                      <option value="90">Últimos 3 meses</option>
                      <option value="365">Último ano</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Formato:</label>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        CSV
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
