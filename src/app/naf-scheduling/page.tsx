'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  Building2,
  Sprout,
  Heart
} from 'lucide-react'

interface TimeSlot {
  time: string
  available: boolean
  student?: string
  service?: string
}

interface AppointmentRequest {
  id?: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCategory: 'PESSOA_FISICA' | 'MEI' | 'RURAL' | 'OSC'
  serviceType: string
  preferredDate: Date | null
  preferredTime: string
  description: string
  documents: string[]
  urgency: 'BAIXA' | 'MEDIA' | 'ALTA'
  isOnline: boolean
}

export default function NAFSchedulingSystem() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [appointment, setAppointment] = useState<AppointmentRequest>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCategory: 'PESSOA_FISICA',
    serviceType: '',
    preferredDate: null,
    preferredTime: '',
    description: '',
    documents: [],
    urgency: 'MEDIA',
    isOnline: false
  })
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Serviços NAF organizados por categoria
  const nafServices = {
    'PESSOA_FISICA': [
      'Cadastro de CPF',
      'Declaração de Imposto de Renda',
      'Orientação sobre Isenção IR (Moléstias Graves)',
      'Consulta de Débitos Fiscais',
      'Certidão Negativa de Débitos',
      'Parcelamento de Débitos Tributários',
      'E-Social Doméstico',
      'Orientação sobre Bagagens Internacionais',
      'Orientação GOV.BR'
    ],
    'MEI': [
      'Abertura de MEI',
      'Orientações sobre DAS-MEI',
      'Declaração Anual Simplificada (DASN)',
      'Desenquadramento do MEI',
      'Orientação sobre Comércio Exterior MEI',
      'Emissão de Documentos Tributários',
      'Orientação sobre Funcionário MEI'
    ],
    'RURAL': [
      'Cadastro Nacional de Imóveis Rurais (CNIR)',
      'Declaração do ITR (DITR)',
      'Cadastro Ambiental Rural (CAR)',
      'Certificado de Cadastro de Imóvel Rural (CCIR)',
      'Orientação sobre ITR',
      'Certidão Negativa Rural'
    ],
    'OSC': [
      'Orientação sobre CNPJ para OSC',
      'Declaração de Benefícios Fiscais (DBF)',
      'Orientação sobre Imunidade Tributária',
      'Certidões de Regularidade',
      'Orientação sobre e-Social'
    ]
  }

  // Horários disponíveis
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ]

  // Documentos necessários por categoria
  const requiredDocuments = {
    'PESSOA_FISICA': [
      'RG ou documento oficial com foto',
      'CPF',
      'Comprovante de residência',
      'Comprovante de renda (se aplicável)'
    ],
    'MEI': [
      'CPF',
      'RG',
      'Comprovante de residência',
      'Título de eleitor',
      'Documentos específicos da atividade'
    ],
    'RURAL': [
      'CPF',
      'RG',
      'Documentos da propriedade rural',
      'CNIR (se houver)',
      'Comprovantes de atividade rural'
    ],
    'OSC': [
      'CNPJ',
      'Estatuto social atualizado',
      'Ata de eleição da diretoria',
      'Certidões de regularidade'
    ]
  }

  useEffect(() => {
    if (selectedDate) {
      generateAvailableSlots(selectedDate)
    }
  }, [selectedDate])

  const generateAvailableSlots = (date: Date) => {
    // Simular disponibilidade de horários
    const slots = timeSlots.map(time => ({
      time,
      available: Math.random() > 0.3, // 70% de chance de estar disponível
      student: Math.random() > 0.5 ? 'Ana Silva' : 'João Santos',
      service: 'Disponível'
    }))
    setAvailableSlots(slots)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Simular envio do agendamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aqui seria feita a chamada real para a API
      console.log('Agendamento criado:', appointment)
      
      setStep(4) // Ir para tela de confirmação
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'PESSOA_FISICA':
        return { 
          label: 'Pessoa Física Hipossuficiente', 
          icon: Users, 
          color: 'text-blue-600',
          description: 'Renda familiar até 5 salários mínimos'
        }
      case 'MEI':
        return { 
          label: 'Microempreendedor Individual', 
          icon: Building2, 
          color: 'text-green-600',
          description: 'Faturamento anual até R$ 81.000'
        }
      case 'RURAL':
        return { 
          label: 'Pequeno Proprietário Rural', 
          icon: Sprout, 
          color: 'text-emerald-600',
          description: 'Propriedade até 4 módulos fiscais'
        }
      case 'OSC':
        return { 
          label: 'Organização da Sociedade Civil', 
          icon: Heart, 
          color: 'text-purple-600',
          description: 'Entidade sem fins lucrativos'
        }
      default:
        return { label: category, icon: Users, color: 'text-gray-600', description: '' }
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Informações Pessoais
        </h2>
        <p className="text-gray-600">
          Preencha seus dados para agendamento no NAF
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="clientName">Nome Completo *</Label>
          <Input
            id="clientName"
            value={appointment.clientName}
            onChange={(e) => setAppointment(prev => ({ ...prev, clientName: e.target.value }))}
            placeholder="Seu nome completo"
          />
        </div>

        <div>
          <Label htmlFor="clientEmail">E-mail *</Label>
          <Input
            id="clientEmail"
            type="email"
            value={appointment.clientEmail}
            onChange={(e) => setAppointment(prev => ({ ...prev, clientEmail: e.target.value }))}
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <Label htmlFor="clientPhone">Telefone *</Label>
          <Input
            id="clientPhone"
            value={appointment.clientPhone}
            onChange={(e) => setAppointment(prev => ({ ...prev, clientPhone: e.target.value }))}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <Label htmlFor="clientCategory">Categoria do Atendimento *</Label>
          <Select 
            value={appointment.clientCategory} 
            onValueChange={(value: any) => setAppointment(prev => ({ ...prev, clientCategory: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione sua categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PESSOA_FISICA">Pessoa Física Hipossuficiente</SelectItem>
              <SelectItem value="MEI">Microempreendedor Individual</SelectItem>
              <SelectItem value="RURAL">Pequeno Proprietário Rural</SelectItem>
              <SelectItem value="OSC">Organização da Sociedade Civil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {appointment.clientCategory && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {(() => {
                const categoryInfo = getCategoryInfo(appointment.clientCategory)
                const IconComponent = categoryInfo.icon
                return (
                  <>
                    <IconComponent className={`h-5 w-5 ${categoryInfo.color} mt-0.5`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{categoryInfo.label}</h4>
                      <p className="text-sm text-gray-600">{categoryInfo.description}</p>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Documentos necessários:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {requiredDocuments[appointment.clientCategory]?.map((doc, index) => (
                            <li key={index}>• {doc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Serviço Solicitado
        </h2>
        <p className="text-gray-600">
          Escolha o serviço NAF que você precisa
        </p>
      </div>

      <div>
        <Label htmlFor="serviceType">Tipo de Serviço *</Label>
        <Select 
          value={appointment.serviceType} 
          onValueChange={(value) => setAppointment(prev => ({ ...prev, serviceType: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o serviço" />
          </SelectTrigger>
          <SelectContent>
            {nafServices[appointment.clientCategory]?.map((service, index) => (
              <SelectItem key={index} value={service}>{service}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

        <div>
          <Label htmlFor="description">Descrição da Solicitação</Label>
          <Textarea
            id="description"
            value={appointment.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAppointment(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva brevemente sua necessidade ou dúvida específica..."
            rows={4}
          />
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="urgency">Nível de Urgência</Label>
          <Select 
            value={appointment.urgency} 
            onValueChange={(value: any) => setAppointment(prev => ({ ...prev, urgency: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BAIXA">Baixa - Posso aguardar</SelectItem>
              <SelectItem value="MEDIA">Média - Prazo normal</SelectItem>
              <SelectItem value="ALTA">Alta - Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="isOnline"
            checked={appointment.isOnline}
            onChange={(e) => setAppointment(prev => ({ ...prev, isOnline: e.target.checked }))}
            className="rounded"
          />
          <Label htmlFor="isOnline">Prefiro atendimento online</Label>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Data e Horário
        </h2>
        <p className="text-gray-600">
          Escolha o melhor dia e horário para seu atendimento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label>Selecione a Data</Label>
          <div className="mt-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date: Date) => date < new Date() || date.getDay() === 0} // Desabilita domingos e datas passadas
              className="rounded-md border"
            />
          </div>
        </div>

        <div>
          <Label>Horários Disponíveis</Label>
          {selectedDate && (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600 mb-4">
                {selectedDate.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {availableSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={appointment.preferredTime === slot.time ? "default" : "outline"}
                    disabled={!slot.available}
                    onClick={() => {
                      if (slot.available) {
                        setAppointment(prev => ({ 
                          ...prev, 
                          preferredTime: slot.time,
                          preferredDate: selectedDate 
                        }))
                      }
                    }}
                    className="justify-start"
                    size="sm"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {slot.time}
                    {!slot.available && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Ocupado
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {appointment.preferredTime && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Horário Selecionado</p>
                <p className="text-sm text-green-600">
                  {selectedDate?.toLocaleDateString('pt-BR')} às {appointment.preferredTime}
                  {appointment.isOnline ? ' (Online)' : ' (Presencial)'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Agendamento Confirmado!
        </h2>
        <p className="text-gray-600">
          Seu atendimento foi agendado com sucesso
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4 text-left">
            <div className="flex justify-between">
              <span className="font-medium">Protocolo:</span>
              <span className="text-blue-600 font-mono">NAF-2024-{Math.random().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Data:</span>
              <span>{appointment.preferredDate?.toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Horário:</span>
              <span>{appointment.preferredTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Serviço:</span>
              <span>{appointment.serviceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Modalidade:</span>
              <span>{appointment.isOnline ? 'Online' : 'Presencial'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Próximos Passos:</h3>
        <ul className="text-sm text-blue-600 space-y-1 text-left">
          <li>• Você receberá um e-mail de confirmação</li>
          <li>• Prepare os documentos necessários</li>
          <li>• Chegue 10 minutos antes do horário agendado</li>
          <li>• Em caso de dúvidas, entre em contato conosco</li>
        </ul>
      </div>

      <div className="flex space-x-4 justify-center">
        <Button onClick={() => window.print()}>
          <FileText className="h-4 w-4 mr-2" />
          Imprimir Comprovante
        </Button>
        <Button variant="outline" onClick={() => {
          setStep(1)
          setAppointment({
            clientName: '',
            clientEmail: '',
            clientPhone: '',
            clientCategory: 'PESSOA_FISICA',
            serviceType: '',
            preferredDate: null,
            preferredTime: '',
            description: '',
            documents: [],
            urgency: 'MEDIA',
            isOnline: false
          })
        }}>
          Novo Agendamento
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">NAF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Agendamento de Atendimento
                </h1>
                <p className="text-sm text-gray-600">
                  Sistema integrado de agendamento NAF
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="text-sm text-gray-600">
                Etapa {step} de 3: {
                  step === 1 ? 'Dados Pessoais' :
                  step === 2 ? 'Serviço' :
                  'Data e Horário'
                }
              </div>
            </div>
          </div>
        )}

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            {step < 4 && (
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                >
                  Voltar
                </Button>
                <Button 
                  onClick={() => {
                    if (step === 3) {
                      handleSubmit()
                    } else {
                      setStep(step + 1)
                    }
                  }}
                  disabled={
                    (step === 1 && (!appointment.clientName || !appointment.clientEmail || !appointment.clientPhone)) ||
                    (step === 2 && !appointment.serviceType) ||
                    (step === 3 && (!appointment.preferredDate || !appointment.preferredTime)) ||
                    loading
                  }
                >
                  {loading ? 'Processando...' : (step === 3 ? 'Confirmar Agendamento' : 'Próximo')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
