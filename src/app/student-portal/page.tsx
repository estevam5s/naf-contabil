'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  FileText,
  MessageCircle,
  Video,
  MapPin,
  Star,
  Download,
  Upload,
  LogOut,
  ArrowLeft,
  GraduationCap,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Calendar,
  Eye,
  Settings,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import NotificationCenter from '@/components/notifications/NotificationCenter'
import SimpleChart from '@/components/charts/SimpleChart'

interface StudentProfile {
  id: string
  name: string
  email: string
  phone: string
  course: string
  semester: string
  registrationNumber: string
  specializations: string[]
  status: string
  document: string
  university: string
  lastLogin?: string
  createdAt?: string
}

interface Attendance {
  id: string
  protocol: string
  client_name: string
  client_email: string
  client_phone: string
  service_type: string
  service_description: string
  scheduled_date: string
  scheduled_time: string
  status: string
  urgency: string
  is_online: boolean
  client_satisfaction_rating?: number
  supervisor_validation: boolean
}

interface TrainingProgress {
  id: string
  training_id: string
  is_completed: boolean
  score?: number
  started_at: string
  completed_at?: string
  training: {
    id: string
    title: string
    description: string
    duration_minutes: number
    difficulty: string
    topics: string[]
    is_mandatory: boolean
  }
}

interface DashboardData {
  profile: StudentProfile
  stats: {
    totalAttendances: number
    completedAttendances: number
    avgRating: number
    completedTrainings: number
    totalTrainings: number
    avgPerformanceScore: number
    successRate: number
  }
  attendances: Attendance[]
  trainings: TrainingProgress[]
  recentEvaluations: StudentEvaluation[]
}

interface StudentEvaluation {
  id: string
  evaluation_date: string
  technical_score: number
  communication_score: number
  punctuality_score: number
  professionalism_score: number
  overall_score: number
  feedback: string
  strengths: string[]
  improvement_areas: string[]
}

interface AnalyticsData {
  clientCategoryStats: any
  serviceTypeStats: any
  monthlyPerformance: any
  trainingsByDifficulty: any
  competencyStats: any
  growthIndicators: any
  totalEvaluations: number
  averageOverallScore: number
}

