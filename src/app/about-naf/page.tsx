'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import MainNavigation from '@/components/MainNavigation'
import {
  Calculator,
  Users,
  Award,
  Target,
  BookOpen,
  GraduationCap,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  Heart,
  Shield,
  TrendingUp,
  Calendar
} from 'lucide-react'

export default function AboutNAF() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Main Navigation */}
      <MainNavigation />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Calculator className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sobre o NAF Estácio Florianópolis
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Núcleo de Apoio Fiscal - Transformando conhecimento em cidadania fiscal
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Missão, Visão e Valores */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossa Identidade
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça os valores e princípios que guiam o NAF Estácio Florianópolis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Promover a educação fiscal e contábil, oferecendo serviços gratuitos de orientação
                  para microempreendedores, pequenas empresas e cidadãos de baixa renda, contribuindo
                  para o desenvolvimento socioeconômico da região.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ser reconhecido como centro de excelência em educação fiscal, formando
                  profissionais qualificados e promovendo a cidadania fiscal na Grande Florianópolis.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-600 space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Ética e transparência
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Responsabilidade social
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Excelência acadêmica
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Inclusão e acessibilidade
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* O que é o NAF */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-none">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    O que é o NAF?
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    O Núcleo de Apoio Fiscal (NAF) é um programa desenvolvido em parceria
                    entre a Receita Federal do Brasil e instituições de ensino superior,
                    que visa promover a educação fiscal e oferecer serviços gratuitos
                    à comunidade.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Na Estácio Florianópolis, o NAF funciona como um laboratório prático
                    onde estudantes de Ciências Contábeis aplicam seus conhecimentos
                    teóricos em situações reais, sempre sob supervisão de professores
                    qualificados.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Educação Fiscal</Badge>
                    <Badge variant="secondary">Responsabilidade Social</Badge>
                    <Badge variant="secondary">Prática Acadêmica</Badge>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">5+</div>
                      <p className="text-sm text-gray-600">Anos de atuação</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">1200+</div>
                      <p className="text-sm text-gray-600">Atendimentos realizados</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">50+</div>
                      <p className="text-sm text-gray-600">Estudantes formados</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-600">4.8</div>
                      <p className="text-sm text-gray-600">Avaliação média</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Serviços Oferecidos */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Serviços Oferecidos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Oferecemos orientação gratuita em diversas áreas fiscais e contábeis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Calculator, title: 'Declaração de IR', desc: 'Orientação para preenchimento do Imposto de Renda' },
              { icon: Building2, title: 'Abertura de CNPJ', desc: 'Auxílio na formalização de microempreendedores' },
              { icon: BookOpen, title: 'Consultoria Fiscal', desc: 'Orientação sobre obrigações tributárias' },
              { icon: Users, title: 'MEI', desc: 'Suporte para Microempreendedor Individual' },
              { icon: Shield, title: 'Planejamento Tributário', desc: 'Estratégias legais de redução de impostos' },
              { icon: Award, title: 'Educação Fiscal', desc: 'Workshops e palestras sobre cidadania fiscal' }
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Nossa Equipe */}
        <section className="mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Nossa Equipe
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Professores Supervisores</h3>
                  <p className="text-gray-600">
                    Professores qualificados do curso de Ciências Contábeis supervisionam
                    todos os atendimentos, garantindo qualidade e precisão nas orientações.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Estudantes Estagiários</h3>
                  <p className="text-gray-600">
                    Estudantes dos últimos períodos do curso de Ciências Contábeis,
                    preparados através de treinamentos específicos para atendimento ao público.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Informações de Contato */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Entre em Contato
                </h2>
                <p className="text-lg opacity-90">
                  Estamos prontos para ajudar você
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Localização</h3>
                  <p className="opacity-90">Estácio Florianópolis<br />Campus Centro</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Phone className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Telefone</h3>
                  <p className="opacity-90">(48) 98461-4449</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Horário</h3>
                  <p className="opacity-90">Segunda a Sexta<br />8h às 18h</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link href="/naf-scheduling">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Calendar className="h-5 w-5 mr-2" />
                    Agendar Atendimento
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
