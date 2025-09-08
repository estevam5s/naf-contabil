'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  Download,
  BarChart3,
  Users,
  FileText,
  Settings,
  Eye,
  Edit,
  Trash2,
  MessageSquare
} from 'lucide-react'

interface Appointment {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCategory: 'PESSOA_FISICA' | 'MEI' | 'RURAL' | 'OSC'
  serviceType: string
  date: string
  time: string
  status: 'AGENDADO' | 'CONFIRMADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO' | 'FALTOU'
  assignedStudent: string
  description: string
  isOnline: boolean
  urgency: 'BAIXA' | 'MEDIA' | 'ALTA'
  createdAt: string
  notes?: string
}

interface Statistics {
  totalAppointments: number
  completedAppointments: number
  pendingAppointments: number
  canceledAppointments: number
  studentsActive: number
  averageRating: number
  monthlyGrowth: number
}

export default function NAFManagementSystem() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [selectedTab, setSelectedTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('TODOS')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Mock data para demonstração
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: 'NAF-2024-001',
        clientName: 'Maria da Silva',
        clientEmail: 'maria@email.com',
        clientPhone: '(11) 99999-9999',
        clientCategory: 'PESSOA_FISICA',
        serviceType: 'Declaração de Imposto de Renda',
        date: '2024-01-15',
        time: '09:00',
        status: 'AGENDADO',
        assignedStudent: 'Ana Santos',
        description: 'Precisa de ajuda com a declaração de IR 2024',
        isOnline: false,
        urgency: 'MEDIA',
        createdAt: '2024-01-10T10:00:00Z',
        notes: 'Cliente tem documentos organizados'
      },
      {
        id: 'NAF-2024-002',
        clientName: 'João Oliveira',
        clientEmail: 'joao@email.com',
        clientPhone: '(11) 88888-8888',
        clientCategory: 'MEI',
        serviceType: 'Abertura de MEI',
        date: '2024-01-15',
        time: '14:00',
        status: 'CONCLUIDO',
        assignedStudent: 'Pedro Costa',
        description: 'Quer abrir MEI para atividade de consultoria',
        isOnline: true,
        urgency: 'ALTA',
        createdAt: '2024-01-08T14:00:00Z',
        notes: 'Atendimento realizado com sucesso. Cliente muito satisfeito.'
      },
      {
        id: 'NAF-2024-003',
        clientName: 'Carlos Rural',
        clientEmail: 'carlos@fazenda.com',
        clientPhone: '(11) 77777-7777',
        clientCategory: 'RURAL',
        serviceType: 'Declaração do ITR',
        date: '2024-01-16',
        time: '08:30',
        status: 'EM_ANDAMENTO',
        assignedStudent: 'Mariana Lima',
        description: 'Propriedade rural com 3 módulos fiscais',
        isOnline: false,
        urgency: 'MEDIA',
        createdAt: '2024-01-12T09:00:00Z'
      },
      {
        id: 'NAF-2024-004',
        clientName: 'Instituto Esperança',
        clientEmail: 'contato@esperanca.org',
        clientPhone: '(11) 66666-6666',
        clientCategory: 'OSC',
        serviceType: 'Orientação sobre Imunidade Tributária',
        date: '2024-01-17',
        time: '15:30',
        status: 'CONFIRMADO',
        assignedStudent: 'Rafael Silva',
        description: 'ONG precisa de orientação sobre benefícios fiscais',
        isOnline: true,
        urgency: 'BAIXA',
        createdAt: '2024-01-13T11:00:00Z'
      }
    ]
    setAppointments(mockAppointments)
    setFilteredAppointments(mockAppointments)
  }, [])

  // Filtrar agendamentos
  useEffect(() => {
    let filtered = appointments

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.assignedStudent.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'TODOS') {
      filtered = filtered.filter(app => app.status === filterStatus)
    }

    setFilteredAppointments(filtered)
  }, [searchTerm, filterStatus, appointments])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'AGENDADO': { color: 'bg-blue-100 text-blue-800', label: 'Agendado' },
      'CONFIRMADO': { color: 'bg-green-100 text-green-800', label: 'Confirmado' },
      'EM_ANDAMENTO': { color: 'bg-yellow-100 text-yellow-800', label: 'Em Andamento' },
      'CONCLUIDO': { color: 'bg-emerald-100 text-emerald-800', label: 'Concluído' },
      'CANCELADO': { color: 'bg-red-100 text-red-800', label: 'Cancelado' },
      'FALTOU': { color: 'bg-gray-100 text-gray-800', label: 'Faltou' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      'BAIXA': { color: 'bg-green-100 text-green-700', label: 'Baixa' },
      'MEDIA': { color: 'bg-yellow-100 text-yellow-700', label: 'Média' },
      'ALTA': { color: 'bg-red-100 text-red-700', label: 'Alta' }
    }
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig]
    return <Badge variant="outline" className={config.color}>{config.label}</Badge>
  }

  const updateAppointmentStatus = (id: string, newStatus: string) => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status: newStatus as any } : app
      )
    )
  }

  const statistics: Statistics = {
    totalAppointments: appointments.length,
    completedAppointments: appointments.filter(a => a.status === 'CONCLUIDO').length,
    pendingAppointments: appointments.filter(a => ['AGENDADO', 'CONFIRMADO', 'EM_ANDAMENTO'].includes(a.status)).length,
    canceledAppointments: appointments.filter(a => ['CANCELADO', 'FALTOU'].includes(a.status)).length,
    studentsActive: 8,
    averageRating: 4.8,
    monthlyGrowth: 23
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Atendimentos</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalAppointments}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">+{statistics.monthlyGrowth}% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{statistics.completedAppointments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {Math.round((statistics.completedAppointments / statistics.totalAppointments) * 100)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{statistics.pendingAppointments}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-xs text-gray-600 mt-2">Aguardando atendimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estudantes Ativos</p>
                <p className="text-2xl font-bold text-purple-600">{statistics.studentsActive}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600 mt-2">Realizando atendimentos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atendimentos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries({
                'CONCLUIDO': statistics.completedAppointments,
                'EM_ANDAMENTO': appointments.filter(a => a.status === 'EM_ANDAMENTO').length,
                'AGENDADO': appointments.filter(a => a.status === 'AGENDADO').length,
                'CONFIRMADO': appointments.filter(a => a.status === 'CONFIRMADO').length
              }).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(status)}
                    <span className="text-sm text-gray-600">{count} atendimentos</span>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / statistics.totalAppointments) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atendimentos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries({
                'PESSOA_FISICA': appointments.filter(a => a.clientCategory === 'PESSOA_FISICA').length,
                'MEI': appointments.filter(a => a.clientCategory === 'MEI').length,
                'RURAL': appointments.filter(a => a.clientCategory === 'RURAL').length,
                'OSC': appointments.filter(a => a.clientCategory === 'OSC').length
              }).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(count / statistics.totalAppointments) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderAppointmentDetails = (appointment: Appointment) => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Detalhes do Atendimento</CardTitle>
          <CardDescription>Protocolo: {appointment.id}</CardDescription>
        </div>
        <Button variant="outline" onClick={() => setShowDetails(false)}>
          Fechar
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Cliente</Label>
            <p className="text-lg font-semibold">{appointment.clientName}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{appointment.clientEmail}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{appointment.clientPhone}</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">Atendimento</Label>
            <p className="text-lg font-semibold">{appointment.serviceType}</p>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusBadge(appointment.status)}
              {getUrgencyBadge(appointment.urgency)}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">Data e Horário</Label>
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{appointment.time}</span>
              <Badge variant="outline" className="ml-2">
                {appointment.isOnline ? 'Online' : 'Presencial'}
              </Badge>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">Estudante Responsável</Label>
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{appointment.assignedStudent}</span>
            </div>
          </div>
        </div>

        {appointment.description && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Descrição</Label>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">{appointment.description}</p>
          </div>
        )}

        {appointment.notes && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Observações</Label>
            <p className="text-sm bg-blue-50 p-3 rounded-lg">{appointment.notes}</p>
          </div>
        )}

        <div className="flex space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMADO')}
            disabled={appointment.status === 'CONCLUIDO'}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirmar
          </Button>
          <Button
            variant="outline"
            onClick={() => updateAppointmentStatus(appointment.id, 'EM_ANDAMENTO')}
            disabled={appointment.status === 'CONCLUIDO'}
          >
            <Clock className="h-4 w-4 mr-2" />
            Iniciar
          </Button>
          <Button
            onClick={() => updateAppointmentStatus(appointment.id, 'CONCLUIDO')}
            disabled={appointment.status === 'CONCLUIDO'}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Concluir
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderAppointmentsList = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente, serviço ou estudante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="TODOS">Todos os Status</option>
                <option value="AGENDADO">Agendado</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDO">Concluído</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agendamentos */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-semibold text-lg">{appointment.clientName}</h3>
                    {getStatusBadge(appointment.status)}
                    {getUrgencyBadge(appointment.urgency)}
                    {appointment.isOnline && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Online</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">{appointment.serviceType}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{appointment.assignedStudent}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAppointment(appointment)
                      setShowDetails(true)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  if (showDetails && selectedAppointment) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {renderAppointmentDetails(selectedAppointment)}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">NAF</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Sistema de Gestão NAF
                </h1>
                <p className="text-sm text-gray-600">
                  Coordenação de Atendimentos Fiscais
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Relatórios
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="appointments">Atendimentos</TabsTrigger>
            <TabsTrigger value="students">Estudantes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            {renderAppointmentsList()}
          </TabsContent>

          <TabsContent value="students" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-500">
                  Gestão de estudantes em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
