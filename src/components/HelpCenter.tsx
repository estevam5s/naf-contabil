'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface HelpItem {
  question: string
  answer: string
  category: string
}

interface HelpCenterProps {
  userRole?: string
}

export default function HelpCenter({ userRole = 'USER' }: HelpCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('geral')

  const getHelpItems = (): HelpItem[] => {
    const commonItems = [
      {
        question: "Como agendar um atendimento?",
        answer: "Clique em 'Agendar Atendimento' no dashboard, escolha o serviço desejado, selecione a data e horário disponível. Você receberá uma confirmação por email.",
        category: "geral"
      },
      {
        question: "Quais documentos preciso levar?",
        answer: "Os documentos necessários variam por serviço. Consulte a descrição detalhada de cada serviço ou entre em contato conosco para orientação específica.",
        category: "geral"
      },
      {
        question: "O atendimento é realmente gratuito?",
        answer: "Sim! Todos os serviços do NAF são 100% gratuitos. Somos um programa oficial da Receita Federal em parceria com instituições de ensino.",
        category: "geral"
      },
      {
        question: "Quanto tempo demora um atendimento?",
        answer: "O tempo varia conforme o serviço: orientações simples levam 15-30 minutos, declarações podem levar 60-90 minutos. Sempre informamos a duração estimada.",
        category: "geral"
      }
    ]

    const userItems = [
      {
        question: "Posso ser atendido se não for de baixa renda?",
        answer: "O NAF atende prioritariamente pessoas de baixa renda, MEI, OSC e pequenos proprietários rurais. Entre em contato para verificar sua elegibilidade.",
        category: "usuario"
      },
      {
        question: "Como acompanho minha solicitação?",
        answer: "No dashboard, vá em 'Minhas Demandas' para ver o status de todas as suas solicitações. Você também recebe notificações por email.",
        category: "usuario"
      },
      {
        question: "Posso remarcar meu atendimento?",
        answer: "Sim! Entre em contato conosco ou acesse seu agendamento no sistema para remarcar com pelo menos 24h de antecedência.",
        category: "usuario"
      }
    ]

    const studentItems = [
      {
        question: "Como registro minhas horas de atendimento?",
        answer: "Vá em 'Atendimentos' no dashboard, clique em 'Novo Atendimento' e preencha os dados: horas trabalhadas, descrição e demanda atendida.",
        category: "estudante"
      },
      {
        question: "Quem valida meus atendimentos?",
        answer: "Os professores coordenadores validam seus atendimentos. Eles verificam a qualidade e aderem as horas ao seu histórico acadêmico.",
        category: "estudante"
      },
      {
        question: "Onde encontro material de estudo?",
        answer: "Na seção 'Guias Contábeis' você encontra procedimentos detalhados, legislação atualizada e material de apoio para todos os serviços.",
        category: "estudante"
      }
    ]

    const teacherItems = [
      {
        question: "Como valido atendimentos dos estudantes?",
        answer: "Em 'Atendimentos', você vê todos os atendimentos pendentes de validação. Revise os dados e clique em 'Validar' ou 'Solicitar Correção'.",
        category: "professor"
      },
      {
        question: "Como acompanho o desempenho dos estudantes?",
        answer: "Em 'Analytics' você vê estatísticas detalhadas: horas por estudante, tipos de atendimento, taxa de validação e relatórios de performance.",
        category: "professor"
      }
    ]

    if (userRole === 'STUDENT') {
      return [...commonItems, ...studentItems]
    } else if (userRole === 'TEACHER') {
      return [...commonItems, ...teacherItems]
    } else {
      return [...commonItems, ...userItems]
    }
  }

  const helpItems = getHelpItems()
  const categories = [
    { id: 'geral', name: 'Perguntas Gerais', icon: '❓' },
    { id: 'usuario', name: 'Para Usuários', icon: '👤' },
    { id: 'estudante', name: 'Para Estudantes', icon: '🎓' },
    { id: 'professor', name: 'Para Professores', icon: '👨‍🏫' }
  ].filter(cat => helpItems.some(item => item.category === cat.id))

  const filteredItems = helpItems.filter(item => item.category === selectedCategory)

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="lg"
        >
          <span className="text-2xl">💬</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Card className="w-96 max-h-[80vh] overflow-hidden shadow-xl">
        <CardHeader className="bg-blue-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Central de Ajuda</CardTitle>
              <CardDescription className="text-blue-100">
                Encontre respostas rápidas
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700"
            >
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Categorias */}
          <div className="flex overflow-x-auto border-b">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedCategory === category.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Perguntas e Respostas */}
          <div className="max-h-96 overflow-y-auto">
            {filteredItems.length > 0 ? (
              <div className="space-y-1">
                {filteredItems.map((item, index) => (
                  <details key={index} className="group">
                    <summary className="p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 text-sm">
                          {item.question}
                        </span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </div>
                    </summary>
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <span className="text-2xl block mb-2">🤔</span>
                Nenhuma pergunta encontrada nesta categoria.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t">
            <p className="text-xs text-gray-600 text-center mb-3">
              Não encontrou sua resposta?
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">
                📞 Contato
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                📧 Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
