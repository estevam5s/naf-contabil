import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calculator, FileText, Users, ArrowRight, Phone, Shield, TrendingUp, Clock, MapPin, Mail, Calendar, BookOpen, BarChart3, UserCheck, Zap, Facebook, Instagram, Linkedin } from 'lucide-react'
import NAFServicesShowcase from "@/components/NAFServicesShowcase"
import NotificationCenter from '@/components/notifications/NotificationCenter'

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
    { icon: MapPin, label: "Endereço", value: "Campus Universitário - NAF" },
    { icon: Phone, label: "Telefone", value: "(XX) XXXX-XXXX" },
    { icon: Mail, label: "Email", value: "naf@instituicao.edu.br" },
    { icon: Calendar, label: "Horário", value: "Seg-Sex: 8h às 17h" }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NAF Contábil</h1>
                <p className="text-sm text-gray-600">Núcleo de Apoio Contábil e Fiscal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <NotificationCenter userId="guest-user" userType="user" />

              <Link href="/login">
                <Button variant="outline" size="sm">Entrar</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Acessar Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Núcleo de Apoio Contábil e Fiscal
            <span className="text-blue-600 block">Atendimento Gratuito</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Oferecemos orientação fiscal e contábil e gratuita para pessoas físicas, microempreendedores individuais, 
            pequenos proprietários rurais e organizações da sociedade civil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/naf-scheduling">
              <Button size="lg" className="w-full sm:w-auto">
                Agendar Atendimento
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/eligibility">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Verificar Elegibilidade
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Portal de Acesso
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Calculator className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">NAF Contábil</span>
              </div>
              <p className="text-gray-400 text-sm">
                Núcleo de Apoio Contábil e Fiscal - Sistema consolidado e eficiente para gestão e atendimento.
              </p>
              <div className="flex space-x-4 mt-6">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Acesso Rápido</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-gray-400 hover:text-white text-sm">
                  Dashboard Principal
                </Link>
                <Link href="/login" className="block text-gray-400 hover:text-white text-sm">
                  Login
                </Link>
                <Link href="/naf-scheduling" className="block text-gray-400 hover:text-white text-sm">
                  Agendar Atendimento
                </Link>
                <Link href="/services" className="block text-gray-400 hover:text-white text-sm">
                  Nossos Serviços
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <Link href="/privacy-policy" className="block text-gray-400 hover:text-white text-sm">
                  Política de Privacidade
                </Link>
                <Link href="/terms-of-service" className="block text-gray-400 hover:text-white text-sm">
                  Termos de Serviço
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>Email: naf@instituicao.edu.br</p>
                <p>Telefone: (11) 1234-5678</p>
                <p>Endereço: Campus Universitário - NAF</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 NAF Contábil. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
