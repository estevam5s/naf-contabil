// Sistema de Relatórios Avançado - NAF Contábil
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

export const dynamic = 'force-dynamic'

interface ReportFilters {
  startDate?: string
  endDate?: string
  serviceType?: string
  status?: string
  studentId?: string
  teacherId?: string
  category?: string
}

interface DashboardStats {
  totalDemands: number
  totalAttendances: number
  totalStudents: number
  totalTeachers: number
  pendingValidations: number
  completedThisMonth: number
  averageResponseTime: number
  topServices: Array<{ name: string; count: number }>
  studentRanking: Array<{ name: string; attendances: number; hours: number }>
  monthlyGrowth: number
}

class ReportsService {
  
  // Obter estatísticas gerais do dashboard
  async getDashboardStats(userId?: string): Promise<DashboardStats> {
    try {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

      // Estatísticas básicas
      const [
        totalDemands,
        totalAttendances,
        totalStudents,
        totalTeachers,
        pendingValidations,
        completedThisMonth,
        completedLastMonth
      ] = await Promise.all([
        prisma.demand.count(),
        prisma.attendance.count(),
        prisma.user.count({ where: { role: 'STUDENT' } }),
        prisma.user.count({ where: { role: 'TEACHER' } }),
        prisma.attendance.count({ where: { isValidated: false } }),
        prisma.attendance.count({
          where: {
            createdAt: { gte: startOfMonth },
            status: 'COMPLETED'
          }
        }),
        prisma.attendance.count({
          where: {
            createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
            status: 'COMPLETED'
          }
        })
      ])

      // Top serviços mais solicitados
      const topServicesData = await prisma.demand.groupBy({
        by: ['serviceId'],
        _count: { serviceId: true },
        orderBy: { _count: { serviceId: 'desc' } },
        take: 5
      })

      const topServices = await Promise.all(
        topServicesData.map(async (item) => {
          const service = await prisma.service.findUnique({
            where: { id: item.serviceId },
            select: { name: true }
          })
          return {
            name: service?.name || 'Serviço não encontrado',
            count: item._count.serviceId
          }
        })
      )

      // Ranking de estudantes
      const studentRankingData = await prisma.attendance.groupBy({
        by: ['userId'],
        _count: { userId: true },
        _sum: { hours: true },
        where: {
          user: { role: 'STUDENT' },
          isValidated: true
        },
        orderBy: { _count: { userId: 'desc' } },
        take: 10
      })

      const studentRanking = await Promise.all(
        studentRankingData.map(async (item) => {
          const user = await prisma.user.findUnique({
            where: { id: item.userId },
            select: { name: true }
          })
          return {
            name: user?.name || 'Usuário não encontrado',
            attendances: item._count.userId,
            hours: item._sum.hours || 0
          }
        })
      )

      // Cálculo de crescimento mensal
      const monthlyGrowth = completedLastMonth > 0 
        ? ((completedThisMonth - completedLastMonth) / completedLastMonth) * 100 
        : 0

      // Tempo médio de resposta (simplificado)
      const averageResponseTime = 24 // horas (implementar cálculo real posteriormente)

      return {
        totalDemands,
        totalAttendances,
        totalStudents,
        totalTeachers,
        pendingValidations,
        completedThisMonth,
        averageResponseTime,
        topServices,
        studentRanking,
        monthlyGrowth
      }

    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      throw error
    }
  }

