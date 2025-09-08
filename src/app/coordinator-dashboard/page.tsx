'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Download, 
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Target
} from 'lucide-react'

interface MetricData {
  period: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
}

interface ServiceMetrics {
  name: string
  requests: number
  completed: number
  pending: number
  avgDuration: number
  satisfaction: number
}

export default function CoordinatorDashboard() {
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('month')

  // Métricas principais
  const mainMetrics = [
    {
      title: 'Atendimentos Mensais',
      value: 1247,
      change: 12.5,
      trend: 'up' as const,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Taxa de Conclusão',
      value: 94.2,
      change: 2.1,
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      suffix: '%'
    },
    {
      title: 'Tempo Médio',
      value: 45.8,
      change: -5.2,
      trend: 'down' as const,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      suffix: ' min'
    },
    {
      title: 'Satisfação',
      value: 4.7,
      change: 0.3,
      trend: 'up' as const,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      suffix: '/5'
    }
  ]

  // Serviços mais demandados
  const topServices: ServiceMetrics[] = [
    {
      name: 'Declaração de IR',
      requests: 324,
      completed: 298,
      pending: 26,
      avgDuration: 52,
      satisfaction: 4.8
    },
    {
      name: 'Cadastro de CPF',
      requests: 287,
      completed: 275,
      pending: 12,
      avgDuration: 35,
      satisfaction: 4.6
    },
    {
      name: 'Orientação MEI',
      requests: 245,
      completed: 230,
      pending: 15,
      avgDuration: 48,
      satisfaction: 4.7
    },
    {
      name: 'E-Social Doméstico',
      requests: 198,
      completed: 186,
      pending: 12,
      avgDuration: 65,
      satisfaction: 4.5
    },
    {
      name: 'Certidões Negativas',
      requests: 156,
      completed: 149,
      pending: 7,
      avgDuration: 28,
      satisfaction: 4.9
    }
  ]

  // Dados para gráficos
  const weeklyData = [
    { day: 'Seg', atendimentos: 45, agendamentos: 52 },
    { day: 'Ter', atendimentos: 38, agendamentos: 41 },
    { day: 'Qua', atendimentos: 52, agendamentos: 47 },
    { day: 'Qui', atendimentos: 48, agendamentos: 55 },
    { day: 'Sex', atendimentos: 61, agendamentos: 58 },
    { day: 'Sáb', atendimentos: 23, agendamentos: 28 }
  ]

  const publicoAlvo = [
    { categoria: 'Pessoas Físicas Hipossuficientes', quantidade: 542, percentual: 45.2 },
    { categoria: 'Microempreendedores Individuais', quantidade: 387, percentual: 32.3 },
    { categoria: 'Pequenos Proprietários Rurais', quantidade: 198, percentual: 16.5 },
    { categoria: 'Organizações da Sociedade Civil', quantidade: 72, percentual: 6.0 }
  ]

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const exportReport = (type: string) => {
    // Simular exportação de relatório
    console.log(`Exportando relatório: ${type}`)
    // Aqui seria implementada a lógica real de exportação
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard do Coordenador
              </h1>
              <p className="text-gray-600">
                Acompanhe métricas e performance do NAF
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Ano</option>
              </select>
              <Button onClick={() => exportReport('geral')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainMetrics.map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.value.toLocaleString('pt-BR')}
                        {metric.suffix || ''}
                      </p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className={`h-4 w-4 ${
                          metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        }`} />
                        <span className={`text-sm ml-1 ${
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="students">Estudantes</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Atendimentos Semanais */}
              <Card>
                <CardHeader>
                  <CardTitle>Atendimentos por Dia da Semana</CardTitle>
                  <CardDescription>
                    Distribuição de atendimentos vs agendamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-8 text-sm font-medium">{day.day}</div>
                        <div className="flex-1 flex space-x-2">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Realizados</span>
                              <span>{day.atendimentos}</span>
                            </div>
                            <Progress value={(day.atendimentos / 65) * 100} className="h-2" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Agendados</span>
                              <span>{day.agendamentos}</span>
                            </div>
                            <Progress 
                              value={(day.agendamentos / 65) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Público-Alvo */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição do Público-Alvo</CardTitle>
                  <CardDescription>
                    Categorias atendidas pelo NAF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {publicoAlvo.map((categoria, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{categoria.categoria}</span>
                          <div className="text-right">
                            <div className="text-sm font-bold">{categoria.quantidade}</div>
                            <div className="text-xs text-gray-500">{categoria.percentual}%</div>
                          </div>
                        </div>
                        <Progress value={categoria.percentual} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertas e Notificações */}
            <Card>
              <CardHeader>
                <CardTitle>Alertas e Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Meta de atendimentos próxima do limite
                      </p>
                      <p className="text-xs text-yellow-600">
                        87% da meta mensal já atingida. Considere ampliar capacidade.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Novo relatório mensal disponível
                      </p>
                      <p className="text-xs text-blue-600">
                        Relatório de performance de outubro já pode ser exportado.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance dos Serviços</CardTitle>
                <CardDescription>
                  Análise detalhada dos serviços mais demandados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topServices.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium">{service.name}</h3>
                        <Badge className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>{service.satisfaction}</span>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Solicitações</p>
                          <p className="font-semibold">{service.requests}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Concluídos</p>
                          <p className="font-semibold text-green-600">{service.completed}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Pendentes</p>
                          <p className="font-semibold text-orange-600">{service.pending}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tempo Médio</p>
                          <p className="font-semibold">{service.avgDuration}min</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress 
                          value={(service.completed / service.requests) * 100} 
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Taxa de conclusão: {((service.completed / service.requests) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance dos Estudantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { nome: 'Ana Silva', atendimentos: 45, avaliacao: 4.8, curso: 'Ciências Contábeis' },
                      { nome: 'João Santos', atendimentos: 42, avaliacao: 4.7, curso: 'Administração' },
                      { nome: 'Maria Costa', atendimentos: 38, avaliacao: 4.9, curso: 'Ciências Contábeis' },
                      { nome: 'Pedro Lima', atendimentos: 35, avaliacao: 4.6, curso: 'Direito' }
                    ].map((student, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{student.nome}</p>
                          <p className="text-sm text-gray-600">{student.curso}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{student.atendimentos} atendimentos</p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            {student.avaliacao}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Capacitação e Treinamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800">Próximo Treinamento</h4>
                      <p className="text-sm text-green-600">
                        "Novas regras do e-Social" - 15/11/2024
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        12 estudantes inscritos
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Temas para próximos treinamentos:</h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex justify-between">
                          <span>• Declaração de IR 2025</span>
                          <Badge variant="outline">Planejado</Badge>
                        </li>
                        <li className="flex justify-between">
                          <span>• Mudanças no MEI</span>
                          <Badge variant="outline">Em análise</Badge>
                        </li>
                        <li className="flex justify-between">
                          <span>• LGPD no atendimento</span>
                          <Badge variant="outline">Aprovado</Badge>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Relatório Mensal',
                  description: 'Consolidado completo do mês',
                  icon: FileText,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-100'
                },
                {
                  title: 'Relatório de Performance',
                  description: 'Métricas de estudantes e serviços',
                  icon: BarChart3,
                  color: 'text-green-600',
                  bgColor: 'bg-green-100'
                },
                {
                  title: 'Relatório Estatístico',
                  description: 'Análise estatística detalhada',
                  icon: PieChart,
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-100'
                },
                {
                  title: 'Relatório de Qualidade',
                  description: 'Avaliações e satisfação',
                  icon: Star,
                  color: 'text-yellow-600',
                  bgColor: 'bg-yellow-100'
                },
                {
                  title: 'Relatório Gerencial',
                  description: 'Visão executiva para gestão',
                  icon: Target,
                  color: 'text-red-600',
                  bgColor: 'bg-red-100'
                },
                {
                  title: 'Relatório de Capacitação',
                  description: 'Treinamentos e desenvolvimento',
                  icon: Users,
                  color: 'text-indigo-600',
                  bgColor: 'bg-indigo-100'
                }
              ].map((report, index) => {
                const IconComponent = report.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${report.bgColor} rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`h-6 w-6 ${report.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{report.title}</h3>
                          <p className="text-sm text-gray-600">{report.description}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => exportReport(report.title)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Gerar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
