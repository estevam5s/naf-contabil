'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SchedulePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Aqui será implementada a lógica de agendamento
    setTimeout(() => {
      setIsLoading(false)
      alert('Agendamento solicitado com sucesso! Entraremos em contato para confirmação.')
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
                  Núcleo de Apoio Contábil Fiscal
                </h1>
              </div>
            </Link>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/services">
                <Button variant="outline">Serviços</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Agendar Atendimento
          </h1>
          <p className="text-lg text-gray-600">
            Preencha o formulário abaixo para solicitar um agendamento. 
            Nossa equipe entrará em contato para confirmar data e horário.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Solicitação de Agendamento</CardTitle>
            <CardDescription>
              Todos os atendimentos são gratuitos e realizados por estudantes supervisionados por professores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Informações Pessoais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nome Completo *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Telefone *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Detalhes do Serviço */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Detalhes do Atendimento</h3>
                
                <div className="space-y-2">
                  <label htmlFor="service" className="text-sm font-medium">
                    Serviço Solicitado *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Selecione um serviço</option>
                    <option value="cpf">Cadastro de CPF</option>
                    <option value="cnpj">Cadastro de CNPJ</option>
                    <option value="irpf">Imposto de Renda Pessoa Física</option>
                    <option value="mei">Microempreendedor Individual</option>
                    <option value="comercio-exterior">Comércio Exterior</option>
                    <option value="certidoes">Certidões Negativas</option>
                    <option value="parcelamento">Parcelamento de Débitos</option>
                    <option value="ditr">DITR - Declaração ITR</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="preferredDate" className="text-sm font-medium">
                      Data Preferencial
                    </label>
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="preferredTime" className="text-sm font-medium">
                      Horário Preferencial
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Selecione um horário</option>
                      <option value="08:00">08:00</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Descrição do Problema/Dúvida
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Descreva brevemente sua dúvida ou o tipo de orientação que precisa..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Informações Importantes */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📋 Informações Importantes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• O agendamento não garante a confirmação do atendimento</li>
                  <li>• Entraremos em contato em até 48 horas para confirmar</li>
                  <li>• Traga documentos relacionados ao seu caso</li>
                  <li>• Os atendimentos são realizados por alunos supervisionados</li>
                  <li>• Todos os serviços são gratuitos</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando solicitação...' : 'Solicitar Agendamento'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Links Úteis */}
        <div className="mt-8 text-center space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Links Úteis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="https://forms.office.com/r/cP587keka4" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                📋 Ficha de Serviço Prestado
              </a>
              <a 
                href="https://forms.office.com/r/vxrTv2CfbW" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                ⭐ Registro de Boas Práticas
              </a>
            </div>
          </div>
          
          <Link href="/" className="text-blue-600 hover:underline">
            ← Voltar ao início
          </Link>
        </div>
      </main>
    </div>
  )
}
