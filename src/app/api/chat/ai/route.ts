import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = 'AIzaSyCRfarEDTrIlXNPdonkf-KNAU414KrGnEQ'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export const dynamic = 'force-dynamic'

const NAF_CONTEXT = `
Você é um assistente virtual do NAF (Núcleo de Apoio Fiscal) da Estácio Florianópolis.

INFORMAÇÕES SOBRE O NAF:
- O NAF é um programa de extensão universitária em parceria com a Receita Federal
- Oferece serviços gratuitos de orientação fiscal e contábil
- Atende principalmente microempreendedores, MEI e pessoas de baixa renda
- Funciona de segunda a sexta, das 8h às 18h
- Telefone: (48) 98461-4449

SERVIÇOS OFERECIDOS:
- Declaração de Imposto de Renda (orientação)
- Formalização MEI
- Orientação para abertura de CNPJ
- Consultoria fiscal básica
- Educação fiscal
- Planejamento tributário simples

VALORES E PRAZOS ATUAIS (2024):
- DAS MEI: R$ 67,00 (Comércio/Indústria), R$ 71,00 (Serviços), R$ 72,00 (Comércio e Serviços)
- IR 2024: Prazo até 31 de maio, limite de obrigatoriedade R$ 30.639,90
- MEI: Limite de faturamento R$ 81.000/ano
- Declaração anual MEI (DASN-SIMEI): até 31 de maio

INSTRUÇÕES:
- Seja sempre cordial e profissional
- Forneça informações precisas sobre serviços fiscais
- Use markdown para formatar respostas quando apropriado
- Se não souber algo específico, sugira agendamento ou contato
- Mantenha respostas concisas mas informativas
- Use linguagem acessível, evitando jargões desnecessários
`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Preparar histórico da conversa para contexto
    const conversationContext = conversationHistory
      .slice(-10) // Últimas 10 mensagens para contexto
      .map((msg: any) => `${msg.sender === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`)
      .join('\n')

    const prompt = `
    ${NAF_CONTEXT}

    ${conversationContext ? `HISTÓRICO DA CONVERSA:\n${conversationContext}\n\n` : ''}

    PERGUNTA DO USUÁRIO: ${message}

    Responda de forma útil e precisa, usando markdown quando apropriado. Se a pergunta não for relacionada aos serviços do NAF, redirecione educadamente para temas fiscais e contábeis.
    `

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Resposta inválida da API Gemini')
    }

    const aiResponse = data.candidates[0].content.parts[0].text

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro na API do Gemini:', error)
    return NextResponse.json(
      {
        error: 'Erro ao processar solicitação',
        response: 'Desculpe, não foi possível processar sua mensagem no momento. Para atendimento imediato, entre em contato pelo telefone (48) 98461-4449 ou agende um atendimento presencial.'
      },
      { status: 500 }
    )
  }
}