import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calculator, FileText, Users, ArrowRight, Phone } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Calculator className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">NAF Contábil</h1>
                <p className="text-sm text-gray-600">Núcleo de Apoio Contábil e Fiscal</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href="/login">
                <Button variant="outline" size="sm">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button>Cadastrar-se</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Apoio Contábil e Fiscal
            <span className="block text-blue-600">Gratuito e Profissional</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            O NAF oferece orientação gratuita em serviços contábeis e fiscais para 
            pessoas físicas e jurídicas, prestado por estudantes supervisionados 
            por professores especializados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Solicitar Atendimento
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Acessar Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600">
              Atendimento completo para suas necessidades fiscais e contábeis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Declaração de IR</CardTitle>
                <CardDescription>Orientação completa para Imposto de Renda</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Cadastro CPF/CNPJ</CardTitle>
                <CardDescription>Auxílio em cadastros e regularizações</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">MEI e Simples Nacional</CardTitle>
                <CardDescription>Orientações para microempreendedores</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">2000+</div>
              <div className="text-blue-100">Atendimentos Realizados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Satisfação dos Usuários</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">21</div>
              <div className="text-blue-100">Serviços Disponíveis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24h</div>
              <div className="text-blue-100">Suporte Online</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Calculator className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">NAF Contábil</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>© 2025 NAF Contábil</span>
              <span>•</span>
              <span>Todos os direitos reservados</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
  const services = [
    {
      icon: Calculator,
      title: "Declaração de IR",
      description: "Orientação completa para Imposto de Renda",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: FileText,
      title: "MEI",
      description: "Cadastro e manutenção do Microempreendedor Individual",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Users,
      title: "CPF",
      description: "Inscrição e regularização do CPF",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Phone,
      title: "Orientação Tributária",
      description: "Consultoria sobre questões fiscais",
      color: "bg-orange-100 text-orange-600"
    }
  ]

  const stats = [
    { number: "2000+", label: "Atendimentos Realizados" },
    { number: "95%", label: "Satisfação dos Usuários" },
    { number: "21", label: "Serviços Disponíveis" },
    { number: "24h", label: "Suporte Online" }
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
            <div className="flex space-x-3">
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
            Apoio Contábil e Fiscal
            <span className="text-blue-600 block">Eficaz e Perfeito</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema integrado e consolidado para todos os serviços NAF. 
            Uma plataforma unificada sem redundâncias, com funcionalidades avançadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Acessar Sistema Completo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-4`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/dashboard">
              <Button size="lg">
                Ver Todos os Serviços
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Calculator className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">NAF Contábil</span>
              </div>
              <p className="text-gray-400">
                Núcleo de Apoio Contábil e Fiscal - Sistema consolidado e eficiente.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Acesso Rápido</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-gray-400 hover:text-white">
                  Dashboard Principal
                </Link>
                <Link href="/login" className="block text-gray-400 hover:text-white">
                  Login
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <div className="space-y-2 text-gray-400">
                <p>Email: naf@instituicao.edu.br</p>
                <p>Telefone: (11) 1234-5678</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NAF Contábil. Sistema otimizado e consolidado.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
