import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const nafServices = {
      formasAssistencia: [
        {
          id: 1,
          titulo: "Assistência a Pessoas Físicas de Baixa Renda",
          descricao: "Serviços fiscais relacionados ao CPF, imposto de renda, e-Social Doméstico e muito mais",
          publico: "Pessoas físicas de baixa renda",
          icone: "👤",
          cor: "blue",
          servicos: [
            "Cadastro CPF",
            "Declaração de Imposto de Renda",
            "E-Social Doméstico",
            "Certidão Negativa",
            "Consulta de dívidas",
            "Malha e restituição do IR"
          ]
        },
        {
          id: 2,
          titulo: "Assistência a Pequenos Proprietários Rurais",
          descricao: "Orientação sobre MEI Rural e declaração do imposto territorial rural (DITR)",
          publico: "Pequenos proprietários rurais",
          icone: "🚜",
          cor: "green",
          servicos: [
            "MEI Rural",
            "DITR - Declaração do ITR",
            "Cadastro Nacional de Imóveis Rurais (CNIR)",
            "Serviços relativos ao ITR",
            "Certidão negativa rural",
            "Parcelamentos rurais"
          ]
        },
        {
          id: 3,
          titulo: "Assistência ao Comércio Exterior",
          descricao: "Apoio a pessoas físicas de baixa renda e MEI em operações de comércio exterior",
          publico: "Pessoas físicas de baixa renda e MEI",
          icone: "🌍",
          cor: "purple",
          servicos: [
            "Orientações sobre bagagens internacionais",
            "Encomendas internacionais",
            "Comércio exterior para MEI",
            "Documentação para importação/exportação",
            "Tributos de importação",
            "Regimes especiais"
          ]
        },
        {
          id: 4,
          titulo: "Assistência a Pessoas Jurídicas MEI/OSC",
          descricao: "Suporte a microempreendedores individuais e organizações da sociedade civil",
          publico: "MEI e organizações da sociedade civil",
          icone: "🏢",
          cor: "orange",
          servicos: [
            "Cadastro CNPJ",
            "Obrigações fiscais do MEI",
            "CAEPF - Cadastro de Atividades Econômicas",
            "Certidão negativa de MEI",
            "Parcelamento para MEI",
            "Orientações para OSC"
          ]
        },
        {
          id: 5,
          titulo: "Assistência Integrada",
          descricao: "Soluções relacionadas aos fiscos de todas as esferas federativas",
          publico: "Pessoas físicas de baixa renda, MEI, OSC e pequenos proprietários rurais",
          icone: "🤝",
          cor: "red",
          servicos: [
            "Soluções federais, estaduais e municipais",
            "Integração entre esferas",
            "Orientação completa",
            "Suporte multiplataforma",
            "Assessoria integrada",
            "Atendimento unificado"
          ]
        }
      ],
      servicosDetalhados: {
        cidadao: [
          {
            categoria: "Cadastros e Documentos",
            servicos: [
              {
                nome: "Cadastro CPF",
                descricao: "Inscrição, alteração e consulta de CPF",
                procedimento: "Presencial ou online com documentos válidos",
                documentos: ["RG", "Certidão de Nascimento ou Casamento"],
                prazo: "Imediato",
                custo: "Gratuito"
              },
              {
                nome: "Cadastro Nacional de Obras (CNO)",
                descricao: "Registro de obras de construção civil",
                procedimento: "Online no site da Receita Federal",
                documentos: ["CPF", "Dados da obra", "Alvará de construção"],
                prazo: "Até 30 dias do início da obra",
                custo: "Gratuito"
              }
            ]
          },
          {
            categoria: "Imposto de Renda",
            servicos: [
              {
                nome: "Declaração de Imposto de Renda",
                descricao: "Elaboração e envio da declaração anual",
                procedimento: "Programa IRPF ou online",
                documentos: ["Informe de rendimentos", "Comprovantes de despesas", "CPF"],
                prazo: "Até 31 de maio",
                custo: "Gratuito"
              },
              {
                nome: "Isenção para Moléstias Graves",
                descricao: "Isenção do IR para portadores de doenças graves",
                procedimento: "Requerimento com laudo médico",
                documentos: ["Laudo médico", "CPF", "Comprovantes médicos"],
                prazo: "Conforme necessidade",
                custo: "Gratuito"
              },
              {
                nome: "Malha e Restituição",
                descricao: "Consulta e correção de inconsistências",
                procedimento: "Portal e-CAC ou aplicativo",
                documentos: ["CPF", "Declaração original"],
                prazo: "Conforme cronograma da RF",
                custo: "Gratuito"
              },
              {
                nome: "Destinação para Fundos",
                descricao: "Destinação do IR para fundos de direitos",
                procedimento: "Opção na declaração de IR",
                documentos: ["Declaração de IR"],
                prazo: "Durante a declaração",
                custo: "Gratuito"
              }
            ]
          },
          {
            categoria: "E-Social e Trabalhista",
            servicos: [
              {
                nome: "E-Social Doméstico",
                descricao: "Cadastro e obrigações de empregados domésticos",
                procedimento: "Portal eSocial Doméstico",
                documentos: ["CPF empregador", "Dados do empregado", "Contrato"],
                prazo: "Até o dia 7 do mês seguinte",
                custo: "Gratuito"
              }
            ]
          },
          {
            categoria: "Certidões e Consultas",
            servicos: [
              {
                nome: "Certidão Negativa",
                descricao: "Certidão de regularidade fiscal",
                procedimento: "Portal e-CAC ou Receita Federal",
                documentos: ["CPF"],
                prazo: "Imediato",
                custo: "Gratuito"
              },
              {
                nome: "Consulta de Dívidas",
                descricao: "Verificação de pendências fiscais",
                procedimento: "Portal e-CAC",
                documentos: ["CPF"],
                prazo: "Imediato",
                custo: "Gratuito"
              }
            ]
          },
          {
            categoria: "Pagamentos e Parcelamentos",
            servicos: [
              {
                nome: "Geração de DARF",
                descricao: "Documento de arrecadação para pagamento",
                procedimento: "Portal e-CAC ou Receita Federal",
                documentos: ["CPF", "Dados do tributo"],
                prazo: "Conforme vencimento",
                custo: "Valor do tributo"
              },
              {
                nome: "Parcelamento de Dívidas",
                descricao: "Parcelamento de débitos tributários",
                procedimento: "Portal e-CAC",
                documentos: ["CPF", "Demonstrativo de débitos"],
                prazo: "Conforme regulamentação",
                custo: "Valor dos débitos + juros"
              },
              {
                nome: "Transação Tributária",
                descricao: "Acordos para quitação de débitos",
                procedimento: "Portal e-CAC com proposta",
                documentos: ["CPF", "Proposta de transação"],
                prazo: "Conforme edital",
                custo: "Conforme acordo"
              }
            ]
          },
          {
            categoria: "Comércio Exterior",
            servicos: [
              {
                nome: "Bagagens Internacionais",
                descricao: "Orientações sobre bagagens em viagens",
                procedimento: "Declaração na chegada ao país",
                documentos: ["Passaporte", "Bilhete de viagem"],
                prazo: "Na chegada",
                custo: "Conforme valor dos bens"
              },
              {
                nome: "Encomendas Internacionais",
                descricao: "Tributos sobre compras do exterior",
                procedimento: "Declaração nos Correios ou transportadora",
                documentos: ["CPF", "Invoice", "Comprovante de compra"],
                prazo: "No recebimento",
                custo: "Conforme valor e tipo"
              }
            ]
          },
          {
            categoria: "Isenções Especiais",
            servicos: [
              {
                nome: "Isenção IPI Taxistas",
                descricao: "Isenção de IPI para aquisição de veículos",
                procedimento: "Requerimento na Receita Federal",
                documentos: ["Alvará de taxista", "CPF", "Documentos do veículo"],
                prazo: "Antes da compra",
                custo: "Gratuito"
              },
              {
                nome: "Isenção para PcD e TEA",
                descricao: "Isenção de IPI e IOF para pessoas com deficiência",
                procedimento: "Requerimento com laudo médico",
                documentos: ["Laudo médico", "CPF", "Documentos específicos"],
                prazo: "Antes da aquisição",
                custo: "Gratuito"
              }
            ]
          }
        ],
        rural: [
          {
            categoria: "Cadastros Rurais",
            servicos: [
              {
                nome: "CNIR - Cadastro Nacional de Imóveis Rurais",
                descricao: "Cadastro obrigatório de imóveis rurais",
                procedimento: "Sistema Nacional de Cadastro Rural",
                documentos: ["CPF", "Documentos do imóvel", "Georreferenciamento"],
                prazo: "Até 31 de dezembro anualmente",
                custo: "Gratuito"
              }
            ]
          },
          {
            categoria: "ITR - Imposto Territorial Rural",
            servicos: [
              {
                nome: "DITR - Declaração do ITR",
                descricao: "Declaração anual do imposto territorial rural",
                procedimento: "Programa DITR ou online",
                documentos: ["CNIR", "CPF", "Documentos do imóvel"],
                prazo: "Até 30 de setembro",
                custo: "Valor do ITR devido"
              },
              {
                nome: "Serviços Relativos ao ITR",
                descricao: "Consultas, cálculos e orientações sobre ITR",
                procedimento: "Portal e-CAC Rural",
                documentos: ["CPF", "CNIR"],
                prazo: "Conforme necessidade",
                custo: "Gratuito para consultas"
              }
            ]
          }
        ],
        empresas: [
          {
            categoria: "Cadastros Empresariais",
            servicos: [
              {
                nome: "CAEPF - Cadastro de Atividades Econômicas",
                descricao: "Cadastro de atividades de pessoas físicas",
                procedimento: "Portal e-CAC",
                documentos: ["CPF", "Descrição das atividades"],
                prazo: "Conforme início da atividade",
                custo: "Gratuito"
              },
              {
                nome: "CNPJ - Cadastro Nacional de Pessoas Jurídicas",
                descricao: "Inscrição e alterações de CNPJ",
                procedimento: "Portal da Receita Federal",
                documentos: ["Contrato social", "CPF dos sócios", "Documentos específicos"],
                prazo: "Conforme necessidade",
                custo: "Gratuito"
              }
            ]
          },
          {
            categoria: "MEI - Microempreendedor Individual",
            servicos: [
              {
                nome: "Obrigações Fiscais do MEI",
                descricao: "DAS-MEI e declaração anual",
                procedimento: "Portal do Empreendedor",
                documentos: ["CPF", "CNPJ do MEI"],
                prazo: "DAS até dia 20, DASN-SIMEI até 31/05",
                custo: "Valor do DAS mensal"
              },
              {
                nome: "Comércio Exterior para MEI",
                descricao: "Orientações sobre exportação e importação",
                procedimento: "Habilitação no Siscomex",
                documentos: ["CNPJ MEI", "Documentos específicos"],
                prazo: "Conforme operação",
                custo: "Taxas de comércio exterior"
              }
            ]
          }
        ],
        servicesGerais: [
          {
            categoria: "Acesso Digital",
            servicos: [
              {
                nome: "Senha GOV.BR",
                descricao: "Acesso remoto aos serviços da Receita Federal",
                procedimento: "Cadastro no portal GOV.BR",
                documentos: ["CPF", "Documento com foto"],
                prazo: "Imediato",
                custo: "Gratuito"
              }
            ]
          },
          {
            categoria: "Atendimento Presencial",
            servicos: [
              {
                nome: "Agendamento Receita Federal",
                descricao: "Agendamento para atendimento presencial",
                procedimento: "Portal da Receita Federal ou telefone",
                documentos: ["CPF"],
                prazo: "Conforme disponibilidade",
                custo: "Gratuito"
              }
            ]
          }
        ]
      },
      estatisticas: {
        totalServicos: 45,
        categorias: 8,
        formasAssistencia: 5,
        publicoAtendido: [
          "Pessoas físicas de baixa renda",
          "Microempreendedores individuais (MEI)",
          "Organizações da sociedade civil (OSC)",
          "Pequenos proprietários rurais"
        ]
      }
    }

    return NextResponse.json(nafServices)
  } catch (error) {
    console.error('Erro ao buscar serviços NAF:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
