import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ServicesPage() {
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
                  Núcleo de Apoio Contábil Fiscal
                </h1>
              </div>
            </Link>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Entrar</Button>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Serviços NAF
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça todos os serviços oferecidos pelo Núcleo de Apoio Contábil Fiscal.
            Todos os atendimentos são gratuitos e realizados por estudantes supervisionados por professores.
          </p>
        </div>

        {/* Serviços Principais */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Serviços Fiscais Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-blue-600 text-xl">{service.icon}</span>
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Agendar Atendimento
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Serviços Adicionais */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Serviços Adicionais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <span className="text-green-600 mr-3">{service.icon}</span>
                    {service.title}
                  </CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Formulários Externos */}
        <section className="mb-16">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registros e Formulários</h2>
            <p className="text-gray-600 mb-6">
              Para alguns serviços, utilizamos formulários externos para garantir a melhor experiência e integração.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📋 Ficha de Serviço Prestado</CardTitle>
                  <CardDescription>
                    Registro das assistências prestadas pelo NAF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a 
                    href="https://forms.office.com/r/cP587keka4" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block w-full"
                  >
                    <Button className="w-full">
                      Acessar Formulário
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">⭐ Registro de Boas Práticas</CardTitle>
                  <CardDescription>
                    Compartilhe experiências e boas práticas do NAF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a 
                    href="https://forms.office.com/r/vxrTv2CfbW" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block w-full"
                  >
                    <Button className="w-full">
                      Acessar Formulário
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-blue-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Precisa de Ajuda?
            </h2>
            <p className="text-blue-100 mb-6">
              Nossa equipe está pronta para atendê-lo. Agende seu atendimento ou entre em contato.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/schedule">
                <Button size="lg" variant="secondary">
                  Agendar Atendimento
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Entre em Contato
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

const mainServices = [
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
    icon: "🏡",
    title: "Cadastro de Imóveis Rurais",
    description: "Orientação sobre cadastro relativo aos imóveis rurais"
  },
  {
    icon: "💼",
    title: "CAEPF",
    description: "Cadastro de Atividade Econômica da Pessoa Física"
  },
  {
    icon: "🏗️",
    title: "Cadastro Nacional de Obras",
    description: "CNO - Cadastro Nacional de Obras"
  },
  {
    icon: "💰",
    title: "Imposto de Renda PF",
    description: "Orientação relativa ao imposto de renda da Pessoa Física"
  },
  {
    icon: "🌾",
    title: "DITR",
    description: "Declaração do Imposto sobre a Propriedade Territorial Rural"
  },
  {
    icon: "📄",
    title: "Declaração de Benefícios Fiscais",
    description: "Assistência à Declaração de Benefícios Fiscais (DBF)"
  },
  {
    icon: "🏪",
    title: "Orientação MEI",
    description: "Orientações fiscais ao Microempreendedor Individual"
  },
  {
    icon: "💳",
    title: "Emissão de Documentos",
    description: "Emissão de documentos para pagar tributos da Receita Federal"
  },
  {
    icon: "🌐",
    title: "Comércio Exterior MEI",
    description: "Orientação de Comércio Exterior do MEI e compras internacionais"
  },
  {
    icon: "✈️",
    title: "Bagagens e Encomendas",
    description: "Orientação sobre bagagens em viagens e encomendas internacionais"
  }
]

const additionalServices = [
  {
    icon: "🔍",
    title: "Pesquisa de Débitos Fiscais",
    description: "Pesquisa de débitos fiscais e de regularidade nos cadastros da Receita Federal"
  },
  {
    icon: "📜",
    title: "Certidão Negativa",
    description: "Certidão negativa da Receita Federal e da Procuradoria da Fazenda Nacional"
  },
  {
    icon: "💸",
    title: "Parcelamento de Débitos",
    description: "Parcelamento de débitos tributários da Receita Federal"
  },
  {
    icon: "👥",
    title: "e-Social Doméstico",
    description: "Orientações relativas ao e-Social Doméstico"
  },
  {
    icon: "🏥",
    title: "Isenção por Moléstias Graves",
    description: "Orientação sobre isenção do imposto de renda para portadores de moléstias graves"
  },
  {
    icon: "🚗",
    title: "Isenção IPI/IOF Veículos",
    description: "Isenção do IPI e IOF na aquisição de veículos para PcD, TEA e taxistas"
  },
  {
    icon: "📅",
    title: "Agendamento RF",
    description: "Agendamento para atendimento presencial na Receita Federal"
  },
  {
    icon: "🌐",
    title: "Portal GOV.BR",
    description: "Orientação para acesso aos serviços da Receita Federal via GOV.BR"
  }
]