export default function StudentPortal() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<StudentProfile | null>(null)

  // Verificar autenticação e carregar dados
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('student_token')
      const userData = localStorage.getItem('student_user')

      if (!token || !userData) {
        router.push('/student-login')
        return
      }

      try {
        setUser(JSON.parse(userData))

        // Buscar dados do dashboard
        const response = await fetch('/api/students/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

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

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('student_token')
    localStorage.removeItem('student_user')
    router.push('/student-login')
  }

  const loadAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      const token = localStorage.getItem('student_token')
      const response = await fetch('/api/students/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data.data)
      } else {
        console.error('Erro ao carregar analytics')
      }
    } catch (error) {
      console.error('Erro ao carregar analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const exportReport = async (format: string = 'json') => {
    try {
      const token = localStorage.getItem('student_token')

      // Verificar se o token existe
      if (!token) {
        alert('❌ Sessão expirada. Faça login novamente.')
        handleLogout()
        return
      }

      // Mostrar loading
      const loadingMessage = format === 'excel' ? 'Gerando relatório Excel...' : 'Gerando relatório JSON...'
      console.log(loadingMessage)

      const response = await fetch(`/api/students/reports-mock?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        if (format === 'excel') {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.style.display = 'none'
          a.href = url
          a.download = `relatorio-estudante-${new Date().toISOString().split('T')[0]}.xlsx`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          alert('✅ Relatório Excel baixado com sucesso!')
        } else {
          const data = await response.json()
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.style.display = 'none'
          a.href = url
          a.download = `relatorio-estudante-${new Date().toISOString().split('T')[0]}.json`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          alert('✅ Relatório JSON baixado com sucesso!')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))

        if (response.status === 401) {
          alert('❌ Sessão expirada. Faça login novamente.')
          handleLogout()
        } else {
          throw new Error(errorData.message || `Erro ao gerar relatório: ${response.status}`)
        }
      }
    } catch (error) {
      console.error('Erro ao exportar relatório:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`❌ Erro ao exportar relatório: ${errorMessage}`)
    }
  }

  const updateAttendanceStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('student_token')
      const response = await fetch(`/api/students/attendances/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Recarregar dados
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao atualizar atendimento:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'AGENDADO': { color: 'bg-blue-100 text-blue-800', label: 'Agendado' },
      'EM_ANDAMENTO': { color: 'bg-yellow-100 text-yellow-800', label: 'Em Andamento' },
      'CONCLUIDO': { color: 'bg-green-100 text-green-800', label: 'Concluído' },
      'CANCELADO': { color: 'bg-red-100 text-red-800', label: 'Cancelado' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['AGENDADO']
    return <Badge className={`${config.color} text-xs`}>{config.label}</Badge>
  }

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      'BAIXA': { color: 'bg-green-100 text-green-700', label: 'Baixa' },
      'MEDIA': { color: 'bg-yellow-100 text-yellow-700', label: 'Média' },
      'ALTA': { color: 'bg-red-100 text-red-700', label: 'Alta' }
    }
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig['MEDIA']
    return <Badge variant="outline" className={`${config.color} text-xs`}>{config.label}</Badge>
  }

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyConfig = {
      'BÁSICO': { color: 'bg-green-100 text-green-700', label: 'Básico' },
      'INTERMEDIÁRIO': { color: 'bg-yellow-100 text-yellow-700', label: 'Intermediário' },
      'AVANÇADO': { color: 'bg-red-100 text-red-700', label: 'Avançado' }
    }
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig] || difficultyConfig['BÁSICO']
    return <Badge variant="outline" className={`${config.color} text-xs`}>{config.label}</Badge>
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}min` : ''}`
    }
    return `${mins}min`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando portal...</p>
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

  if (!dashboardData || !user) {
    return null
  }

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
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Portal do Estudante
                </h1>
                <p className="text-sm text-gray-600">
                  Bem-vindo(a), {dashboardData.profile.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter userId={dashboardData.profile.id} userType="student" />

              <Badge className={`${dashboardData.profile.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {dashboardData.profile.status}
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">{dashboardData.profile.course}</p>
                <p className="text-xs text-gray-600">{dashboardData.profile.semester}</p>
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
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="attendances">Atendimentos</TabsTrigger>
            <TabsTrigger value="trainings">Treinamentos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6 space-y-6">
            {/* Estatísticas principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Atendimentos</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalAttendances}</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">Histórico completo</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                      <p className="text-2xl font-bold text-green-600">{dashboardData.stats.successRate}%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {dashboardData.stats.completedAttendances} de {dashboardData.stats.totalAttendances} concluídos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avaliação Clientes</p>
                      <p className="text-2xl font-bold text-yellow-600">{dashboardData.stats.avgRating.toFixed(1)}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="flex mt-1">
                    {[1,2,3,4,5].map(star => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= dashboardData.stats.avgRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Performance Geral</p>
                      <p className="text-2xl font-bold text-purple-600">{dashboardData.stats.avgPerformanceScore.toFixed(1)}</p>
                    </div>
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Avaliações dos supervisores
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Seção de Gráficos de Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Status dos Atendimentos
                  </CardTitle>
                  <CardDescription>Distribuição por status dos seus atendimentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleChart
                    type="pie"
                    data={[
                      {
                        label: 'Concluídos',
                        value: dashboardData.stats.completedAttendances,
                        color: '#10B981'
                      },
                      {
                        label: 'Pendentes',
                        value: dashboardData.stats.totalAttendances - dashboardData.stats.completedAttendances,
                        color: '#F59E0B'
                      }
                    ]}
                    height={200}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    Progresso em Treinamentos
                  </CardTitle>
                  <CardDescription>Seu progresso nos módulos de capacitação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progresso Geral</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {dashboardData.stats.totalTrainings > 0
                          ? Math.round((dashboardData.stats.completedTrainings / dashboardData.stats.totalTrainings) * 100)
                          : 0}%
                      </span>
                    </div>
                    <Progress
                      value={dashboardData.stats.totalTrainings > 0
                        ? (dashboardData.stats.completedTrainings / dashboardData.stats.totalTrainings) * 100
                        : 0}
                      className="h-3"
                    />
                    <div className="text-sm text-gray-600">
                      {dashboardData.stats.completedTrainings} de {dashboardData.stats.totalTrainings} módulos concluídos
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Avaliações Recentes */}
            {dashboardData.recentEvaluations && dashboardData.recentEvaluations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-emerald-600" />
                    Avaliações Recentes
                  </CardTitle>
                  <CardDescription>Feedback dos supervisores sobre seu desempenho</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentEvaluations.slice(0, 3).map((evaluation, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {new Date(evaluation.evaluation_date).toLocaleDateString('pt-BR')}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-bold">{evaluation.overall_score?.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Técnico:</span>
                            <span className="ml-1 font-medium">{evaluation.technical_score}/5</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Comunicação:</span>
                            <span className="ml-1 font-medium">{evaluation.communication_score}/5</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Pontualidade:</span>
                            <span className="ml-1 font-medium">{evaluation.punctuality_score}/5</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Profissionalismo:</span>
                            <span className="ml-1 font-medium">{evaluation.professionalism_score}/5</span>
                          </div>
                        </div>
                        {evaluation.feedback && (
                          <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                            "{evaluation.feedback}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Próximos Atendimentos */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Atendimentos</CardTitle>
                <CardDescription>Seus atendimentos agendados para os próximos dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.attendances
                    .filter(a => ['AGENDADO', 'EM_ANDAMENTO'].includes(a.status))
                    .slice(0, 3)
                    .map((attendance) => (
                      <div key={attendance.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{attendance.client_name}</h4>
                            {getStatusBadge(attendance.status)}
                            {getUrgencyBadge(attendance.urgency)}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{attendance.service_type}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="h-3 w-3" />
                              <span>{new Date(attendance.scheduled_date).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{attendance.scheduled_time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {attendance.is_online ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                              <span>{attendance.is_online ? 'Online' : 'Presencial'}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAttendance(attendance)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    ))}
                  {dashboardData.attendances.filter(a => ['AGENDADO', 'EM_ANDAMENTO'].includes(a.status)).length === 0 && (
                    <p className="text-center text-gray-500 py-4">Nenhum atendimento agendado</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Atendimentos Tab */}
          <TabsContent value="attendances" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Meus Atendimentos</h2>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => exportReport('excel')}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
                <Button variant="outline" onClick={() => exportReport('json')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Relatório Completo
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {dashboardData.attendances.map((attendance) => (
                <Card key={attendance.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{attendance.client_name}</h3>
                        {getStatusBadge(attendance.status)}
                        {getUrgencyBadge(attendance.urgency)}
                        {attendance.is_online && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                            <Video className="h-3 w-3 mr-1" />
                            Online
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAttendance(attendance)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Serviço</p>
                        <p className="text-sm">{attendance.service_type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Data e Horário</p>
                        <div className="flex items-center space-x-2 text-sm">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span>{new Date(attendance.scheduled_date).toLocaleDateString('pt-BR')}</span>
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{attendance.scheduled_time}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Protocolo</p>
                        <p className="text-sm font-mono">{attendance.protocol}</p>
                      </div>
                    </div>

                    {attendance.service_description && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600">Descrição</p>
                        <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{attendance.service_description}</p>
                      </div>
                    )}

                    {attendance.status !== 'CONCLUIDO' && attendance.status !== 'CANCELADO' && (
                      <div className="flex space-x-2 pt-4 border-t">
                        {attendance.status === 'AGENDADO' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateAttendanceStatus(attendance.id, 'EM_ANDAMENTO')}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Iniciar Atendimento
                          </Button>
                        )}
                        {attendance.status === 'EM_ANDAMENTO' && (
                          <Button
                            size="sm"
                            onClick={() => updateAttendanceStatus(attendance.id, 'CONCLUIDO')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Concluir Atendimento
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Treinamentos Tab */}
          <TabsContent value="trainings" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Treinamentos NAF</h2>
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Meu Progresso
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Progresso Geral</h3>
                  <span className="text-2xl font-bold text-emerald-600">
                    {dashboardData.stats.totalTrainings > 0
                      ? Math.round((dashboardData.stats.completedTrainings / dashboardData.stats.totalTrainings) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${dashboardData.stats.totalTrainings > 0
                        ? (dashboardData.stats.completedTrainings / dashboardData.stats.totalTrainings) * 100
                        : 0}%`
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {dashboardData.stats.completedTrainings} de {dashboardData.stats.totalTrainings} módulos concluídos
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData.trainings.map((progress) => (
                <Card key={progress.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{progress.training.title}</h3>
                          {getDifficultyBadge(progress.training.difficulty)}
                          {progress.training.is_mandatory && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              Obrigatório
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{progress.training.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <span>⏱️ {formatTime(progress.training.duration_minutes)}</span>
                          {progress.is_completed && progress.score && (
                            <span>📊 {progress.score}%</span>
                          )}
                        </div>
                      </div>
                      {progress.is_completed && (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">Tópicos Abordados</p>
                      <div className="flex flex-wrap gap-1">
                        {progress.training.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        className="flex-1"
                        variant={progress.is_completed ? "outline" : "default"}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        {progress.is_completed ? 'Revisar' : 'Iniciar'}
                      </Button>
                      {progress.is_completed && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Analytics e Performance</h2>
              <Button
                variant="outline"
                onClick={loadAnalytics}
                disabled={analyticsLoading}
              >
                {analyticsLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
                ) : (
                  <Activity className="h-4 w-4" />
                )}
                <span className="ml-2">
                  {analyticsLoading ? 'Carregando...' : 'Atualizar Dados'}
                </span>
              </Button>
            </div>

            {analyticsData ? (
              <div className="space-y-6">
                {/* Indicadores de Crescimento */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Indicadores de Crescimento
                    </CardTitle>
                    <CardDescription>Sua evolução ao longo do tempo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {analyticsData.growthIndicators.attendanceGrowth > 0 ? '+' : ''}
                          {analyticsData.growthIndicators.attendanceGrowth}
                        </div>
                        <div className="text-sm text-gray-600">Crescimento em Atendimentos</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {analyticsData.growthIndicators.ratingImprovement > 0 ? '+' : ''}
                          {analyticsData.growthIndicators.ratingImprovement.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">Melhoria na Avaliação</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {analyticsData.growthIndicators.trainingProgress.toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-600">Progresso em Treinamentos</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Gráficos de Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Estatísticas por Categoria de Cliente */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Atendimentos por Categoria
                      </CardTitle>
                      <CardDescription>Performance por tipo de cliente</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SimpleChart
                        type="pie"
                        data={Object.entries(analyticsData.clientCategoryStats).map(([category, stats]: [string, any], index) => ({
                          label: category,
                          value: stats.count,
                          color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
                        }))}
                        height={200}
                      />
                    </CardContent>
                  </Card>

                  {/* Estatísticas por Tipo de Serviço */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                        Performance por Serviço
                      </CardTitle>
                      <CardDescription>Taxa de conclusão por tipo de serviço</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SimpleChart
                        type="bar"
                        data={Object.entries(analyticsData.serviceTypeStats).map(([service, stats]: [string, any]) => ({
                          label: service.length > 15 ? service.substring(0, 12) + '...' : service,
                          value: stats.completionRate,
                          color: '#10B981'
                        }))}
                        height={200}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Análise de Competências */}
                {analyticsData.competencyStats && Object.keys(analyticsData.competencyStats).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-purple-600" />
                        Análise de Competências
                      </CardTitle>
                      <CardDescription>Suas habilidades avaliadas pelos supervisores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(analyticsData.competencyStats).map(([competency, data]: [string, any]) => (
                          <div key={competency} className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              {data.avg.toFixed(1)}/5
                            </div>
                            <div className="text-sm font-medium capitalize">{competency}</div>
                            <div className="text-xs text-gray-500">
                              {data.count} avaliações
                            </div>
                            {data.trend !== 0 && (
                              <div className={`text-xs mt-1 ${data.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {data.trend > 0 ? '↗' : '↘'} {Math.abs(data.trend).toFixed(1)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Performance Mensal */}
                {analyticsData.monthlyPerformance && Object.keys(analyticsData.monthlyPerformance).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Performance Mensal
                      </CardTitle>
                      <CardDescription>Evolução dos seus atendimentos ao longo dos meses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SimpleChart
                        type="line"
                        data={Object.entries(analyticsData.monthlyPerformance)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([month, data]: [string, any]) => ({
                            label: month,
                            value: data.completed
                          }))}
                        height={200}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Analytics não carregados
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Clique em "Atualizar Dados" para carregar suas estatísticas detalhadas
                  </p>
                  <Button onClick={loadAnalytics} disabled={analyticsLoading}>
                    {analyticsLoading ? 'Carregando...' : 'Carregar Analytics'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Meu Perfil</h2>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações Pessoais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                    <p className="text-lg">{dashboardData.profile.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg">{dashboardData.profile.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Telefone</label>
                    <p className="text-lg">{dashboardData.profile.phone || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Documento</label>
                    <p className="text-lg">{dashboardData.profile.document || 'Não informado'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Informações Acadêmicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    Informações Acadêmicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Universidade</label>
                    <p className="text-lg">{dashboardData.profile.university || 'Estácio'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Curso</label>
                    <p className="text-lg">{dashboardData.profile.course}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Semestre</label>
                    <p className="text-lg">{dashboardData.profile.semester}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Matrícula</label>
                    <p className="text-lg">{dashboardData.profile.registrationNumber}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Especializações */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    Especializações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dashboardData.profile.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                        {spec}
                      </Badge>
                    ))}
                    {dashboardData.profile.specializations.length === 0 && (
                      <p className="text-gray-500 text-sm">Nenhuma especialização cadastrada</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas do Perfil */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Estatísticas do Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <Badge className={dashboardData.profile.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {dashboardData.profile.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Último Login</span>
                    <span className="text-sm">
                      {dashboardData.profile.lastLogin
                        ? new Date(dashboardData.profile.lastLogin).toLocaleDateString('pt-BR')
                        : 'Nunca'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Membro desde</span>
                    <span className="text-sm">
                      {new Date(dashboardData.profile.createdAt || '').toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de Detalhes do Atendimento */}
      {selectedAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Detalhes do Atendimento</CardTitle>
                  <CardDescription>
                    {selectedAttendance.client_name} - {selectedAttendance.service_type}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAttendance(null)}
                >
                  Fechar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cliente</p>
                  <p className="font-medium">{selectedAttendance.client_name}</p>
                  <div className="text-sm text-gray-600 space-y-1 mt-1">
                    {selectedAttendance.client_email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{selectedAttendance.client_email}</span>
                      </div>
                    )}
                    {selectedAttendance.client_phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{selectedAttendance.client_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Atendimento</p>
                  <p className="font-medium">{selectedAttendance.service_type}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge(selectedAttendance.status)}
                    {getUrgencyBadge(selectedAttendance.urgency)}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Data e Horário</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span>{new Date(selectedAttendance.scheduled_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{selectedAttendance.scheduled_time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {selectedAttendance.is_online ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                    <span>{selectedAttendance.is_online ? 'Online' : 'Presencial'}</span>
                  </div>
                </div>
              </div>

              {selectedAttendance.service_description && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Descrição</p>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedAttendance.service_description}</p>
                </div>
              )}

              <div className="flex space-x-2 pt-4 border-t">
                {selectedAttendance.status === 'AGENDADO' && (
                  <Button onClick={() => {
                    updateAttendanceStatus(selectedAttendance.id, 'EM_ANDAMENTO')
                    setSelectedAttendance(null)
                  }}>
                    <Clock className="h-4 w-4 mr-2" />
                    Iniciar Atendimento
                  </Button>
                )}
                {selectedAttendance.status === 'EM_ANDAMENTO' && (
                  <Button onClick={() => {
                    updateAttendanceStatus(selectedAttendance.id, 'CONCLUIDO')
                    setSelectedAttendance(null)
                  }}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Concluir Atendimento
                  </Button>
                )}
                {selectedAttendance.client_email && (
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contatar Cliente
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}