'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSession } from 'next-auth/react'

interface TutorialStep {
  id: string
  title: string
  description: string
  icon: string
  action?: string
  href?: string
}

export default function UserOnboarding() {
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Verificar se é a primeira visita do usuário
    const hasSeenTutorial = localStorage.getItem('naf-tutorial-seen')
    if (!hasSeenTutorial && session?.user) {
      setIsVisible(true)
    }
  }, [session])

  const getTutorialSteps = (): TutorialStep[] => {
    const userRole = session?.user?.role

    if (userRole === 'USER') {
      return [
        {
          id: 'welcome',
          title: 'Bem-vindo ao NAF! 👋',
          description: 'O Núcleo de Apoio Contábil e Fiscal oferece assistência gratuita em serviços fiscais. Vamos te mostrar como funciona!',
          icon: '🎯'
        },
        {
          id: 'services',
          title: 'Conheça os Serviços',
          description: 'Temos mais de 45 serviços fiscais disponíveis: CPF, Imposto de Renda, MEI, Certidões e muito mais.',
          icon: '🏛️',
          action: 'Ver Serviços',
          href: '/naf-services'
        },
        {
          id: 'schedule',
          title: 'Agende seu Atendimento',
          description: 'Para usar nossos serviços, você precisa agendar um atendimento. É rápido e totalmente gratuito!',
          icon: '📅',
          action: 'Agendar Agora',
          href: '/schedule'
        },
        {
          id: 'help',
          title: 'Guias e Orientações',
          description: 'Temos guias detalhados com procedimentos passo-a-passo para te ajudar a entender cada serviço.',
          icon: '📖',
          action: 'Ver Guias',
          href: '/guides'
        },
        {
          id: 'support',
          title: 'Suporte e Contatos',
          description: 'Precisa de ajuda? Temos contatos diretos dos órgãos fiscais e suporte do NAF.',
          icon: '📞',
          action: 'Ver Contatos',
          href: '/dashboard/contacts'
        }
      ]
    } else if (userRole === 'STUDENT') {
      return [
        {
          id: 'welcome',
          title: 'Bem-vindo, Estudante! 🎓',
          description: 'Como estudante do NAF, você pode prestar atendimentos e ganhar experiência prática. Vamos começar!',
          icon: '👨‍🎓'
        },
        {
          id: 'attendances',
          title: 'Registrar Atendimentos',
          description: 'Registre as horas de atendimento prestadas e mantenha seu histórico atualizado.',
          icon: '📋',
          action: 'Ver Atendimentos',
          href: '/dashboard/attendances'
        },
        {
          id: 'demands',
          title: 'Gerenciar Demandas',
          description: 'Visualize e gerencie as demandas atribuídas a você. Acompanhe o progresso de cada caso.',
          icon: '📊',
          action: 'Ver Demandas',
          href: '/dashboard/demands'
        },
        {
          id: 'guides',
          title: 'Material de Estudo',
          description: 'Consulte os guias contábeis com procedimentos detalhados e legislação atualizada.',
          icon: '📚',
          action: 'Estudar',
          href: '/guides'
        },
        {
          id: 'validation',
          title: 'Validação dos Professores',
          description: 'Seus atendimentos serão validados pelos professores. Mantenha a qualidade alta!',
          icon: '✅'
        }
      ]
    } else if (userRole === 'TEACHER') {
      return [
        {
          id: 'welcome',
          title: 'Bem-vindo, Professor! 👨‍🏫',
          description: 'Como professor, você supervisiona estudantes e valida atendimentos. Vamos explorar suas ferramentas!',
          icon: '🎯'
        },
        {
          id: 'validation',
          title: 'Validar Atendimentos',
          description: 'Revise e valide os atendimentos realizados pelos estudantes para garantir a qualidade.',
          icon: '✅',
          action: 'Validar',
          href: '/dashboard/attendances'
        },
        {
          id: 'students',
          title: 'Gerenciar Estudantes',
          description: 'Acompanhe o desempenho dos estudantes e oriente-os em casos complexos.',
          icon: '👥',
          action: 'Ver Usuários',
          href: '/dashboard/users'
        },
        {
          id: 'analytics',
          title: 'Analytics e Relatórios',
          description: 'Visualize estatísticas de performance e relatórios detalhados dos atendimentos.',
          icon: '📊',
          action: 'Ver Analytics',
          href: '/dashboard/analytics'
        }
      ]
    } else {
      return [
        {
          id: 'welcome',
          title: 'Bem-vindo ao Sistema NAF! 🏛️',
          description: 'Explore todas as funcionalidades disponíveis para sua função.',
          icon: '🎯'
        }
      ]
    }
  }

  const steps = getTutorialSteps()

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTutorial()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeTutorial = () => {
    localStorage.setItem('naf-tutorial-seen', 'true')
    setIsVisible(false)
  }

  const skipTutorial = () => {
    localStorage.setItem('naf-tutorial-seen', 'true')
    setIsVisible(false)
  }

  if (!isVisible || !session?.user) {
    return null
  }

  const current = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{current.icon}</span>
              <div>
                <CardTitle className="text-xl">{current.title}</CardTitle>
                <Badge variant="secondary">
                  Passo {currentStep + 1} de {steps.length}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={skipTutorial}>
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-gray-700 text-lg leading-relaxed">
            {current.description}
          </p>

          {current.action && current.href && (
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-blue-800 mb-2">
                💡 <strong>Ação recomendada:</strong>
              </p>
              <a 
                href={current.href}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={completeTutorial}
              >
                {current.action} →
              </a>
            </div>
          )}

          {/* Progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progresso</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Navegação */}
          <div className="flex justify-between items-center pt-4">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              ← Anterior
            </Button>

            <div className="flex space-x-2">
              <Button variant="ghost" onClick={skipTutorial}>
                Pular Tutorial
              </Button>
              
              <Button onClick={nextStep}>
                {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo →'}
              </Button>
            </div>
          </div>

          {/* Indicadores de passo */}
          <div className="flex justify-center space-x-2 pt-2">
            {steps.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-blue-600' 
                    : index < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                }`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>

          {/* Footer com papel do usuário */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Você está logado como: 
              <Badge variant="outline" className="ml-2">
                {session.user.role === 'USER' ? 'Usuário' :
                 session.user.role === 'STUDENT' ? 'Estudante' :
                 session.user.role === 'TEACHER' ? 'Professor' :
                 session.user.role === 'COORDINATOR' ? 'Coordenador' : session.user.role}
              </Badge>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