  // Gerar relatório de atendimentos
  async generateAttendanceReport(filters: ReportFilters) {
    try {
      const where: any = {}

      if (filters.startDate) {
        where.createdAt = { gte: new Date(filters.startDate) }
      }
      if (filters.endDate) {
        where.createdAt = { ...where.createdAt, lte: new Date(filters.endDate) }
      }
      if (filters.status) {
        where.status = filters.status
      }
      if (filters.studentId) {
        where.userId = filters.studentId
      }
      if (filters.category) {
        where.category = filters.category
      }

      const attendances = await prisma.attendance.findMany({
        where,
        include: {
          user: {
            select: { name: true, email: true, role: true }
          },
          demand: {
            include: {
              service: {
                select: { name: true, category: true, theme: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return {
        data: attendances,
        summary: {
          total: attendances.length,
          validated: attendances.filter(a => a.isValidated).length,
          pending: attendances.filter(a => !a.isValidated).length,
          totalHours: attendances.reduce((sum, a) => sum + (a.hours || 0), 0),
          averageHours: attendances.length > 0 
            ? attendances.reduce((sum, a) => sum + (a.hours || 0), 0) / attendances.length 
            : 0
        }
      }

    } catch (error) {
      console.error('Erro ao gerar relatório de atendimentos:', error)
      throw error
    }
  }

  // Gerar relatório de demandas
  async generateDemandReport(filters: ReportFilters) {
    try {
      const where: any = {}

      if (filters.startDate) {
        where.createdAt = { gte: new Date(filters.startDate) }
      }
      if (filters.endDate) {
        where.createdAt = { ...where.createdAt, lte: new Date(filters.endDate) }
      }
      if (filters.status) {
        where.status = filters.status
      }
      if (filters.serviceType) {
        where.service = { name: { contains: filters.serviceType } }
      }

      const demands = await prisma.demand.findMany({
        where,
        include: {
          service: {
            select: { name: true, category: true, theme: true }
          },
          attendances: {
            include: {
              user: {
                select: { name: true, email: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Estatísticas por status
      const statusStats = demands.reduce((acc: any, demand) => {
        acc[demand.status] = (acc[demand.status] || 0) + 1
        return acc
      }, {})

      // Estatísticas por serviço
      const serviceStats = demands.reduce((acc: any, demand) => {
        const serviceName = demand.service?.name || 'Não informado'
        acc[serviceName] = (acc[serviceName] || 0) + 1
        return acc
      }, {})

      return {
        data: demands,
        summary: {
          total: demands.length,
          statusStats,
          serviceStats,
          withAttendance: demands.filter(d => d.attendances.length > 0).length,
          averageAttendances: demands.length > 0 
            ? demands.reduce((sum, d) => sum + d.attendances.length, 0) / demands.length 
            : 0
        }
      }

    } catch (error) {
      console.error('Erro ao gerar relatório de demandas:', error)
      throw error
    }
  }

  // Gerar relatório de estudantes
  async generateStudentReport() {
    try {
      const students = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        include: {
          attendances: {
            select: {
              id: true,
              hours: true,
              isValidated: true,
              status: true,
              category: true,
              createdAt: true
            }
          }
        }
      })

      const studentsWithStats = students.map(student => {
        const validatedAttendances = student.attendances.filter(a => a.isValidated)
        const totalHours = validatedAttendances.reduce((sum, a) => sum + (a.hours || 0), 0)
        
        return {
          id: student.id,
          name: student.name,
          email: student.email,
          createdAt: student.createdAt,
          totalAttendances: student.attendances.length,
          validatedAttendances: validatedAttendances.length,
          pendingAttendances: student.attendances.filter(a => !a.isValidated).length,
          totalHours,
          averageHours: validatedAttendances.length > 0 ? totalHours / validatedAttendances.length : 0,
          lastAttendance: student.attendances.length > 0 
            ? student.attendances.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
            : null,
          performance: this.calculateStudentPerformance(totalHours, validatedAttendances.length)
        }
      })

      return {
        data: studentsWithStats.sort((a, b) => b.totalHours - a.totalHours),
        summary: {
          total: students.length,
          active: studentsWithStats.filter(s => s.totalAttendances > 0).length,
          averageHours: studentsWithStats.reduce((sum, s) => sum + s.totalHours, 0) / students.length,
          topPerformer: studentsWithStats[0] || null
        }
      }

    } catch (error) {
      console.error('Erro ao gerar relatório de estudantes:', error)
      throw error
    }
  }

  // Calcular performance do estudante
  private calculateStudentPerformance(hours: number, attendances: number): string {
    if (hours >= 40 && attendances >= 20) return 'Excelente'
    if (hours >= 20 && attendances >= 10) return 'Muito Bom'
    if (hours >= 10 && attendances >= 5) return 'Bom'
    if (hours >= 5 && attendances >= 2) return 'Regular'
    return 'Iniciante'
  }

  // Exportar relatório para Excel
  async exportToExcel(reportType: 'attendance' | 'demand' | 'student', data: any[]): Promise<Buffer> {
    try {
      const workbook = XLSX.utils.book_new()
      
      let worksheetData: any[] = []
      let sheetName = ''

      switch (reportType) {
        case 'attendance':
          sheetName = 'Relatório de Atendimentos'
          worksheetData = data.map(item => ({
            'Protocolo': item.protocol,
            'Estudante': item.user?.name || 'N/A',
            'Email Estudante': item.user?.email || 'N/A',
            'Categoria': item.category,
            'Tema': item.theme,
            'Horas': item.hours,
            'Status': item.status,
            'Validado': item.isValidated ? 'Sim' : 'Não',
            'Data Criação': new Date(item.createdAt).toLocaleDateString('pt-BR'),
            'Descrição': item.description
          }))
          break

        case 'demand':
          sheetName = 'Relatório de Demandas'
          worksheetData = data.map(item => ({
            'Protocolo': item.protocolNumber,
            'Cliente': item.clientName,
            'Email Cliente': item.clientEmail,
            'Serviço': item.service?.name || 'N/A',
            'Categoria': item.service?.category || 'N/A',
            'Status': item.status,
            'Prioridade': item.priority,
            'Atendimentos': item.attendances?.length || 0,
            'Data Criação': new Date(item.createdAt).toLocaleDateString('pt-BR'),
            'Descrição': item.description
          }))
          break

        case 'student':
          sheetName = 'Relatório de Estudantes'
          worksheetData = data.map(item => ({
            'Nome': item.name,
            'Email': item.email,
            'Total Atendimentos': item.totalAttendances,
            'Atendimentos Validados': item.validatedAttendances,
            'Atendimentos Pendentes': item.pendingAttendances,
            'Total Horas': item.totalHours,
            'Horas Médias': item.averageHours.toFixed(2),
            'Performance': item.performance,
            'Último Atendimento': item.lastAttendance ? new Date(item.lastAttendance).toLocaleDateString('pt-BR') : 'N/A',
            'Data Cadastro': new Date(item.createdAt).toLocaleDateString('pt-BR')
          }))
          break
      }

      const worksheet = XLSX.utils.json_to_sheet(worksheetData)
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

      // Gerar buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      return buffer

    } catch (error) {
      console.error('Erro ao exportar para Excel:', error)
      throw error
    }
  }

  // Gerar dados para Power BI
  async generatePowerBIData() {
    try {
      const [attendanceData, demandData, studentData] = await Promise.all([
        this.generateAttendanceReport({}),
        this.generateDemandReport({}),
        this.generateStudentReport()
      ])

      return {
        attendances: attendanceData.data,
        demands: demandData.data,
        students: studentData.data,
        summary: {
          totalAttendances: attendanceData.summary.total,
          totalDemands: demandData.summary.total,
          totalStudents: studentData.summary.total,
          generatedAt: new Date().toISOString()
        }
      }

    } catch (error) {
      console.error('Erro ao gerar dados para Power BI:', error)
      throw error
    }
  }
}

export const reportsService = new ReportsService()

// API Routes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const format = searchParams.get('format')

    switch (type) {
      case 'dashboard':
        const stats = await reportsService.getDashboardStats(session.user.id)
        return NextResponse.json({ success: true, data: stats })

      case 'attendance':
        const attendanceReport = await reportsService.generateAttendanceReport({
          startDate: searchParams.get('startDate') || undefined,
          endDate: searchParams.get('endDate') || undefined,
          status: searchParams.get('status') || undefined,
          studentId: searchParams.get('studentId') || undefined,
          category: searchParams.get('category') || undefined
        })

        if (format === 'excel') {
          const buffer = await reportsService.exportToExcel('attendance', attendanceReport.data)
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Content-Disposition': `attachment; filename="relatorio-atendimentos-${new Date().toISOString().split('T')[0]}.xlsx"`
            }
          })
        }

        return NextResponse.json({ success: true, data: attendanceReport })

      case 'demand':
        const demandReport = await reportsService.generateDemandReport({
          startDate: searchParams.get('startDate') || undefined,
          endDate: searchParams.get('endDate') || undefined,
          status: searchParams.get('status') || undefined,
          serviceType: searchParams.get('serviceType') || undefined
        })

        if (format === 'excel') {
          const buffer = await reportsService.exportToExcel('demand', demandReport.data)
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Content-Disposition': `attachment; filename="relatorio-demandas-${new Date().toISOString().split('T')[0]}.xlsx"`
            }
          })
        }

        return NextResponse.json({ success: true, data: demandReport })

      case 'student':
        const studentReport = await reportsService.generateStudentReport()

        if (format === 'excel') {
          const buffer = await reportsService.exportToExcel('student', studentReport.data)
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Content-Disposition': `attachment; filename="relatorio-estudantes-${new Date().toISOString().split('T')[0]}.xlsx"`
            }
          })
        }

        return NextResponse.json({ success: true, data: studentReport })

      case 'powerbi':
        const powerbiData = await reportsService.generatePowerBIData()
        return NextResponse.json({ success: true, data: powerbiData })

      default:
        return NextResponse.json({ error: 'Tipo de relatório inválido' }, { status: 400 })
    }

  } catch (error) {
    console.error('Erro no sistema de relatórios:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
