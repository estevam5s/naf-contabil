import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Configurar resposta para Server-Sent Events
  const responseHeaders = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Cache-Control'
  })

  let isConnected = true

  const stream = new ReadableStream({
    start(controller) {
      // Função para enviar notificação
      const sendNotification = (data: any) => {
        if (!isConnected) return
        
        const message = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(new TextEncoder().encode(message))
      }

      // Enviar conexão estabelecida
      sendNotification({
        type: 'info',
        title: 'Conexão Estabelecida',
        message: 'Sistema de notificações em tempo real ativo',
        timestamp: new Date().toISOString()
      })

      // Simular notificações periódicas
      const notificationTypes = [
        {
          type: 'success',
          title: 'Atendimento Concluído',
          message: 'João Silva finalizou atendimento de Orientação MEI'
        },
        {
          type: 'info',
          title: 'Novo Agendamento',
          message: 'Maria Costa agendou atendimento para amanhã'
        },
        {
          type: 'warning',
          title: 'Validação Pendente',
          message: '5 atendimentos aguardando validação'
        },
        {
          type: 'error',
          title: 'Sistema de Email',
          message: 'Falha no envio de lembrete automático'
        }
      ]

      // Enviar notificação aleatória a cada 30 segundos
      const interval = setInterval(() => {
        if (!isConnected) {
          clearInterval(interval)
          return
        }

        const randomNotification = notificationTypes[
          Math.floor(Math.random() * notificationTypes.length)
        ]

        sendNotification({
          ...randomNotification,
          timestamp: new Date().toISOString()
        })
      }, 30000)

      // Enviar estatísticas atualizadas a cada 2 minutos
      const statsInterval = setInterval(() => {
        if (!isConnected) {
          clearInterval(statsInterval)
          return
        }

        sendNotification({
          type: 'stats',
          title: 'Atualização de Estatísticas',
          message: 'Dados do dashboard atualizados',
          data: {
            totalDemandas: Math.floor(Math.random() * 50) + 300,
            totalAtendimentos: Math.floor(Math.random() * 30) + 270,
            estudantesOnline: Math.floor(Math.random() * 15) + 25
          },
          timestamp: new Date().toISOString()
        })
      }, 120000)

      // Cleanup quando conexão for fechada
      request.signal.addEventListener('abort', () => {
        isConnected = false
        clearInterval(interval)
        clearInterval(statsInterval)
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: responseHeaders
  })
}

// Endpoint para enviar notificação manual
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { type, title, message, targetRole = 'COORDINATOR' } = body

    if (!type || !title || !message) {
      return Response.json(
        { success: false, message: 'Tipo, título e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Aqui você poderia integrar com um sistema de notificações push real
    // Por exemplo: Firebase Cloud Messaging, Socket.IO, etc.
    
    console.log('Notificação enviada:', {
      type,
      title,
      message,
      targetRole,
      timestamp: new Date().toISOString()
    })

    return Response.json({
      success: true,
      message: 'Notificação enviada com sucesso',
      data: {
        type,
        title,
        message,
        targetRole,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
    return Response.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
