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
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building2,
  LogOut,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Filter,
  Search
} from 'lucide-react'
import Link from 'next/link'

interface AppointmentData {
  id: string
  protocol: string
  client_name: string
  client_email: string
  client_phone: string
  service_type: string
  service_title: string
  status: string
  urgency_level: string
  preferred_date: string
  preferred_period: string
  client_notes: string
  created_at: string
  address_city: string
  address_state: string
}

interface ServiceStats {
  service_type: string
  service_title: string
  total_appointments: number
  pending_count: number
  confirmed_count: number
  completed_count: number
  cancelled_count: number
  avg_urgency_score: number
  recent_appointments: number
}

export default function NAFManagementPage() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<AppointmentData[]>([])
  const [stats, setStats] = useState<ServiceStats[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('naf_auth_token')
      const userData = localStorage.getItem('naf_user_data')

      if (!token || !userData) {
        router.push('/naf-login')
        return
      }

      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        router.push('/naf-login')
      }
    }

    checkAuth()
  }, [router])

  // Load dashboard data
  useEffect(() => {
    if (!user) return

    const loadDashboardData = async () => {
      try {
        const response = await fetch('/api/fiscal-appointments')
        if (response.ok) {
          const data = await response.json()
          setAppointments(data.appointments || [])
          setStats(data.stats || [])
        } else {
          setError('Erro ao carregar dados do dashboard')
        }
      } catch (error) {
        setError('Erro de conexão')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  // Calculate dashboard metrics
  const totalAppointments = appointments.length
  const completedAppointments = appointments.filter(a => a.status === 'CONCLUIDO').length
  const pendingAppointments = appointments.filter(a => a.status === 'PENDENTE').length
  const confirmedAppointments = appointments.filter(a => a.status === 'CONFIRMADO').length

  // Students count (simulated for now)
  const activeStudents = 8

  const handleLogout = () => {
    localStorage.removeItem('naf_auth_token')
    localStorage.removeItem('naf_user_data')
    router.push('/naf-login')
  }

  const getFilteredAppointments = () => {
    if (selectedStatus === 'all') return appointments
    return appointments.filter(appointment => appointment.status === selectedStatus)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMADO': return 'bg-blue-100 text-blue-800'
      case 'EM_ANDAMENTO': return 'bg-orange-100 text-orange-800'
      case 'CONCLUIDO': return 'bg-green-100 text-green-800'
      case 'CANCELADO': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'BAIXA': return 'bg-green-100 text-green-800'
      case 'NORMAL': return 'bg-blue-100 text-blue-800'
      case 'ALTA': return 'bg-orange-100 text-orange-800'
      case 'URGENTE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel NAF...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gestão NAF - Orientações Fiscais
                  </h1>
                  <p className="text-gray-600">
                    Bem-vindo, {user?.email} | Painel Administrativo
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="appointments">Atendimentos</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {/* Métricas principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total de Atendimentos */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Atendimentos</p>
                      <p className="text-3xl font-bold text-gray-900">{totalAppointments}</p>
                      <p className="text-sm text-green-600 font-medium">+23% este mês</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Concluídos */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Concluídos</p>
                      <p className="text-3xl font-bold text-gray-900">{completedAppointments}</p>
                      <p className="text-sm text-gray-500">{totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0}% do total</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pendentes */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pendentes</p>
                      <p className="text-3xl font-bold text-gray-900">{pendingAppointments}</p>
                      <p className="text-sm text-gray-500">Aguardando atendimento</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estudantes Ativos */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Estudantes Ativos</p>
                      <p className="text-3xl font-bold text-gray-900">{activeStudents}</p>
                      <p className="text-sm text-gray-500">Realizando atendimentos</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Atendimentos por Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Atendimentos por Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Concluído</span>
                      <span className="text-sm text-gray-500">{completedAppointments} atendimentos</span>
                    </div>
                    <Progress value={totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Em Andamento</span>
                      <span className="text-sm text-gray-500">{confirmedAppointments} atendimentos</span>
                    </div>
                    <Progress value={totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Agendado</span>
                      <span className="text-sm text-gray-500">{confirmedAppointments} atendimentos</span>
                    </div>
                    <Progress value={totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Confirmado</span>
                      <span className="text-sm text-gray-500">{confirmedAppointments} atendimentos</span>
                    </div>
                    <Progress value={totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Atendimentos por Categoria */}
              <Card>
                <CardHeader>
                  <CardTitle>Atendimentos por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">PESSOA FÍSICA</span>
                      <span className="text-sm text-gray-500">1</span>
                    </div>
                    <Progress value={25} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">MEI</span>
                      <span className="text-sm text-gray-500">1</span>
                    </div>
                    <Progress value={25} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">RURAL</span>
                      <span className="text-sm text-gray-500">1</span>
                    </div>
                    <Progress value={25} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">OSC</span>
                      <span className="text-sm text-gray-500">1</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Atendimentos */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Gerenciar Atendimentos</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="all">Todos os Status</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="CONCLUIDO">Concluído</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {getFilteredAppointments().map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <Badge className={getUrgencyColor(appointment.urgency_level)}>
                            {appointment.urgency_level}
                          </Badge>
                          <span className="text-sm font-mono text-gray-500">
                            {appointment.protocol}
                          </span>
                        </div>

                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {appointment.service_title}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{appointment.client_name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{appointment.client_email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{appointment.client_phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{appointment.address_city}, {appointment.address_state}</span>
                          </div>
                        </div>

                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">
                            <strong>Observações:</strong> {appointment.client_notes || 'Nenhuma observação'}
                          </p>
                        </div>

                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            Criado em: {new Date(appointment.created_at).toLocaleDateString('pt-BR')} às {new Date(appointment.created_at).toLocaleTimeString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {getFilteredAppointments().length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum agendamento encontrado
                    </h3>
                    <p className="text-gray-500">
                      Tente ajustar os filtros ou aguarde novas solicitações.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Serviços */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                'Cadastro de CPF - Guia Completo',
                'MEI - Formalização e Gestão',
                'Declaração de Imposto de Renda PF',
                'ITR - Imposto Territorial Rural',
                'Abertura de CNPJ',
                'e-Social Doméstico',
                'Alvará de Funcionamento Municipal',
                'ISS - Imposto sobre Serviços',
                'ICMS - Imposto sobre Circulação de Mercadorias'
              ].map((service, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{service}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total de solicitações</span>
                        <span className="font-semibold">{stats.find(s => s.service_title === service)?.total_appointments || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pendentes</span>
                        <span className="text-yellow-600">{stats.find(s => s.service_title === service)?.pending_count || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Concluídos</span>
                        <span className="text-green-600">{stats.find(s => s.service_title === service)?.completed_count || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Seção Precisa de Orientação Personalizada */}
            <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Precisa de Orientação Personalizada?
                </h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Nossa equipe especializada está pronta para oferecer orientação personalizada
                  em questões fiscais e contábeis. Agende uma consulta individual para receber
                  suporte direcionado às suas necessidades específicas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/schedule">
                    <Button
                      variant="secondary"
                      className="bg-white text-blue-600 hover:bg-blue-50"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Orientação
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Entre em Contato
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}