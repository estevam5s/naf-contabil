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
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Building2,
  Scale,
  ArrowLeft,
  LogOut,
  Settings,
  Eye,
  Edit,
  Filter,
  Search,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import Link from 'next/link'

interface FiscalService {
  id: string
  title: string
  description: string
  scope: 'FEDERAL' | 'ESTADUAL' | 'MUNICIPAL'
  category: string
  lastUpdated: string
  steps: string[]
  documents: string[]
  serviceType: string
}

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
  total: number
  pending: number
  confirmed: number
  completed: number
  urgent: number
}

interface DashboardData {
  fiscalAppointments: {
    totalAppointments: number
    pendingAppointments: number
    confirmedAppointments: number
    completedAppointments: number
    urgentAppointments: number
    serviceBreakdown: Record<string, ServiceStats>
    recentAppointments: AppointmentData[]
  }
}

export default function NAFManagementPage() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [selectedService, setSelectedService] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // Dados dos serviços fiscais (mesmo do fiscal-guides)
  const fiscalServices: FiscalService[] = [
    {
      id: 'cpf-guide',
      title: 'Cadastro de CPF - Guia Completo',
      description: 'Procedimentos para inscrição, alteração e regularização de CPF',
      scope: 'FEDERAL',
      category: 'Cadastros',
      lastUpdated: '2024-01-15',
      serviceType: 'CPF',
      steps: [
        'Verificar se possui documentos necessários',
        'Acessar o portal da Receita Federal',
        'Preencher formulário online ou presencial',
        'Aguardar processamento e emissão'
      ],
      documents: [
        'Certidão de nascimento ou casamento',
        'RG ou documento oficial com foto',
        'Título de eleitor (se maior de 18 anos)',
        'Comprovante de residência'
      ]
    },
    {
      id: 'mei-guide',
      title: 'MEI - Formalização e Gestão',
      description: 'Como abrir, gerir e cumprir obrigações do MEI',
      scope: 'FEDERAL',
      category: 'Microempreendedor',
      lastUpdated: '2024-01-10',
      serviceType: 'MEI',
      steps: [
        'Verificar atividades permitidas no MEI',
        'Acessar Portal do Empreendedor',
        'Preencher dados pessoais e da atividade',
        'Obter CNPJ e licenças municipais',
        'Emitir DAS mensalmente'
      ],
      documents: [
        'CPF',
        'RG',
        'Comprovante de residência',
        'Título de eleitor'
      ]
    },
    {
      id: 'ir-guide',
      title: 'Declaração de Imposto de Renda PF',
      description: 'Orientações para declaração anual do IR',
      scope: 'FEDERAL',
      category: 'Imposto de Renda',
      lastUpdated: '2024-02-01',
      serviceType: 'IR',
      steps: [
        'Verificar obrigatoriedade de declarar',
        'Reunir documentos de rendimentos',
        'Baixar programa IRPF da Receita',
        'Preencher ficha por ficha',
        'Transmitir declaração'
      ],
      documents: [
        'Informes de rendimentos',
        'Comprovantes de despesas médicas',
        'Comprovantes de despesas educacionais',
        'Documentos de dependentes'
      ]
    },
    {
      id: 'itr-guide',
      title: 'ITR - Imposto Territorial Rural',
      description: 'Declaração do ITR para propriedades rurais',
      scope: 'FEDERAL',
      category: 'Rural',
      lastUpdated: '2024-01-20',
      serviceType: 'ITR',
      steps: [
        'Verificar obrigatoriedade de declarar',
        'Reunir documentos da propriedade',
        'Calcular área total e aproveitável',
        'Preencher DITR online',
        'Transmitir e pagar se devido'
      ],
      documents: [
        'Escritura do imóvel',
        'CNIR (se houver)',
        'Comprovantes de benfeitorias',
        'Documento de área'
      ]
    },
    {
      id: 'cnpj-guide',
      title: 'Abertura de CNPJ',
      description: 'Procedimentos para constituição de pessoa jurídica',
      scope: 'FEDERAL',
      category: 'Empresarial',
      lastUpdated: '2024-01-05',
      serviceType: 'CNPJ',
      steps: [
        'Consultar viabilidade do nome',
        'Elaborar contrato social',
        'Registrar na Junta Comercial',
        'Inscrever na Receita Federal',
        'Obter licenças municipais'
      ],
      documents: [
        'Contrato social',
        'CPF e RG dos sócios',
        'Comprovante de endereço',
        'Consulta de viabilidade'
      ]
    },
    {
      id: 'esocial-guide',
      title: 'e-Social Doméstico',
      description: 'Cadastro e gestão de empregados domésticos',
      scope: 'FEDERAL',
      category: 'Trabalhista',
      lastUpdated: '2024-01-12',
      serviceType: 'ESOCIAL',
      steps: [
        'Cadastrar empregador no e-Social',
        'Cadastrar empregado doméstico',
        'Enviar evento de admissão',
        'Gerar guia DAE mensalmente',
        'Enviar folha de pagamento'
      ],
      documents: [
        'CPF do empregador',
        'Dados do empregado',
        'Contrato de trabalho',
        'Exames médicos'
      ]
    },
    {
      id: 'alvara-municipal',
      title: 'Alvará de Funcionamento Municipal',
      description: 'Como obter licença municipal para funcionamento',
      scope: 'MUNICIPAL',
      category: 'Licenças',
      lastUpdated: '2024-01-08',
      serviceType: 'ALVARA',
      steps: [
        'Consultar código de atividade municipal',
        'Verificar zoneamento do local',
        'Reunir documentação exigida',
        'Protocolar pedido na prefeitura',
        'Aguardar vistoria e aprovação'
      ],
      documents: [
        'CNPJ ou CPF',
        'Contrato de locação ou escritura',
        'Projeto arquitetônico (se exigido)',
        'Auto de vistoria do corpo de bombeiros'
      ]
    },
    {
      id: 'iss-municipal',
      title: 'ISS - Imposto sobre Serviços',
      description: 'Orientações sobre ISS municipal',
      scope: 'MUNICIPAL',
      category: 'Tributos Municipais',
      lastUpdated: '2024-01-15',
      serviceType: 'ISS',
      steps: [
        'Identificar local de prestação do serviço',
        'Verificar alíquota aplicável',
        'Emitir nota fiscal de serviço',
        'Calcular imposto devido',
        'Recolher até o vencimento'
      ],
      documents: [
        'Inscrição municipal',
        'Notas fiscais emitidas',
        'Livro de registro de serviços',
        'Guias de recolhimento'
      ]
    },
    {
      id: 'icms-estadual',
      title: 'ICMS - Imposto sobre Circulação de Mercadorias',
      description: 'Orientações sobre ICMS estadual',
      scope: 'ESTADUAL',
      category: 'Tributos Estaduais',
      lastUpdated: '2024-01-10',
      serviceType: 'ICMS',
      steps: [
        'Verificar enquadramento no regime',
        'Emitir notas fiscais corretamente',
        'Escriturar livros fiscais',
        'Apurar ICMS mensalmente',
        'Transmitir obrigações acessórias'
      ],
      documents: [
        'Inscrição estadual',
        'Notas fiscais de entrada e saída',
        'Livros fiscais',
        'SPED Fiscal'
      ]
    }
  ]

  // Verificar autenticação e carregar dados
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('coordinator_token')
      const userData = localStorage.getItem('coordinator_user')

      if (!token || !userData) {
        router.push('/coordinator-login')
        return
      }

      try {
        setUser(JSON.parse(userData))

        // Buscar dados do dashboard
        const response = await fetch('/api/coordinator/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        } else {
          setError('Erro ao carregar dados')
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
    localStorage.removeItem('coordinator_token')
    localStorage.removeItem('coordinator_user')
    router.push('/coordinator-login')
  }

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'FEDERAL': return <Building2 className="h-4 w-4" />
      case 'ESTADUAL': return <Scale className="h-4 w-4" />
      case 'MUNICIPAL': return <Users className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'FEDERAL': return 'bg-blue-100 text-blue-800'
      case 'ESTADUAL': return 'bg-green-100 text-green-800'
      case 'MUNICIPAL': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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

  const getServiceStats = (serviceType: string): ServiceStats | null => {
    return dashboardData?.fiscalAppointments?.serviceBreakdown?.[serviceType] || null
  }

  const getFilteredAppointments = () => {
    if (!dashboardData?.fiscalAppointments?.recentAppointments) return []

    let appointments = dashboardData.fiscalAppointments.recentAppointments

    if (selectedService !== 'all') {
      appointments = appointments.filter(apt => apt.service_type === selectedService)
    }

    if (selectedStatus !== 'all') {
      appointments = appointments.filter(apt => apt.status === selectedStatus)
    }

    return appointments
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando painel de gestão...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button onClick={() => window.location.reload()} className="ml-4">
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/coordinator-dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestão NAF - Orientações Fiscais
                </h1>
                <p className="text-gray-600">
                  Bem-vindo, {user?.email} | Gerencie todos os serviços e agendamentos
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/fiscal-guides">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Guias Públicos
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline">
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Agendamentos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.fiscalAppointments?.totalAppointments || 0}
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
                    {dashboardData?.fiscalAppointments?.pendingAppointments || 0}
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
                    {dashboardData?.fiscalAppointments?.confirmedAppointments || 0}
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
                    {dashboardData?.fiscalAppointments?.urgentAppointments || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="appointments">Atendimentos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Serviços Fiscais */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Serviços de Orientação Fiscal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fiscalServices.map((service) => {
                  const stats = getServiceStats(service.serviceType)
                  return (
                    <Card key={service.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`${getScopeColor(service.scope)} flex items-center gap-1`}>
                                {getScopeIcon(service.scope)}
                                {service.scope}
                              </Badge>
                              <Badge variant="outline">{service.category}</Badge>
                            </div>
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                            <CardDescription className="mt-2">{service.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Estatísticas do Serviço */}
                        {stats ? (
                          <div className="space-y-3 mb-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Total de solicitações</span>
                              <span className="font-medium">{stats.total}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-yellow-600">Pendentes:</span>
                                <span>{stats.pending}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-600">Confirmados:</span>
                                <span>{stats.confirmed}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-green-600">Concluídos:</span>
                                <span>{stats.completed}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-600">Urgentes:</span>
                                <span>{stats.urgent}</span>
                              </div>
                            </div>
                            {stats.total > 0 && (
                              <Progress
                                value={(stats.completed / stats.total) * 100}
                                className="h-2"
                              />
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 text-sm py-4">
                            Nenhuma solicitação ainda
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Settings className="h-4 w-4 mr-2" />
                            Gerenciar
                          </Button>
                          <Button size="sm" onClick={() => setSelectedService(service.serviceType)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Agendamentos
                          </Button>
                        </div>

                        <div className="mt-4 text-xs text-gray-500">
                          Última atualização: {new Date(service.lastUpdated).toLocaleDateString('pt-BR')}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {/* Card Orientação Personalizada */}
                <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900">Orientação Personalizada</CardTitle>
                    <CardDescription className="text-blue-700">
                      Atendimento individualizado para casos específicos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-blue-800">
                        • Casos não cobertos pelos guias padrão<br/>
                        • Situações complexas que requerem análise individual<br/>
                        • Orientação específica por área de especialização
                      </div>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        Gerenciar Orientações
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Filtrar por Serviço
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Todos os Serviços</option>
                      {fiscalServices.map((service) => (
                        <option key={service.serviceType} value={service.serviceType}>
                          {service.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Filtrar por Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Todos os Status</option>
                      <option value="PENDENTE">Pendente</option>
                      <option value="CONFIRMADO">Confirmado</option>
                      <option value="CONCLUIDO">Concluído</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Agendamentos */}
            <div className="space-y-4">
              {getFilteredAppointments().map((appointment) => (
                <Card key={appointment.protocol} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{appointment.client_name}</h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <Badge className={getUrgencyColor(appointment.urgency_level)}>
                            {appointment.urgency_level}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <p className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              {appointment.service_title}
                            </p>
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {appointment.client_email}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {appointment.client_phone}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {appointment.address_city}, {appointment.address_state}
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {appointment.preferred_date ? new Date(appointment.preferred_date).toLocaleDateString('pt-BR') : 'Data não especificada'}
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {appointment.preferred_period || 'Período não especificado'}
                            </p>
                          </div>
                        </div>

                        {appointment.client_notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700">
                              <strong>Observações:</strong> {appointment.client_notes}
                            </p>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-mono">
                            Protocolo: {appointment.protocol}
                          </span>
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
        </Tabs>
      </main>
    </div>
  )
}