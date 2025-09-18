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
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import CoordinatorChat from '@/components/chat/CoordinatorChat'

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

  const exportReport = (type: string) => {
    // Simular exportação de relatório
    console.log(`Exportando relatório: ${type}`)
    // Aqui seria implementada a lógica real de exportação
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
              <Button onClick={() => exportReport('geral')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
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
                  <CardTitle>Atendimentos por Dia da Semana</CardTitle>
                  <CardDescription>
                    Distribuição de atendimentos vs agendamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.weeklyData.map((day, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-8 text-sm font-medium">{day.day}</div>
                        <div className="flex-1 flex space-x-2">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Realizados</span>
                              <span>{day.atendimentos}</span>
                            </div>
                            <Progress value={(day.atendimentos / 65) * 100} className="h-2" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Agendados</span>
                              <span>{day.agendamentos}</span>
                            </div>
                            <Progress 
                              value={(day.agendamentos / 65) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Público-Alvo */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição do Público-Alvo</CardTitle>
                  <CardDescription>
                    Categorias atendidas pelo NAF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.publicoAlvo.map((categoria, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{categoria.categoria}</span>
                          <div className="text-right">
                            <div className="text-sm font-bold">{categoria.quantidade}</div>
                            <div className="text-xs text-gray-500">{categoria.percentual}%</div>
                          </div>
                        </div>
                        <Progress value={categoria.percentual} className="h-2" />
                      </div>
                    ))}
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
            <Card>
              <CardHeader>
                <CardTitle>Performance dos Serviços</CardTitle>
                <CardDescription>
                  Análise detalhada dos serviços mais demandados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.services.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{service.service_name}</h3>
                            {service.is_featured && (
                              <Badge variant="secondary" className="text-xs">
                                Destaque
                              </Badge>
                            )}
                            {service.service_difficulty && (
                              <Badge variant="outline" className="text-xs">
                                {service.service_difficulty}
                              </Badge>
                            )}
                          </div>
                          {service.service_description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {service.service_description.length > 100
                                ? `${service.service_description.substring(0, 100)}...`
                                : service.service_description}
                            </p>
                          )}
                          {service.service_category && (
                            <Badge variant="outline" className="text-xs mb-2">
                              {service.service_category}
                            </Badge>
                          )}
                        </div>
                        <Badge className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>{service.satisfaction_rating.toFixed(1)}</span>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Solicitações</p>
                          <p className="font-semibold">{service.requests_count}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Concluídos</p>
                          <p className="font-semibold text-green-600">{service.completed_count}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Pendentes</p>
                          <p className="font-semibold text-orange-600">{service.pending_count}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tempo Médio</p>
                          <p className="font-semibold">{service.avg_duration_minutes}min</p>
                        </div>
                        {service.views_count !== undefined && (
                          <div>
                            <p className="text-gray-600">Visualizações</p>
                            <p className="font-semibold text-blue-600">{service.views_count}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <Progress
                          value={service.requests_count > 0 ? (service.completed_count / service.requests_count) * 100 : 0}
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Taxa de conclusão: {service.requests_count > 0 ? ((service.completed_count / service.requests_count) * 100).toFixed(1) : '0.0'}%
                        </p>
                      </div>
                      {service.service_id && (
                        <div className="mt-3 flex justify-end">
                          <Link href={`/services`}>
                            <Button variant="outline" size="sm">
                              Ver Detalhes
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance dos Estudantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.students.map((student, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{student.student_name}</p>
                          <p className="text-sm text-gray-600">{student.course}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{student.total_attendances} atendimentos</p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            {student.avg_rating}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Capacitação e Treinamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800">Próximo Treinamento</h4>
                      <p className="text-sm text-green-600">
                        "Novas regras do e-Social" - 15/11/2024
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        12 estudantes inscritos
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Temas para próximos treinamentos:</h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex justify-between">
                          <span>• Declaração de IR 2025</span>
                          <Badge variant="outline">Planejado</Badge>
                        </li>
                        <li className="flex justify-between">
                          <span>• Mudanças no MEI</span>
                          <Badge variant="outline">Em análise</Badge>
                        </li>
                        <li className="flex justify-between">
                          <span>• LGPD no atendimento</span>
                          <Badge variant="outline">Aprovado</Badge>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Central de Atendimento via Chat
                </CardTitle>
                <CardDescription>
                  Responda às dúvidas dos clientes em tempo real. As mensagens não lidas aparecem com destaque.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CoordinatorChat
                  coordinatorId={user?.id || 'coordinator'}
                  coordinatorName={user?.name || user?.email || 'Coordenador'}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Relatório Mensal',
                  description: 'Consolidado completo do mês',
                  icon: FileText,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-100'
                },
                {
                  title: 'Relatório de Performance',
                  description: 'Métricas de estudantes e serviços',
                  icon: BarChart3,
                  color: 'text-green-600',
                  bgColor: 'bg-green-100'
                },
                {
                  title: 'Relatório Estatístico',
                  description: 'Análise estatística detalhada',
                  icon: PieChart,
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-100'
                },
                {
                  title: 'Relatório de Qualidade',
                  description: 'Avaliações e satisfação',
                  icon: Star,
                  color: 'text-yellow-600',
                  bgColor: 'bg-yellow-100'
                },
                {
                  title: 'Relatório Gerencial',
                  description: 'Visão executiva para gestão',
                  icon: Target,
                  color: 'text-red-600',
                  bgColor: 'bg-red-100'
                },
                {
                  title: 'Relatório de Capacitação',
                  description: 'Treinamentos e desenvolvimento',
                  icon: Users,
                  color: 'text-indigo-600',
                  bgColor: 'bg-indigo-100'
                }
              ].map((report, index) => {
                const IconComponent = report.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${report.bgColor} rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`h-6 w-6 ${report.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{report.title}</h3>
                          <p className="text-sm text-gray-600">{report.description}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => exportReport(report.title)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Gerar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
