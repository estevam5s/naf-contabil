import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['COORDINATOR', 'TEACHER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'general'
    const format = searchParams.get('format') || 'json' // json, csv, xlsx
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Configurar filtros de data
    const dateFilter: any = {}
    if (startDate && endDate) {
      dateFilter.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    let data: any = []
    let filename = `relatorio-${type}-${new Date().toISOString().split('T')[0]}`

    switch (type) {
      case 'general':
        // Relatório geral com todas as informações principais
        const users = await prisma.user.findMany({
          where: dateFilter,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            phone: true,
            _count: {
              select: {
                demands: true,
                attendances: true
              }
            }
          }
        })

        const services = await prisma.service.findMany({
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            category: true,
            theme: true,
            estimatedDuration: true,
            _count: {
              select: { demands: true }
            }
          }
        })

        const demands = await prisma.demand.findMany({
          where: dateFilter,
          include: {
            service: true,
            user: { select: { name: true, email: true, role: true } }
          }
        })

        const attendances = await prisma.attendance.findMany({
          where: dateFilter,
          include: {
            user: { select: { name: true, email: true, role: true } },
            demand: { 
              include: { 
                service: { select: { name: true, category: true } } 
              } 
            }
          }
        })

        data = {
          resumo: {
            totalUsuarios: users.length,
            totalServicos: services.length,
            totalDemandas: demands.length,
            totalAtendimentos: attendances.length,
            dataGeracao: new Date().toISOString()
          },
          usuarios: users.map(user => ({
            id: user.id,
            nome: user.name,
            email: user.email,
            papel: user.role,
            telefone: user.phone,
            dataCadastro: user.createdAt,
            totalDemandas: user._count.demands,
            totalAtendimentos: user._count.attendances
          })),
          servicos: services.map(service => ({
            id: service.id,
            nome: service.name,
            categoria: service.category,
            tema: service.theme,
            duracaoEstimada: service.estimatedDuration,
            totalDemandas: service._count.demands
          })),
          demandas: demands.map(demand => ({
            id: demand.id,
            protocolo: demand.protocolNumber,
            titulo: demand.title,
            status: demand.status,
            prioridade: demand.priority,
            clienteNome: demand.clientName,
            clienteEmail: demand.clientEmail,
            servicoNome: demand.service?.name,
            servicoCategoria: demand.service?.category,
            usuarioNome: demand.user?.name,
            usuarioPapel: demand.user?.role,
            dataCriacao: demand.createdAt,
            dataAtualizacao: demand.updatedAt
          })),
          atendimentos: attendances.map(attendance => ({
            id: attendance.id,
            protocolo: attendance.protocol,
            status: attendance.status,
            categoria: attendance.category,
            tema: attendance.theme,
            horas: attendance.hours,
            validado: attendance.isValidated,
            certificadoEmitido: attendance.certIssued,
            usuarioNome: attendance.user?.name,
            usuarioPapel: attendance.user?.role,
            demandaProtocolo: attendance.demand?.protocolNumber,
            servicoNome: attendance.demand?.service?.name,
            dataAgendamento: attendance.scheduledAt,
            dataConclusao: attendance.completedAt,
            dataCriacao: attendance.createdAt
          }))
        }
        break

      case 'powerbi-dataset':
        // Dataset específico para Power BI com estrutura otimizada
        const powerbIDemands = await prisma.demand.findMany({
          where: dateFilter,
          include: {
            service: true,
            user: { select: { name: true, role: true } },
            attendances: true
          }
        })

        data = powerbIDemands.map(demand => ({
          // Chaves primárias
          demandaId: demand.id,
          protocolo: demand.protocolNumber,
          
          // Informações da demanda
          titulo: demand.title,
          status: demand.status,
          prioridade: demand.priority,
          
          // Informações do cliente
          clienteNome: demand.clientName,
          clienteEmail: demand.clientEmail,
          clienteTelefone: demand.clientPhone,
          clienteCpf: demand.clientCpf,
          
          // Informações do serviço
          servicoId: demand.service?.id,
          servicoNome: demand.service?.name,
          servicoCategoria: demand.service?.category,
          servicoTema: demand.service?.theme,
          servicoDuracao: demand.service?.estimatedDuration,
          
          // Informações do usuário responsável
          usuarioNome: demand.user?.name,
          usuarioPapel: demand.user?.role,
          
          // Informações de atendimentos
          totalAtendimentos: demand.attendances?.length || 0,
          atendimentosConcluidos: demand.attendances?.filter(a => a.status === 'COMPLETED').length || 0,
          horasTotalAtendimento: demand.attendances?.reduce((total, a) => total + (a.hours || 0), 0) || 0,
          
          // Datas (formato ISO para Power BI)
          dataCriacao: demand.createdAt.toISOString(),
          dataAtualizacao: demand.updatedAt.toISOString(),
          mesAno: `${demand.createdAt.getFullYear()}-${String(demand.createdAt.getMonth() + 1).padStart(2, '0')}`,
          ano: demand.createdAt.getFullYear(),
          mes: demand.createdAt.getMonth() + 1,
          trimestre: Math.ceil((demand.createdAt.getMonth() + 1) / 3),
          diaSemana: demand.createdAt.getDay()
        }))
        
        filename = `powerbi-dataset-${new Date().toISOString().split('T')[0]}`
        break

      default:
        return NextResponse.json({ error: 'Tipo de relatório não suportado' }, { status: 400 })
    }

    // Gerar resposta baseada no formato
    if (format === 'csv') {
      // Converter para CSV
      let csvContent = ''
      
      if (type === 'powerbi-dataset' && Array.isArray(data)) {
        // Header
        const headers = Object.keys(data[0] || {})
        csvContent = headers.join(',') + '\n'
        
        // Rows
        data.forEach(row => {
          const values = headers.map(header => {
            const value = row[header]
            // Escapar aspas e adicionar aspas se necessário
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          csvContent += values.join(',') + '\n'
        })
      }

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      })
    }

    if (format === 'xlsx') {
      // Gerar arquivo Excel (XLSX)
      let worksheetData: any[] = []
      
      if (type === 'powerbi-dataset' && Array.isArray(data)) {
        worksheetData = data
      } else if (type === 'general' && data.demandas) {
        // Para relatório geral, usar dados das demandas como principal
        worksheetData = data.demandas
      } else if (Array.isArray(data)) {
        worksheetData = data
      } else {
        // Se não for array, converter objeto em array de uma linha
        worksheetData = [data]
      }

      // Criar workbook e worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(worksheetData)
      
      // Adicionar o worksheet ao workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, type === 'general' ? 'Relatório Geral' : 'Dados')
      
      // Se for relatório geral, adicionar planilhas adicionais
      if (type === 'general' && data.usuarios && data.servicos && data.atendimentos) {
        const worksheetUsuarios = XLSX.utils.json_to_sheet(data.usuarios)
        const worksheetServicos = XLSX.utils.json_to_sheet(data.servicos)
        const worksheetAtendimentos = XLSX.utils.json_to_sheet(data.atendimentos)
        
        XLSX.utils.book_append_sheet(workbook, worksheetUsuarios, 'Usuários')
        XLSX.utils.book_append_sheet(workbook, worksheetServicos, 'Serviços')
        XLSX.utils.book_append_sheet(workbook, worksheetAtendimentos, 'Atendimentos')
      }

      // Converter para buffer
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

      return new NextResponse(excelBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}.xlsx"`
        }
      })
    }

    if (format === 'excel') {
      // Para Excel, retornar JSON com instruções para conversão no frontend
      return NextResponse.json({
        success: true,
        data,
        format: 'excel',
        filename: `${filename}.xlsx`,
        instructions: 'Use a biblioteca XLSX para converter este JSON em Excel no frontend'
      })
    }

    // Formato padrão: JSON
    return NextResponse.json({
      success: true,
      data,
      type,
      format,
      generatedAt: new Date().toISOString(),
      totalRecords: Array.isArray(data) ? data.length : Object.keys(data).length,
      filename: `${filename}.json`
    })

  } catch (error) {
    console.error('Erro ao gerar relatório Power BI:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
