import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
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
                  Núcleo de Apoio Contábil Fiscal
                </h1>
                <p className="text-sm text-gray-600">Sistema de Gestão e Atendimento</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Entrar</Button>
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
            <span className="block text-blue-600">para Todos</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            O NAF oferece orientação gratuita em questões fiscais e contábeis para pessoas físicas, 
            microempreendedores individuais e organizações da sociedade civil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" className="w-full sm:w-auto">
                Ver Serviços Disponíveis
              </Button>
            </Link>
            <Link href="/schedule">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Agendar Atendimento
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Principais Serviços Oferecidos
            </h2>
            <p className="text-lg text-gray-600">
              Conheça alguns dos serviços mais demandados do Programa NAF
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-blue-600 text-xl">{service.icon}</span>
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Precisa de Orientação Fiscal?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Nossa equipe de estudantes e professores está pronta para ajudar você.
          </p>
          <Link href="/schedule">
            <Button size="lg" variant="secondary">
              Agendar Atendimento Gratuito
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold">NAF</span>
                </div>
                <span className="font-semibold">Núcleo de Apoio Contábil Fiscal</span>
              </div>
              <p className="text-gray-400">
                Prestando serviços gratuitos de orientação fiscal e contábil para a comunidade.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Serviços</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Cadastro CPF/CNPJ</li>
                <li>Orientação Imposto de Renda</li>
                <li>Microempreendedor Individual</li>
                <li>Comércio Exterior</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: contato@naf.edu.br</li>
                <li>Telefone: (11) 1234-5678</li>
                <li>Endereço: Rua da Universidade, 123</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2025 NAF - Núcleo de Apoio Contábil Fiscal. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

const services = [
  {
    icon: "📋",
    title: "Cadastro de CPF",
    description: "Orientação para cadastro e regularização do Cadastro de Pessoas Físicas"
  },
  {
    icon: "🏢",
    title: "Cadastro de CNPJ",
    description: "Auxílio no Cadastro Nacional de Pessoas Jurídicas"
  },
  {
    icon: "💰",
    title: "Imposto de Renda PF",
    description: "Orientação sobre declaração do Imposto de Renda Pessoa Física"
  },
  {
    icon: "🏪",
    title: "Microempreendedor Individual",
    description: "Orientações fiscais específicas para MEI"
  },
  {
    icon: "🌐",
    title: "Comércio Exterior",
    description: "Orientação sobre importação, exportação e bagagens"
  },
  {
    icon: "📄",
    title: "Certidões Negativas",
    description: "Emissão de certidões da Receita Federal e Procuradoria"
  }
]
