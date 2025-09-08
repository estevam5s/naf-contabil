'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  FileText, 
  Building2, 
  Users, 
  Scale,
  Download,
  Calendar,
  CheckCircle
} from 'lucide-react'

interface LegislationItem {
  id: string
  title: string
  description: string
  scope: 'FEDERAL' | 'ESTADUAL' | 'MUNICIPAL'
  category: string
  url?: string
  lastUpdated: string
  steps?: string[]
  documents?: string[]
}

export default function FiscalGuidesPage() {
  const [legislations, setLegislations] = useState<LegislationItem[]>([])
  const [filteredLegislations, setFilteredLegislations] = useState<LegislationItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedScope, setSelectedScope] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)

  const fiscalGuides = [
    {
      id: 'cpf-guide',
      title: 'Cadastro de CPF - Guia Completo',
      description: 'Procedimentos para inscrição, alteração e regularização de CPF',
      scope: 'FEDERAL' as const,
      category: 'Cadastros',
      lastUpdated: '2024-01-15',
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
      scope: 'FEDERAL' as const,
      category: 'Microempreendedor',
      lastUpdated: '2024-01-10',
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
      scope: 'FEDERAL' as const,
      category: 'Imposto de Renda',
      lastUpdated: '2024-02-01',
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
      scope: 'FEDERAL' as const,
      category: 'Rural',
      lastUpdated: '2024-01-20',
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
      scope: 'FEDERAL' as const,
      category: 'Empresarial',
      lastUpdated: '2024-01-05',
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
      scope: 'FEDERAL' as const,
      category: 'Trabalhista',
      lastUpdated: '2024-01-12',
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
    }
  ]

  const municipalGuides = [
    {
      id: 'alvara-municipal',
      title: 'Alvará de Funcionamento Municipal',
      description: 'Como obter licença municipal para funcionamento',
      scope: 'MUNICIPAL' as const,
      category: 'Licenças',
      lastUpdated: '2024-01-08',
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
      scope: 'MUNICIPAL' as const,
      category: 'Tributos Municipais',
      lastUpdated: '2024-01-15',
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
    }
  ]

  const stateGuides = [
    {
      id: 'icms-estadual',
      title: 'ICMS - Imposto sobre Circulação de Mercadorias',
      description: 'Orientações sobre ICMS estadual',
      scope: 'ESTADUAL' as const,
      category: 'Tributos Estaduais',
      lastUpdated: '2024-01-10',
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

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      const allGuides = [...fiscalGuides, ...municipalGuides, ...stateGuides]
      setLegislations(allGuides)
      setFilteredLegislations(allGuides)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = legislations

    if (selectedScope !== 'ALL') {
      filtered = filtered.filter(item => item.scope === selectedScope)
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLegislations(filtered)
  }, [searchTerm, selectedScope, legislations])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando guias fiscais...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">NAF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Guias Fiscais NAF
                </h1>
              </div>
            </Link>
            <div className="flex space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/schedule">
                <Button>Agendar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Guias Fiscais e Legislação
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Acesse orientações detalhadas sobre procedimentos fiscais federais, estaduais e municipais.
            Guias passo a passo para facilitar o cumprimento das obrigações.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por tema, procedimento ou categoria..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedScope === 'ALL' ? 'default' : 'outline'}
                onClick={() => setSelectedScope('ALL')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={selectedScope === 'FEDERAL' ? 'default' : 'outline'}
                onClick={() => setSelectedScope('FEDERAL')}
                size="sm"
              >
                Federal
              </Button>
              <Button
                variant={selectedScope === 'ESTADUAL' ? 'default' : 'outline'}
                onClick={() => setSelectedScope('ESTADUAL')}
                size="sm"
              >
                Estadual
              </Button>
              <Button
                variant={selectedScope === 'MUNICIPAL' ? 'default' : 'outline'}
                onClick={() => setSelectedScope('MUNICIPAL')}
                size="sm"
              >
                Municipal
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLegislations.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getScopeColor(guide.scope)} flex items-center gap-1`}>
                        {getScopeIcon(guide.scope)}
                        {guide.scope}
                      </Badge>
                      <Badge variant="outline">{guide.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <CardDescription className="mt-2">{guide.description}</CardDescription>
                  </div>
                  <BookOpen className="h-6 w-6 text-blue-600 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="steps" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="steps">Procedimentos</TabsTrigger>
                    <TabsTrigger value="docs">Documentos</TabsTrigger>
                  </TabsList>
                  <TabsContent value="steps" className="mt-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Passo a passo:</h4>
                      <ol className="space-y-2">
                        {guide.steps?.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-sm text-gray-600">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </TabsContent>
                  <TabsContent value="docs" className="mt-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Documentos necessários:</h4>
                      <ul className="space-y-2">
                        {guide.documents?.map((doc, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 flex flex-col sm:flex-row gap-2">
                  <Link href="/schedule" className="flex-1">
                    <Button size="sm" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Orientação
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Guia
                  </Button>
                  {guide.url && (
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Portal Oficial
                    </Button>
                  )}
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Última atualização: {new Date(guide.lastUpdated).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLegislations.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum guia encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou termo de busca
            </p>
          </div>
        )}

        {/* Quick Links */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <CardContent className="py-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Precisa de Orientação Personalizada?
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  Agende atendimento gratuito com nossa equipe de estudantes e professores
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/schedule">
                    <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                      <Calendar className="h-5 w-5 mr-2" />
                      Agendar Atendimento
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                      Ver Todos os Serviços
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
