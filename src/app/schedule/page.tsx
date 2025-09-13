'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import MainNavigation from '@/components/MainNavigation'
import { Calendar, Clock, User, Mail, Phone, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'

interface ServiceTemplate {
  service_type: string
  service_title: string
  service_category: string
  required_fields: string[]
  optional_fields: string[]
  required_documents: string[]
  description: string
  steps: string[]
  important_notes: string[]
  estimated_duration_minutes: number
  complexity_level: string
}

export default function SchedulePage() {
  const [formData, setFormData] = useState({
    // Dados pessoais
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCpf: '',
    clientBirthDate: '',

    // Endereço
    addressStreet: '',
    addressNumber: '',
    addressComplement: '',
    addressNeighborhood: '',
    addressCity: '',
    addressState: '',
    addressZipcode: '',

    // Serviço
    serviceType: '',
    urgencyLevel: 'NORMAL',

    // Agendamento
    preferredDate: '',
    preferredTime: '',
    preferredPeriod: '',

    // Observações
    clientNotes: '',

    // Campos específicos do serviço
    serviceDetails: {} as any
  })

  const [serviceTemplates, setServiceTemplates] = useState<ServiceTemplate[]>([])
  const [selectedService, setSelectedService] = useState<ServiceTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; protocol?: string } | null>(null)

  // Buscar templates de serviços
  useEffect(() => {
    const defaultServices = [
      {
        service_type: 'CPF',
        service_title: 'Cadastro de CPF - Guia Completo',
        service_category: 'Cadastros',
        required_fields: ['nome_completo', 'data_nascimento', 'nome_mae', 'sexo'],
        optional_fields: ['nome_pai', 'titulo_eleitor', 'pis_pasep'],
        required_documents: ['certidao_nascimento_casamento', 'documento_foto', 'comprovante_residencia'],
        description: 'Procedimentos para inscrição, alteração e regularização de CPF',
        steps: ['Verificar documentos necessários', 'Acessar portal da Receita Federal', 'Preencher formulário', 'Aguardar processamento'],
        important_notes: ['Menores de idade precisam estar acompanhados dos responsáveis', 'Documentos devem estar originais e legíveis'],
        estimated_duration_minutes: 45,
        complexity_level: 'FACIL'
      },
      {
        service_type: 'MEI',
        service_title: 'MEI - Formalização e Gestão',
        service_category: 'Microempreendedor',
        required_fields: ['atividade_principal', 'endereco_comercial', 'possui_funcionario'],
        optional_fields: ['telefone_comercial', 'atividades_secundarias'],
        required_documents: ['cpf', 'rg', 'comprovante_residencia', 'titulo_eleitor'],
        description: 'Como abrir, gerir e cumprir obrigações do MEI',
        steps: ['Verificar atividades permitidas', 'Acessar Portal do Empreendedor', 'Preencher dados', 'Obter CNPJ', 'Emitir DAS'],
        important_notes: ['Faturamento anual não pode ultrapassar R$ 81.000', 'Algumas atividades não são permitidas no MEI'],
        estimated_duration_minutes: 60,
        complexity_level: 'MEDIO'
      },
      {
        service_type: 'IR',
        service_title: 'Declaração de Imposto de Renda PF',
        service_category: 'Imposto de Renda',
        required_fields: ['ano_exercicio', 'possui_dependentes', 'valor_rendimentos'],
        optional_fields: ['possui_bens', 'despesas_medicas', 'despesas_educacao'],
        required_documents: ['informes_rendimentos', 'comprovantes_despesas_medicas', 'comprovantes_despesas_educacionais'],
        description: 'Orientações para declaração anual do IR',
        steps: ['Verificar obrigatoriedade', 'Reunir documentos', 'Baixar programa IRPF', 'Preencher declaração', 'Transmitir'],
        important_notes: ['Declaração deve ser enviada até 31 de maio', 'Multa por atraso é de R$ 165,74 mínimo'],
        estimated_duration_minutes: 90,
        complexity_level: 'DIFICIL'
      },
      {
        service_type: 'ITR',
        service_title: 'ITR - Imposto Territorial Rural',
        service_category: 'Rural',
        required_fields: ['area_total_hectares', 'area_aproveitada_hectares', 'municipio_imovel'],
        optional_fields: ['possui_benfeitoria', 'valor_terra_nua', 'possui_cnir'],
        required_documents: ['escritura_imovel', 'cnir', 'comprovantes_benfeitorias', 'documento_area'],
        description: 'Declaração do ITR para propriedades rurais',
        steps: ['Verificar obrigatoriedade', 'Reunir documentos da propriedade', 'Calcular área', 'Preencher DITR', 'Transmitir'],
        important_notes: ['ITR é devido por quem possui imóvel rural em 1º de janeiro', 'Grau de utilização influencia no valor'],
        estimated_duration_minutes: 75,
        complexity_level: 'MEDIO'
      },
      {
        service_type: 'CNPJ',
        service_title: 'Abertura de CNPJ',
        service_category: 'Empresarial',
        required_fields: ['tipo_sociedade', 'atividade_principal', 'capital_social', 'endereco_comercial'],
        optional_fields: ['socios_participacao', 'atividades_secundarias', 'regime_tributario'],
        required_documents: ['contrato_social', 'cpf_rg_socios', 'comprovante_endereco', 'consulta_viabilidade'],
        description: 'Procedimentos para constituição de pessoa jurídica',
        steps: ['Consultar viabilidade do nome', 'Elaborar contrato social', 'Registrar na Junta Comercial', 'Inscrever na Receita Federal'],
        important_notes: ['Nome empresarial deve ser único', 'Capital social mínimo depende do tipo de sociedade'],
        estimated_duration_minutes: 120,
        complexity_level: 'DIFICIL'
      },
      {
        service_type: 'ESOCIAL',
        service_title: 'e-Social Doméstico',
        service_category: 'Trabalhista',
        required_fields: ['cpf_empregado', 'data_admissao', 'salario', 'funcao'],
        optional_fields: ['possui_outros_vinculos', 'jornada_trabalho', 'vale_transporte'],
        required_documents: ['cpf_empregador', 'dados_empregado', 'contrato_trabalho', 'exames_medicos'],
        description: 'Cadastro e gestão de empregados domésticos',
        steps: ['Cadastrar empregador', 'Cadastrar empregado', 'Enviar evento de admissão', 'Gerar guia DAE', 'Enviar folha'],
        important_notes: ['Empregado com mais de 2 dias por semana deve ser registrado', 'DAE deve ser paga até dia 7'],
        estimated_duration_minutes: 60,
        complexity_level: 'MEDIO'
      }
    ]

    setServiceTemplates(defaultServices)
    setIsLoading(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const response = await fetch('/api/fiscal-appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          serviceTitle: selectedService?.service_title || '',
          serviceCategory: selectedService?.service_category || ''
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: 'Agendamento solicitado com sucesso! Entraremos em contato para confirmação.',
          protocol: result.protocol
        })

        // Limpar formulário
        setFormData({
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          clientCpf: '',
          clientBirthDate: '',
          addressStreet: '',
          addressNumber: '',
          addressComplement: '',
          addressNeighborhood: '',
          addressCity: '',
          addressState: '',
          addressZipcode: '',
          serviceType: '',
          urgencyLevel: 'NORMAL',
          preferredDate: '',
          preferredTime: '',
          preferredPeriod: '',
          clientNotes: '',
          serviceDetails: {}
        })
        setSelectedService(null)
      } else {
        setSubmitResult({
          success: false,
          message: result.message || 'Erro ao enviar solicitação. Tente novamente.'
        })
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'Erro de conexão. Verifique sua internet e tente novamente.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Se selecionou um serviço, buscar template
    if (name === 'serviceType') {
      const service = serviceTemplates.find(s => s.service_type === value)
      setSelectedService(service || null)
    }
  }

  const handleServiceDetailChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      serviceDetails: {
        ...prev.serviceDetails,
        [field]: value
      }
    }))
  }

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'FACIL': return 'bg-green-100 text-green-800'
      case 'MEDIO': return 'bg-yellow-100 text-yellow-800'
      case 'DIFICIL': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatFieldName = (fieldName: string) => {
    const translations: Record<string, string> = {
      'nome_completo': 'Nome Completo',
      'data_nascimento': 'Data de Nascimento',
      'nome_mae': 'Nome da Mãe',
      'sexo': 'Sexo',
      'nome_pai': 'Nome do Pai',
      'titulo_eleitor': 'Título de Eleitor',
      'pis_pasep': 'PIS/PASEP',
      'atividade_principal': 'Atividade Principal',
      'endereco_comercial': 'Endereço Comercial',
      'possui_funcionario': 'Possui Funcionário',
      'telefone_comercial': 'Telefone Comercial',
      'atividades_secundarias': 'Atividades Secundárias',
      'ano_exercicio': 'Ano de Exercício',
      'possui_dependentes': 'Possui Dependentes',
      'valor_rendimentos': 'Valor dos Rendimentos',
      'possui_bens': 'Possui Bens',
      'despesas_medicas': 'Despesas Médicas',
      'despesas_educacao': 'Despesas com Educação',
      'area_total_hectares': 'Área Total (hectares)',
      'area_aproveitada_hectares': 'Área Aproveitada (hectares)',
      'municipio_imovel': 'Município do Imóvel',
      'possui_benfeitoria': 'Possui Benfeitorias',
      'valor_terra_nua': 'Valor da Terra Nua',
      'possui_cnir': 'Possui CNIR',
      'tipo_sociedade': 'Tipo de Sociedade',
      'capital_social': 'Capital Social',
      'socios_participacao': 'Sócios e Participação',
      'regime_tributario': 'Regime Tributário',
      'cpf_empregado': 'CPF do Empregado',
      'data_admissao': 'Data de Admissão',
      'salario': 'Salário',
      'funcao': 'Função',
      'possui_outros_vinculos': 'Possui Outros Vínculos',
      'jornada_trabalho': 'Jornada de Trabalho',
      'vale_transporte': 'Vale Transporte'
    }
    return translations[fieldName] || fieldName
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Main Navigation */}
      <MainNavigation />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Agendar Atendimento
          </h1>
          <p className="text-lg text-gray-600">
            Preencha o formulário abaixo para solicitar um agendamento. 
            Nossa equipe entrará em contato para confirmar data e horário.
          </p>
        </div>

        {/* Resultado do Submit */}
        {submitResult && (
          <Alert className={`mb-6 ${submitResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            {submitResult.success ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
            <AlertDescription className={submitResult.success ? 'text-green-700' : 'text-red-700'}>
              {submitResult.message}
              {submitResult.protocol && (
                <div className="mt-2 font-mono text-sm">
                  <strong>Protocolo:</strong> {submitResult.protocol}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Solicitação de Agendamento
            </CardTitle>
            <CardDescription>
              Todos os atendimentos são gratuitos e realizados por estudantes supervisionados por professores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="clientName" className="text-sm font-medium">
                      Nome Completo *
                    </label>
                    <Input
                      id="clientName"
                      name="clientName"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="clientEmail" className="text-sm font-medium">
                      Email *
                    </label>
                    <Input
                      id="clientEmail"
                      name="clientEmail"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.clientEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="clientPhone" className="text-sm font-medium">
                      Telefone *
                    </label>
                    <Input
                      id="clientPhone"
                      name="clientPhone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.clientPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="clientCpf" className="text-sm font-medium">
                      CPF
                    </label>
                    <Input
                      id="clientCpf"
                      name="clientCpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={formData.clientCpf}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Endereço</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="addressCity" className="text-sm font-medium">
                      Cidade *
                    </label>
                    <Input
                      id="addressCity"
                      name="addressCity"
                      type="text"
                      placeholder="Sua cidade"
                      value={formData.addressCity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="addressState" className="text-sm font-medium">
                      Estado *
                    </label>
                    <Select onValueChange={(value) => handleSelectChange('addressState', value)} value={formData.addressState}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Detalhes do Serviço */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Detalhes do Atendimento
                </h3>

                <div className="space-y-2">
                  <label htmlFor="serviceType" className="text-sm font-medium">
                    Serviço Solicitado *
                  </label>
                  <Select onValueChange={(value) => handleSelectChange('serviceType', value)} value={formData.serviceType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTemplates.map((service) => (
                        <SelectItem key={service.service_type} value={service.service_type}>
                          {service.service_title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mostrar detalhes do serviço selecionado */}
                {selectedService && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-blue-900">{selectedService.service_title}</h4>
                      <Badge className={getComplexityColor(selectedService.complexity_level)}>
                        {selectedService.complexity_level}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {selectedService.estimated_duration_minutes}min
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-800">{selectedService.description}</p>

                    {/* Documentos necessários */}
                    <div>
                      <h5 className="font-medium text-blue-900 text-sm mb-2">Documentos necessários:</h5>
                      <ul className="text-xs text-blue-700 space-y-1">
                        {selectedService.required_documents.map((doc, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Campos específicos do serviço */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-blue-900 text-sm">Informações específicas:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedService.required_fields.map((field) => (
                          <div key={field} className="space-y-1">
                            <label className="text-xs font-medium text-blue-800">
                              {formatFieldName(field)} *
                            </label>
                            <Input
                              placeholder={formatFieldName(field)}
                              value={formData.serviceDetails[field] || ''}
                              onChange={(e) => handleServiceDetailChange(field, e.target.value)}
                              className="text-sm"
                              required
                            />
                          </div>
                        ))}
                        {selectedService.optional_fields.map((field) => (
                          <div key={field} className="space-y-1">
                            <label className="text-xs font-medium text-blue-700">
                              {formatFieldName(field)}
                            </label>
                            <Input
                              placeholder={formatFieldName(field)}
                              value={formData.serviceDetails[field] || ''}
                              onChange={(e) => handleServiceDetailChange(field, e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="urgencyLevel" className="text-sm font-medium">
                      Nível de Urgência
                    </label>
                    <Select onValueChange={(value) => handleSelectChange('urgencyLevel', value)} value={formData.urgencyLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a urgência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BAIXA">Baixa</SelectItem>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="ALTA">Alta</SelectItem>
                        <SelectItem value="URGENTE">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="preferredDate" className="text-sm font-medium">
                      Data Preferencial
                    </label>
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="preferredPeriod" className="text-sm font-medium">
                      Período Preferencial
                    </label>
                    <Select onValueChange={(value) => handleSelectChange('preferredPeriod', value)} value={formData.preferredPeriod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MANHA">Manhã (8h-12h)</SelectItem>
                        <SelectItem value="TARDE">Tarde (13h-17h)</SelectItem>
                        <SelectItem value="NOITE">Noite (18h-21h)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="clientNotes" className="text-sm font-medium">
                    Observações Adicionais
                  </label>
                  <textarea
                    id="clientNotes"
                    name="clientNotes"
                    rows={4}
                    placeholder="Descreva brevemente sua dúvida ou informações adicionais relevantes..."
                    value={formData.clientNotes}
                    onChange={handleInputChange}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Informações Importantes */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📋 Informações Importantes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• O agendamento não garante a confirmação do atendimento</li>
                  <li>• Entraremos em contato em até 48 horas para confirmar</li>
                  <li>• Traga documentos relacionados ao seu caso</li>
                  <li>• Os atendimentos são realizados por alunos supervisionados</li>
                  <li>• Todos os serviços são gratuitos</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !formData.serviceType || !formData.clientName || !formData.clientEmail}
              >
                {isSubmitting ? 'Enviando solicitação...' : 'Solicitar Agendamento'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Links Úteis */}
        <div className="mt-8 text-center space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Links Úteis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="https://forms.office.com/r/cP587keka4" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                📋 Ficha de Serviço Prestado
              </a>
              <a 
                href="https://forms.office.com/r/vxrTv2CfbW" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                ⭐ Registro de Boas Práticas
              </a>
            </div>
          </div>
          
          <Link href="/" className="text-blue-600 hover:underline">
            ← Voltar ao início
          </Link>
        </div>
      </main>
    </div>
  )
}
