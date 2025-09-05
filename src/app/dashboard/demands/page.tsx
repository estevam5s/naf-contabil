'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function DemandsPage() {
  const [showNewDemandForm, setShowNewDemandForm] = useState(false)
  const [demandForm, setDemandForm] = useState({
    title: '',
    description: '',
    category: '',
    theme: '',
    subTheme: '',
    priority: 'MEDIA',
    estimatedHours: '',
    dueDate: ''
  })

  const [demands] = useState([
    {
      id: '1',
      protocol: 'NAF-2025-0001',
      title: 'Orientação MEI - Emissão DAS',
      description: 'Cliente precisa de orientação para emitir DAS do MEI em atraso',
      category: 'MEI',
      theme: 'Emissão de Documentos',
      status: 'EM_ANDAMENTO',
      priority: 'ALTA',
      requestedAt: '2025-09-04T08:30:00Z',
      assignedTo: 'João Silva',
      estimatedHours: 2,
      actualHours: 1.5
    },
    {
      id: '2',
      protocol: 'NAF-2025-0002',
      title: 'Cadastro CPF - Regularização',
      description: 'Regularização de CPF suspenso por falta de declaração IR',
      category: 'Cadastros',
      theme: 'CPF',
      status: 'VALIDADA',
      priority: 'MEDIA',
      requestedAt: '2025-09-03T14:15:00Z',
      assignedTo: 'Maria Santos',
      estimatedHours: 1,
      actualHours: 1
    }
  ])

  const handleSubmitDemand = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria a lógica para criar nova demanda
    console.log('Nova demanda:', demandForm)
    setShowNewDemandForm(false)
    // Reset form
    setDemandForm({
      title: '',
      description: '',
      category: '',
      theme: '',
      subTheme: '',
      priority: 'MEDIA',
      estimatedHours: '',
      dueDate: ''
    })
  }

  const generateProtocol = () => {
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const day = String(new Date().getDate()).padStart(2, '0')
    const time = String(new Date().getTime()).slice(-4)
    return `NAF-${year}-${month}${day}${time}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <span>←</span>
                <span>Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Gestão de Demandas</h1>
            </div>
            <Button onClick={() => setShowNewDemandForm(true)}>
              <span className="mr-2">➕</span>
              Nova Demanda
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nova Demanda Form */}
        {showNewDemandForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Nova Demanda</CardTitle>
              <CardDescription>
                Protocolo será gerado automaticamente: {generateProtocol()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitDemand} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da Demanda *
                    </label>
                    <Input
                      value={demandForm.title}
                      onChange={(e) => setDemandForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Orientação MEI - Emissão DAS"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <select
                      value={demandForm.category}
                      onChange={(e) => setDemandForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="MEI">MEI</option>
                      <option value="Cadastros">Cadastros</option>
                      <option value="Imposto de Renda">Imposto de Renda</option>
                      <option value="Certidões">Certidões</option>
                      <option value="Comércio Exterior">Comércio Exterior</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tema *
                    </label>
                    <select
                      value={demandForm.theme}
                      onChange={(e) => setDemandForm(prev => ({ ...prev, theme: e.target.value }))}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione um tema</option>
                      <option value="Emissão de Documentos">Emissão de Documentos</option>
                      <option value="Cadastro/Regularização">Cadastro/Regularização</option>
                      <option value="Orientação Fiscal">Orientação Fiscal</option>
                      <option value="Declarações">Declarações</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={demandForm.priority}
                      onChange={(e) => setDemandForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="BAIXA">Baixa</option>
                      <option value="MEDIA">Média</option>
                      <option value="ALTA">Alta</option>
                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horas Estimadas
                    </label>
                    <Input
                      type="number"
                      step="0.5"
                      value={demandForm.estimatedHours}
                      onChange={(e) => setDemandForm(prev => ({ ...prev, estimatedHours: e.target.value }))}
                      placeholder="2.0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição Detalhada *
                  </label>
                  <textarea
                    value={demandForm.description}
                    onChange={(e) => setDemandForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descreva em detalhes a demanda, incluindo contexto e o que precisa ser feito..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Limite (Opcional)
                  </label>
                  <Input
                    type="date"
                    value={demandForm.dueDate}
                    onChange={(e) => setDemandForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="submit">
                    Criar Demanda
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowNewDemandForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Input placeholder="Buscar por protocolo ou título..." className="max-w-xs" />
              <select className="h-10 px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Todas as categorias</option>
                <option value="MEI">MEI</option>
                <option value="Cadastros">Cadastros</option>
                <option value="Imposto de Renda">Imposto de Renda</option>
              </select>
              <select className="h-10 px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Todos os status</option>
                <option value="ABERTA">Aberta</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="VALIDADA">Validada</option>
                <option value="CONCLUIDA">Concluída</option>
              </select>
              <Button variant="outline">
                🔍 Filtrar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Demandas */}
        <div className="space-y-4">
          {demands.map((demand) => (
            <Card key={demand.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-mono text-sm font-medium text-blue-600">
                        {demand.protocol}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        demand.status === 'VALIDADA' ? 'bg-green-100 text-green-800' :
                        demand.status === 'EM_ANDAMENTO' ? 'bg-blue-100 text-blue-800' :
                        demand.status === 'ABERTA' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {demand.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        demand.priority === 'ALTA' ? 'bg-red-100 text-red-800' :
                        demand.priority === 'MEDIA' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {demand.priority}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {demand.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3">
                      {demand.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Categoria:</span>
                        <p className="text-gray-600">{demand.category}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Tema:</span>
                        <p className="text-gray-600">{demand.theme}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Atendente:</span>
                        <p className="text-gray-600">{demand.assignedTo}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Horas:</span>
                        <p className="text-gray-600">{demand.actualHours}h / {demand.estimatedHours}h</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button size="sm" variant="outline">
                      👁️ Ver Detalhes
                    </Button>
                    <Button size="sm" variant="outline">
                      💬 Chat
                    </Button>
                    <Button size="sm" variant="outline">
                      🔄 Transferir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Paginação */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">← Anterior</Button>
            <Button variant="outline" size="sm">1</Button>
            <Button size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Próximo →</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
