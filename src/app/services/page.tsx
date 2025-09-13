'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import MainNavigation from '@/components/MainNavigation'

interface Service {
  id: string
  name: string
  description: string
  category: string
  requirements?: string
  estimatedDuration?: number
  isActive: boolean
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando serviços...</p>
        </div>
      </div>
    )
  }

  const getCategoryInfo = (cat: string) => {
    switch (cat) {
      case 'CADASTROS_DOCUMENTOS': 
        return { name: '� Cadastros e Documentos', color: 'border-l-blue-500', icon: '📋' }
      case 'IMPOSTO_RENDA': 
        return { name: '💰 Imposto de Renda', color: 'border-l-green-500', icon: '💰' }
      case 'MEI_EMPRESAS': 
        return { name: '🏢 MEI e Empresas', color: 'border-l-purple-500', icon: '🏢' }
      case 'ESOCIAL_TRABALHISTA': 
        return { name: '👥 E-Social e Trabalhista', color: 'border-l-orange-500', icon: '👥' }
      case 'CERTIDOES_CONSULTAS': 
        return { name: '📜 Certidões e Consultas', color: 'border-l-yellow-500', icon: '📜' }
      case 'PAGAMENTOS_PARCELAMENTOS': 
        return { name: '� Pagamentos e Parcelamentos', color: 'border-l-red-500', icon: '💳' }
      case 'COMERCIO_EXTERIOR': 
        return { name: '🌍 Comércio Exterior', color: 'border-l-cyan-500', icon: '🌍' }
      case 'ISENCOES_ESPECIAIS': 
        return { name: '⭐ Isenções Especiais', color: 'border-l-pink-500', icon: '⭐' }
      case 'RURAL_ITR': 
        return { name: '🌾 Área Rural e ITR', color: 'border-l-emerald-500', icon: '🌾' }
      case 'ACESSO_DIGITAL': 
        return { name: '🔐 Acesso Digital', color: 'border-l-indigo-500', icon: '�' }
      case 'PREVIDENCIA_TRABALHISTA': 
        return { name: '⚖️ Previdência e Trabalhista', color: 'border-l-slate-500', icon: '⚖️' }
      case 'REGULARIZACAO_FISCAL': 
        return { name: '� Regularização Fiscal', color: 'border-l-teal-500', icon: '🔧' }
      case 'SIMPLES_MEI': 
        return { name: '📊 Simples Nacional e MEI', color: 'border-l-violet-500', icon: '📊' }
      case 'AREA_RURAL': 
        return { name: '🚜 Área Rural', color: 'border-l-lime-500', icon: '🚜' }
      case 'INTERNACIONAL': 
        return { name: '🌎 Área Internacional', color: 'border-l-sky-500', icon: '🌎' }
      case 'PESSOA_JURIDICA': 
        return { name: '🏛️ Pessoa Jurídica', color: 'border-l-amber-500', icon: '🏛️' }
      case 'PROCESSOS_ADMINISTRATIVOS': 
        return { name: '⚖️ Processos Administrativos', color: 'border-l-rose-500', icon: '⚖️' }
      case 'ATENDIMENTO_PRESENCIAL': 
        return { name: '🏪 Atendimento Presencial', color: 'border-l-gray-500', icon: '🏪' }
      default: 
        return { name: cat, color: 'border-l-gray-500', icon: '📋' }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Main Navigation */}
      <MainNavigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Serviços NAF
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça todos os serviços oferecidos pelo Núcleo de Apoio Contábil Fiscal.
            Todos os atendimentos são gratuitos e realizados por estudantes supervisionados por professores.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{services.length}</div>
              <p className="text-sm text-gray-600">Serviços Disponíveis</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {services.filter(s => s.category === 'TRIBUTARIO').length}
              </div>
              <p className="text-sm text-gray-600">Serviços Tributários</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {services.filter(s => s.category === 'EMPRESARIAL').length}
              </div>
              <p className="text-sm text-gray-600">Serviços Empresariais</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {services.filter(s => s.category === 'DOCUMENTOS').length}
              </div>
              <p className="text-sm text-gray-600">Documentação</p>
            </CardContent>
          </Card>
        </div>

        {/* Banner dos Serviços NAF Oficiais */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0 mb-12">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🏛️ Serviços NAF Oficiais</h2>
                <p className="text-blue-100 mb-4">
                  Conheça todos os 45+ serviços fiscais oficiais do NAF com procedimentos detalhados, 
                  documentação necessária e orientações completas para pessoas físicas de baixa renda, MEI, OSC e pequenos proprietários rurais.
                </p>
                <Link href="/naf-services">
                  <Button variant="secondary" size="lg" className="text-blue-800">
                    Ver Catálogo Completo →
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="text-6xl opacity-50">🏛️</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Serviços por Categoria */}
        {['TRIBUTARIO', 'EMPRESARIAL', 'DOCUMENTOS', 'TRABALHISTA'].map(category => {
          const categoryServices = services.filter(s => s.category === category)
          
          if (categoryServices.length === 0) return null

          const categoryInfo = getCategoryInfo(category)

          return (
            <section key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {categoryInfo.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map((service) => (
                  <Card key={service.id} className={`hover:shadow-lg transition-shadow border-l-4 ${categoryInfo.color}`}>
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-blue-600 text-xl">{categoryInfo.icon}</span>
                      </div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {service.requirements && (
                        <div className="mb-4 p-3 bg-gray-50 rounded">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            📋 Documentos necessários:
                          </p>
                          <p className="text-sm text-gray-600">{service.requirements}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            ⏱️ {service.estimatedDuration || 30} min
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            service.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {service.isActive ? '✅ Disponível' : '❌ Indisponível'}
                          </span>
                        </div>
                        
                        {service.isActive && (
                          <Link href="/login">
                            <Button size="sm">
                              Solicitar
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )
        })}

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum serviço encontrado. Entre em contato conosco para mais informações.</p>
          </div>
        )}

        {/* Informações sobre o processo */}
        <section className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Como funciona o atendimento?</CardTitle>
              <CardDescription className="text-center">
                Entenda o processo completo de atendimento no NAF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Solicite o Serviço</h3>
                  <p className="text-sm text-gray-600">
                    Escolha o serviço e preencha sua solicitação com os detalhes necessários
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Agende o Atendimento</h3>
                  <p className="text-sm text-gray-600">
                    Receba seu protocolo e agende o atendimento presencial ou online
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-600 font-bold">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Receba Orientação</h3>
                  <p className="text-sm text-gray-600">
                    Nossos estudantes e professores irão orientá-lo em todo o processo
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">4</span>
                  </div>
                  <h3 className="font-medium mb-2">Acompanhe o Progresso</h3>
                  <p className="text-sm text-gray-600">
                    Acompanhe o status da sua solicitação até a conclusão completa
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-12">
          <Card className="bg-blue-50">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Precisa de ajuda com questões fiscais e contábeis?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Nosso NAF oferece atendimento gratuito para pessoas físicas e microempresas.
                Faça seu agendamento e receba orientação especializada.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/login">
                  <Button size="lg">
                    Solicitar Atendimento
                  </Button>
                </Link>
                <Link href="/schedule">
                  <Button size="lg" variant="outline">
                    Agendar Visita
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
