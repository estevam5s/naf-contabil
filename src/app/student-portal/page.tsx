'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertCircle,
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
  Upload
} from 'lucide-react'

interface StudentProfile {
  id: string
  name: string
  email: string
  phone: string
  course: string
  semester: string
  totalAppointments: number
  completedAppointments: number
  rating: number
  specializations: string[]
  availableHours: string[]
  status: 'ATIVO' | 'INATIVO' | 'TREINAMENTO'
}

interface Assignment {
  id: string
  clientName: string
  serviceType: string
  date: string
  time: string
  status: 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO'
  isOnline: boolean
  clientCategory: string
  urgency: 'BAIXA' | 'MEDIA' | 'ALTA'
  description: string
  clientContact: {
    email: string
    phone: string
  }
  notes?: string
  documents?: string[]
}

interface TrainingModule {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'BÁSICO' | 'INTERMEDIÁRIO' | 'AVANÇADO'
  completed: boolean
  score?: number
  topics: string[]
}

export default function StudentPortal() {
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

  // Mock data do estudante
  const studentProfile: StudentProfile = {
    id: 'STU-001',
    name: 'Ana Carolina Santos',
    email: 'ana.santos@estudante.edu.br',
    phone: '(11) 99999-0001',
    course: 'Ciências Contábeis',
    semester: '6º Semestre',
    totalAppointments: 45,
    completedAppointments: 42,
    rating: 4.8,
    specializations: ['Imposto de Renda', 'MEI', 'Pessoa Física'],
    availableHours: ['08:00-12:00', '14:00-18:00'],
    status: 'ATIVO'
  }

  useEffect(() => {
    // Mock assignments
    const mockAssignments: Assignment[] = [
      {
        id: 'ASG-001',
        clientName: 'Maria da Silva',
        serviceType: 'Declaração de Imposto de Renda',
        date: '2024-01-20',
        time: '09:00',
        status: 'AGENDADO',
        isOnline: false,
        clientCategory: 'PESSOA_FISICA',
        urgency: 'MEDIA',
        description: 'Cliente precisa de ajuda com declaração de IR 2024. Possui documentos organizados.',
        clientContact: {
          email: 'maria@email.com',
          phone: '(11) 99999-9999'
        }
      },
      {
        id: 'ASG-002',
        clientName: 'João Empresa',
        serviceType: 'Orientação MEI',
        date: '2024-01-20',
        time: '14:30',
        status: 'EM_ANDAMENTO',
        isOnline: true,
        clientCategory: 'MEI',
        urgency: 'ALTA',
        description: 'Empresário quer migrar de MEI para ME. Precisa de orientação sobre processo.',
        clientContact: {
          email: 'joao@empresa.com',
          phone: '(11) 88888-8888'
        },
        notes: 'Cliente já possui CNPJ MEI ativo. Faturamento próximo ao limite.'
      },
      {
        id: 'ASG-003',
        clientName: 'Carlos Fazenda',
        serviceType: 'Declaração ITR',
        date: '2024-01-21',
        time: '10:00',
        status: 'CONCLUIDO',
        isOnline: false,
        clientCategory: 'RURAL',
        urgency: 'BAIXA',
        description: 'Proprietário rural com 2 módulos fiscais. Primeira declaração.',
        clientContact: {
          email: 'carlos@fazenda.com',
          phone: '(11) 77777-7777'
        },
        notes: 'Atendimento concluído com sucesso. Cliente ficou muito satisfeito.',
        documents: ['ITR_2024_Carlos.pdf', 'CCIR_Carlos.pdf']
      }
    ]
    setAssignments(mockAssignments)

    // Mock training modules
    const mockTraining: TrainingModule[] = [
      {
        id: 'TRN-001',
        title: 'Fundamentos da Legislação Tributária',
        description: 'Conceitos básicos sobre legislação tributária brasileira',
        duration: '2h 30min',
        difficulty: 'BÁSICO',
        completed: true,
        score: 95,
        topics: ['CTN', 'Tributos Federais', 'ICMS', 'ISS']
      },
      {
        id: 'TRN-002',
        title: 'Declaração de Imposto de Renda PF',
        description: 'Curso completo sobre DIRPF e suas particularidades',
        duration: '4h 15min',
        difficulty: 'INTERMEDIÁRIO',
        completed: true,
        score: 88,
        topics: ['DIRPF', 'Deduções', 'Dependentes', 'Bens e Direitos']
      },
      {
        id: 'TRN-003',
        title: 'MEI - Microempreendedor Individual',
        description: 'Tudo sobre MEI: abertura, obrigações e desenquadramento',
        duration: '3h 00min',
        difficulty: 'INTERMEDIÁRIO',
        completed: false,
        topics: ['Portal do Empreendedor', 'DAS-MEI', 'DASN', 'Desenquadramento']
      },
      {
        id: 'TRN-004',
        title: 'Atendimento ao Público e Comunicação',
        description: 'Técnicas de atendimento e comunicação eficaz',
        duration: '1h 45min',
        difficulty: 'BÁSICO',
        completed: true,
        score: 92,
        topics: ['Comunicação', 'Empatia', 'Resolução de Conflitos']
      }
    ]
    setTrainingModules(mockTraining)
  }, [])

  const updateAssignmentStatus = (id: string, newStatus: string, notes?: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === id 
          ? { ...assignment, status: newStatus as any, notes: notes || assignment.notes }
          : assignment
      )
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'AGENDADO': { color: 'bg-blue-100 text-blue-800', label: 'Agendado' },
      'EM_ANDAMENTO': { color: 'bg-yellow-100 text-yellow-800', label: 'Em Andamento' },
      'CONCLUIDO': { color: 'bg-green-100 text-green-800', label: 'Concluído' },
      'CANCELADO': { color: 'bg-red-100 text-red-800', label: 'Cancelado' }
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

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyConfig = {
      'BÁSICO': { color: 'bg-green-100 text-green-700', label: 'Básico' },
      'INTERMEDIÁRIO': { color: 'bg-yellow-100 text-yellow-700', label: 'Intermediário' },
      'AVANÇADO': { color: 'bg-red-100 text-red-700', label: 'Avançado' }
    }
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig]
    return <Badge variant="outline" className={config.color}>{config.label}</Badge>
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Estatísticas do Estudante */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Atendimentos</p>
                <p className="text-2xl font-bold text-gray-900">{studentProfile.totalAppointments}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">+5 este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{studentProfile.completedAppointments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {Math.round((studentProfile.completedAppointments / studentProfile.totalAppointments) * 100)}% de sucesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avaliação</p>
                <p className="text-2xl font-bold text-yellow-600">{studentProfile.rating}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="flex mt-1">
              {[1,2,3,4,5].map(star => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${star <= studentProfile.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Treinamentos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {trainingModules.filter(m => m.completed).length}/{trainingModules.length}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {Math.round((trainingModules.filter(m => m.completed).length / trainingModules.length) * 100)}% completo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Atendimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Atendimentos</CardTitle>
          <CardDescription>Seus atendimentos agendados para os próximos dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments
              .filter(a => ['AGENDADO', 'EM_ANDAMENTO'].includes(a.status))
              .slice(0, 3)
              .map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{assignment.clientName}</h4>
                      {getStatusBadge(assignment.status)}
                      {getUrgencyBadge(assignment.urgency)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{assignment.serviceType}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{new Date(assignment.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{assignment.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {assignment.isOnline ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                        <span>{assignment.isOnline ? 'Online' : 'Presencial'}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Progresso em Treinamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso em Treinamentos</CardTitle>
          <CardDescription>Continue seus estudos para melhorar suas habilidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainingModules.slice(0, 3).map((module) => (
              <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">{module.title}</h4>
                    {getDifficultyBadge(module.difficulty)}
                    {module.completed && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Concluído
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{module.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>⏱️ {module.duration}</span>
                    {module.completed && module.score && (
                      <span>📊 Nota: {module.score}%</span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {module.completed ? 'Revisar' : 'Continuar'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meus Atendimentos</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">{assignment.clientName}</h3>
                  {getStatusBadge(assignment.status)}
                  {getUrgencyBadge(assignment.urgency)}
                  {assignment.isOnline && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
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
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Serviço</Label>
                  <p className="text-sm">{assignment.serviceType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Data e Horário</Label>
                  <div className="flex items-center space-x-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span>{new Date(assignment.date).toLocaleDateString('pt-BR')}</span>
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{assignment.time}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Contato</Label>
                  <div className="text-sm">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span>{assignment.clientContact.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {assignment.description && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-600">Descrição</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{assignment.description}</p>
                </div>
              )}

              {assignment.notes && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-600">Suas Anotações</Label>
                  <p className="text-sm bg-blue-50 p-3 rounded-lg mt-1">{assignment.notes}</p>
                </div>
              )}

              {assignment.documents && assignment.documents.length > 0 && (
                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-600">Documentos</Label>
                  <div className="flex space-x-2 mt-1">
                    {assignment.documents.map((doc, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer">
                        <FileText className="h-3 w-3 mr-1" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {assignment.status !== 'CONCLUIDO' && assignment.status !== 'CANCELADO' && (
                <div className="flex space-x-2 pt-4 border-t">
                  {assignment.status === 'AGENDADO' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateAssignmentStatus(assignment.id, 'EM_ANDAMENTO')}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Iniciar Atendimento
                    </Button>
                  )}
                  {assignment.status === 'EM_ANDAMENTO' && (
                    <Button
                      size="sm"
                      onClick={() => updateAssignmentStatus(assignment.id, 'CONCLUIDO')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Concluir Atendimento
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar Documento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderTraining = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Treinamentos NAF</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Meu Progresso
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Progresso Geral</h3>
            <span className="text-2xl font-bold text-blue-600">
              {Math.round((trainingModules.filter(m => m.completed).length / trainingModules.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{ 
                width: `${(trainingModules.filter(m => m.completed).length / trainingModules.length) * 100}%` 
              }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {trainingModules.filter(m => m.completed).length} de {trainingModules.length} módulos concluídos
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trainingModules.map((module) => (
          <Card key={module.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{module.title}</h3>
                    {getDifficultyBadge(module.difficulty)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <span>⏱️ {module.duration}</span>
                    {module.completed && module.score && (
                      <span>📊 {module.score}%</span>
                    )}
                  </div>
                </div>
                {module.completed && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>

              <div className="mb-4">
                <Label className="text-sm font-medium text-gray-600">Tópicos Abordados</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {module.topics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  className="flex-1"
                  variant={module.completed ? "outline" : "default"}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {module.completed ? 'Revisar' : 'Iniciar'}
                </Button>
                {module.completed && (
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

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
                <h1 className="text-xl font-bold text-gray-900">
                  Portal do Estudante
                </h1>
                <p className="text-sm text-gray-600">
                  Bem-vindo(a), {studentProfile.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">
                {studentProfile.status}
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">{studentProfile.course}</p>
                <p className="text-xs text-gray-600">{studentProfile.semester}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="assignments">Atendimentos</TabsTrigger>
            <TabsTrigger value="training">Treinamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {renderDashboard()}
          </TabsContent>

          <TabsContent value="assignments" className="mt-6">
            {renderAssignments()}
          </TabsContent>

          <TabsContent value="training" className="mt-6">
            {renderTraining()}
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de Detalhes do Atendimento */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Detalhes do Atendimento</CardTitle>
                  <CardDescription>
                    {selectedAssignment.clientName} - {selectedAssignment.serviceType}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedAssignment(null)}
                >
                  Fechar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Cliente</Label>
                  <p className="font-medium">{selectedAssignment.clientName}</p>
                  <div className="text-sm text-gray-600 space-y-1 mt-1">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{selectedAssignment.clientContact.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{selectedAssignment.clientContact.phone}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Atendimento</Label>
                  <p className="font-medium">{selectedAssignment.serviceType}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge(selectedAssignment.status)}
                    {getUrgencyBadge(selectedAssignment.urgency)}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Data e Horário</Label>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span>{new Date(selectedAssignment.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{selectedAssignment.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {selectedAssignment.isOnline ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                    <span>{selectedAssignment.isOnline ? 'Online' : 'Presencial'}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Descrição</Label>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedAssignment.description}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Adicionar Anotações</Label>
                <Textarea
                  placeholder="Adicione suas observações sobre este atendimento..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                {selectedAssignment.status === 'AGENDADO' && (
                  <Button onClick={() => {
                    updateAssignmentStatus(selectedAssignment.id, 'EM_ANDAMENTO')
                    setSelectedAssignment(null)
                  }}>
                    <Clock className="h-4 w-4 mr-2" />
                    Iniciar Atendimento
                  </Button>
                )}
                {selectedAssignment.status === 'EM_ANDAMENTO' && (
                  <Button onClick={() => {
                    updateAssignmentStatus(selectedAssignment.id, 'CONCLUIDO')
                    setSelectedAssignment(null)
                  }}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Concluir Atendimento
                  </Button>
                )}
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contatar Cliente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
