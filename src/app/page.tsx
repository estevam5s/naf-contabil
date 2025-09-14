import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calculator, FileText, Users, ArrowRight, Phone, Shield, TrendingUp, Clock, MapPin, Mail, Calendar, BookOpen, BarChart3, UserCheck, Zap, Facebook, Instagram, Linkedin } from 'lucide-react'
import NAFServicesShowcase from "@/components/NAFServicesShowcase"
import MainNavigation from '@/components/MainNavigation'

export default function Home() {
  const services = [
    {
      icon: Calculator,
      title: "Declaração de IR",
      description: "Orientação completa para declaração do Imposto de Renda",
      color: "bg-blue-100 text-blue-600",
      available: true
    },
    {
      icon: FileText,
      title: "Cadastro de CPF",
      description: "Inscrição, alteração e regularização de CPF",
      color: "bg-green-100 text-green-600",
      available: true
    },
    {
      icon: Users,
      title: "E-Social Doméstico",
      description: "Cadastro e gestão de empregados domésticos",
      color: "bg-purple-100 text-purple-600",
      available: true
    },
    {
      icon: Phone,
      title: "Orientação MEI",
      description: "Abertura e gestão de Microempreendedor Individual",
      color: "bg-orange-100 text-orange-600",
      available: true
    },
    {
      icon: Shield,
      title: "Certidões Negativas",
      description: "Emissão de certidões de regularidade fiscal",
      color: "bg-red-100 text-red-600",
      available: true
    },
    {
      icon: TrendingUp,
      title: "Parcelamento de Débitos",
      description: "Orientação sobre parcelamento tributário",
      color: "bg-indigo-100 text-indigo-600",
      available: true
    }
  ]

  const stats = [
    { number: "2000+", label: "Atendimentos Realizados", icon: Users },
    { number: "95%", label: "Satisfação dos Usuários", icon: TrendingUp },
    { number: "21", label: "Serviços Disponíveis", icon: FileText },
    { number: "24h", label: "Suporte Online", icon: Clock }
  ]

  const contactInfo = [
    { icon: MapPin, label: "Endereço", value: "Faculdade Estácio Florianópolis - NAF" },
    { icon: Phone, label: "Telefone", value: "(48) 98461-4449" },
    { icon: Mail, label: "Email", value: "naf@estacio.br" },
    { icon: Calendar, label: "Horário", value: "Seg-Sex: 8h às 17h" }
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Main Navigation */}
      <MainNavigation />

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            NAF Estácio Florianópolis
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
            Núcleo de Apoio Contábil e Fiscal
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-4xl mx-auto">
            Faculdade Estácio Florianópolis oferece orientação fiscal e contábil gratuita para
            pessoas físicas, microempreendedores individuais, pequenos proprietários
            rurais e organizações da sociedade civil.
          </p>

          {/* Contact Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Phone className="h-5 w-5 text-amber-600" />
              <span className="font-medium text-amber-800">Contato: (48) 98461-4449</span>
            </div>
            <p className="text-sm text-amber-700 mt-2">
              Entre em contato pelo telefone <strong>(48) 98461-4449</strong> ou agende online.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/naf-scheduling">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                Agendar Atendimento
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/eligibility">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50">
                Verificar Elegibilidade
              </Button>
            </Link>
            <Link href="/fiscal-guides">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Perguntas Frequentes
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sobre o NAF Estácio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Principais Serviços
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Acesse todos os serviços através do nosso dashboard unificado
            </p>
          </div>
          
          <NAFServicesShowcase />
          
          <div className="text-center mt-12">
            <Link href="/services">
              <Button size="lg">
                Ver Todos os Serviços NAF
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Acesso Rápido
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Portais dedicados para cada tipo de usuário
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Link href="/student-portal">
              <Card className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <UserCheck className="h-12 w-12 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Portal do Estudante</h3>
                  <p className="text-blue-100 text-sm">Gerencie suas atividades e treinamentos</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/coordinator-dashboard">
              <Card className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Dashboard Coordenador</h3>
                  <p className="text-blue-100 text-sm">Métricas e análises avançadas</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/fiscal-guides">
              <Card className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Guias Fiscais</h3>
                  <p className="text-blue-100 text-sm">Legislações e procedimentos</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/naf-login">
              <Card className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Zap className="h-12 w-12 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Gestão NAF</h3>
                  <p className="text-blue-100 text-sm">Controle completo de operações</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Plataforma Consolidada
            </h2>
            <p className="text-xl text-gray-600">
              Sistema otimizado sem redundâncias e com integração perfeita
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Sistema Unificado</h3>
              <p className="text-gray-600">
                Todas as funcionalidades em um só lugar. Dashboard consolidado com navegação eficiente.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Analytics Avançado</h3>
              <p className="text-gray-600">
                Relatórios e visualizações completas com integração Power BI nativa.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Eficiência Total</h3>
              <p className="text-gray-600">
                Zero redundâncias, navegação otimizada e todas as integrações funcionando perfeitamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Entre em Contato
            </h2>
            <p className="text-xl text-blue-100">
              Estamos aqui para ajudar com seus problemas contábeis e fiscais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((contact, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <contact.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg mb-2">{contact.label}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {contact.value}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/schedule">
              <Button size="lg" variant="secondary">
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Atendimento
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <Calculator className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">NAF Estácio Florianópolis</h2>
                  <p className="text-blue-300 text-sm font-medium">Núcleo de Apoio Contábil e Fiscal</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
                Faculdade Estácio Florianópolis oferece orientação fiscal e contábil gratuita para
                pessoas físicas, microempreendedores individuais, pequenos proprietários rurais
                e organizações da sociedade civil.
              </p>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 backdrop-blur rounded-lg p-3 border border-white/10">
                  <div className="text-blue-400 text-xl font-bold">2000+</div>
                  <div className="text-gray-400 text-xs">Atendimentos</div>
                </div>
                <div className="bg-white/5 backdrop-blur rounded-lg p-3 border border-white/10">
                  <div className="text-green-400 text-xl font-bold">95%</div>
                  <div className="text-gray-400 text-xs">Satisfação</div>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-3">
                <Link href="#" className="bg-white/5 hover:bg-blue-600 p-3 rounded-lg transition-all duration-300 hover:scale-105">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="bg-white/5 hover:bg-pink-600 p-3 rounded-lg transition-all duration-300 hover:scale-105">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="bg-white/5 hover:bg-blue-700 p-3 rounded-lg transition-all duration-300 hover:scale-105">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                Serviços
              </h3>
              <div className="space-y-3">
                <Link href="/services" className="block text-gray-300 hover:text-blue-400 text-sm transition-colors group">
                  <span className="group-hover:translate-x-1 inline-block transition-transform">→ Declaração de IR</span>
                </Link>
                <Link href="/services" className="block text-gray-300 hover:text-blue-400 text-sm transition-colors group">
                  <span className="group-hover:translate-x-1 inline-block transition-transform">→ Cadastro de CPF</span>
                </Link>
                <Link href="/services" className="block text-gray-300 hover:text-blue-400 text-sm transition-colors group">
                  <span className="group-hover:translate-x-1 inline-block transition-transform">→ Orientação MEI</span>
                </Link>
                <Link href="/services" className="block text-gray-300 hover:text-blue-400 text-sm transition-colors group">
                  <span className="group-hover:translate-x-1 inline-block transition-transform">→ E-Social Doméstico</span>
                </Link>
                <Link href="/services" className="block text-gray-300 hover:text-blue-400 text-sm transition-colors group">
                  <span className="group-hover:translate-x-1 inline-block transition-transform">→ Ver todos os serviços</span>
                </Link>
              </div>
            </div>

            {/* Access */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                Acesso Rápido
              </h3>
              <div className="space-y-3">
                <Link href="/student-portal" className="block text-gray-300 hover:text-green-400 text-sm transition-colors group">
                  <span className="group-hover:translate-x-1 inline-block transition-transform">→ Portal do Estudante</span>
                </Link>
                <Link href="/coordinator-dashboard" className="block text-gray-300 hover:text-green-400 text-sm transition-colors group">
                  <span className="group-hover:translate-x-1 inline-block transition-transform">→ Dashboard Coordenador</span>
                </Link>
                <Link href="/naf-management" className="block text-gray-300 hover:text-green-400 text-sm transition-colors group">
                  <span className="group-hover:translate-x-1 inline-block transition-transform">→ Gestão NAF</span>
                </Link>
                <Link href="/naf-scheduling" className="block text-gray-300 hover:text-green-400 text-sm transition-colors group">
                  <span className="group-hover:translate-x-1 inline-block transition-transform">→ Agendar Atendimento</span>
                </Link>
                <Link href="/fiscal-guides" className="block text-gray-300 hover:text-green-400 text-sm transition-colors group">
                  <span className="group-hover:translate-x-1 inline-block transition-transform">→ Guias Fiscais</span>
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <Phone className="h-5 w-5 text-orange-400" />
                Contato
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Endereço</p>
                    <p className="text-gray-400 text-xs">Faculdade Estácio Florianópolis</p>
                    <p className="text-gray-400 text-xs">Núcleo de Apoio Fiscal - NAF</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Telefone</p>
                    <p className="text-blue-400 text-sm font-semibold">(48) 98461-4449</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Email</p>
                    <p className="text-blue-400 text-sm">naf@estacio.br</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Horário</p>
                    <p className="text-gray-400 text-sm">Seg-Sex: 8h às 17h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <p className="text-gray-400 text-sm">
                  &copy; 2025 NAF Estácio Florianópolis. Todos os direitos reservados.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Política de Privacidade
                </Link>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Termos de Uso
                </Link>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="h-3 w-3" />
                  <span>Site Seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
