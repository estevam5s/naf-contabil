// Sistema de Relatórios Avançado - NAF Contábil
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

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

interface ChartData {
  pieCharts: {
    statusDistribution: Array<{ label: string; value: number; color?: string }>
    serviceDistribution: Array<{ label: string; value: number; color?: string }>
    studentPerformance: Array<{ label: string; value: number; color?: string }>
  }
  barCharts: {
    monthlyTrends: Array<{ label: string; value: number }>
    topStudents: Array<{ label: string; value: number }>
    servicePopularity: Array<{ label: string; value: number }>
  }
  lineCharts: {
    attendanceGrowth: Array<{ label: string; value: number }>
    demandTrends: Array<{ label: string; value: number }>
  }
}

class ReportsService {
  
  // Obter estatísticas gerais do dashboard (usando dados mock)
  async getDashboardStats(userId?: string): Promise<DashboardStats> {
    try {
      // Simular dados realistas para desenvolvimento
      const mockStats: DashboardStats = {
        totalDemands: 156,
        totalAttendances: 234,
        totalStudents: 45,
        totalTeachers: 12,
        pendingValidations: 18,
        completedThisMonth: 67,
        averageResponseTime: 24,
        topServices: [
          { name: 'Consultoria Fiscal', count: 45 },
          { name: 'Imposto de Renda PF', count: 38 },
          { name: 'Abertura de MEI', count: 32 },
          { name: 'Contabilidade Empresarial', count: 28 },
          { name: 'Orientação Tributária', count: 23 }
        ],
        studentRanking: [
          { name: 'Ana Silva Santos', attendances: 25, hours: 120 },
          { name: 'Carlos Eduardo Lima', attendances: 22, hours: 110 },
          { name: 'Maria Fernanda Costa', attendances: 20, hours: 95 },
          { name: 'João Pedro Oliveira', attendances: 18, hours: 88 },
          { name: 'Luisa Martins Rocha', attendances: 16, hours: 80 },
          { name: 'Rafael Souza Pereira', attendances: 15, hours: 75 },
          { name: 'Fernanda Alves Silva', attendances: 14, hours: 70 },
          { name: 'Bruno Castro Mendes', attendances: 13, hours: 65 },
          { name: 'Camila Reis Santos', attendances: 12, hours: 60 },
          { name: 'Diego Ferreira Lima', attendances: 11, hours: 55 }
        ],
        monthlyGrowth: 15.2
      }

      return mockStats

    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      throw error
    }
  }

  // Gerar relatório de atendimentos (usando dados mock)
  async generateAttendanceReport(filters: ReportFilters) {
    try {
      // Simular dados de atendimentos
      const mockAttendances = [
        {
          id: '1',
          protocol: 'ATD-2024-001',
          category: 'FISCAL',
          theme: 'Imposto de Renda',
          hours: 3,
          status: 'COMPLETED',
          isValidated: true,
          description: 'Orientação sobre declaração de IR para pessoa física',
          createdAt: new Date('2024-01-15'),
          user: {
            name: 'Ana Silva Santos',
            email: 'ana.santos@estudante.com',
            role: 'STUDENT'
          },
          demand: {
            service: {
              name: 'Consultoria em Imposto de Renda',
              category: 'FISCAL',
              theme: 'Tributação'
            }
          }
        },
        {
          id: '2',
          protocol: 'ATD-2024-002',
          category: 'CONTABIL',
          theme: 'Abertura de Empresa',
          hours: 4,
          status: 'COMPLETED',
          isValidated: true,
          description: 'Auxílio na abertura de MEI',
          createdAt: new Date('2024-01-16'),
          user: {
            name: 'Carlos Eduardo Lima',
            email: 'carlos.lima@estudante.com',
            role: 'STUDENT'
          },
          demand: {
            service: {
              name: 'Abertura de MEI',
              category: 'CONTABIL',
              theme: 'Empresarial'
            }
          }
        },
        {
          id: '3',
          protocol: 'ATD-2024-003',
          category: 'FISCAL',
          theme: 'Consultoria Tributária',
          hours: 2,
          status: 'IN_PROGRESS',
          isValidated: false,
          description: 'Orientação sobre regime tributário',
          createdAt: new Date('2024-01-17'),
          user: {
            name: 'Maria Fernanda Costa',
            email: 'maria.costa@estudante.com',
            role: 'STUDENT'
          },
          demand: {
            service: {
              name: 'Consultoria Tributária',
              category: 'FISCAL',
              theme: 'Tributação'
            }
          }
        }
      ]

      // Aplicar filtros básicos
      let filteredAttendances = mockAttendances

      if (filters.status) {
        filteredAttendances = filteredAttendances.filter(a => a.status === filters.status)
      }

      if (filters.category) {
        filteredAttendances = filteredAttendances.filter(a => a.category === filters.category)
      }

      return {
        data: filteredAttendances,
        summary: {
          total: filteredAttendances.length,
          validated: filteredAttendances.filter(a => a.isValidated).length,
          pending: filteredAttendances.filter(a => !a.isValidated).length,
          totalHours: filteredAttendances.reduce((sum, a) => sum + (a.hours || 0), 0),
          averageHours: filteredAttendances.length > 0
            ? filteredAttendances.reduce((sum, a) => sum + (a.hours || 0), 0) / filteredAttendances.length
            : 0
        }
      }

    } catch (error) {
      console.error('Erro ao gerar relatório de atendimentos:', error)
      throw error
    }
  }

  // Gerar relatório de demandas (usando dados mock)
  async generateDemandReport(filters: ReportFilters) {
    try {
      // Simular dados de demandas
      const mockDemands = [
        {
          id: '1',
          protocolNumber: 'DEM-2024-001',
          clientName: 'João Silva Empresa ME',
          clientEmail: 'joao@empresame.com',
          status: 'COMPLETED',
          priority: 'NORMAL',
          description: 'Consultoria para abertura de empresa',
          createdAt: new Date('2024-01-10'),
          service: {
            name: 'Abertura de MEI',
            category: 'CONTABIL',
            theme: 'Empresarial'
          },
          attendances: [
            {
              id: '1',
              user: {
                name: 'Ana Silva Santos',
                email: 'ana.santos@estudante.com'
              }
            }
          ]
        },
        {
          id: '2',
          protocolNumber: 'DEM-2024-002',
          clientName: 'Maria Oliveira',
          clientEmail: 'maria@email.com',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          description: 'Consultoria sobre Imposto de Renda',
          createdAt: new Date('2024-01-12'),
          service: {
            name: 'Consultoria em Imposto de Renda',
            category: 'FISCAL',
            theme: 'Tributação'
          },
          attendances: [
            {
              id: '2',
              user: {
                name: 'Carlos Eduardo Lima',
                email: 'carlos.lima@estudante.com'
              }
            }
          ]
        },
        {
          id: '3',
          protocolNumber: 'DEM-2024-003',
          clientName: 'Pedro Santos Ltda',
          clientEmail: 'pedro@santosltda.com',
          status: 'PENDING',
          priority: 'NORMAL',
          description: 'Consultoria tributária empresarial',
          createdAt: new Date('2024-01-14'),
          service: {
            name: 'Consultoria Tributária',
            category: 'FISCAL',
            theme: 'Tributação'
          },
          attendances: []
        }
      ]

      // Aplicar filtros básicos
      let filteredDemands = mockDemands

      if (filters.status) {
        filteredDemands = filteredDemands.filter(d => d.status === filters.status)
      }

      if (filters.serviceType) {
        filteredDemands = filteredDemands.filter(d =>
          d.service?.name.toLowerCase().includes(filters.serviceType.toLowerCase())
        )
      }

      // Estatísticas por status
      const statusStats = filteredDemands.reduce((acc: any, demand) => {
        acc[demand.status] = (acc[demand.status] || 0) + 1
        return acc
      }, {})

      // Estatísticas por serviço
      const serviceStats = filteredDemands.reduce((acc: any, demand) => {
        const serviceName = demand.service?.name || 'Não informado'
        acc[serviceName] = (acc[serviceName] || 0) + 1
        return acc
      }, {})

      return {
        data: filteredDemands,
        summary: {
          total: filteredDemands.length,
          statusStats,
          serviceStats,
          withAttendance: filteredDemands.filter(d => d.attendances.length > 0).length,
          averageAttendances: filteredDemands.length > 0
            ? filteredDemands.reduce((sum, d) => sum + d.attendances.length, 0) / filteredDemands.length
            : 0
        }
      }

    } catch (error) {
      console.error('Erro ao gerar relatório de demandas:', error)
      throw error
    }
  }

  // Gerar relatório de estudantes (usando dados mock)
  async generateStudentReport() {
    try {
      // Simular dados de estudantes com estatísticas
      const mockStudents = [
        {
          id: '1',
          name: 'Ana Silva Santos',
          email: 'ana.santos@estudante.com',
          createdAt: new Date('2023-02-15'),
          totalAttendances: 25,
          validatedAttendances: 22,
          pendingAttendances: 3,
          totalHours: 120,
          averageHours: 5.5,
          lastAttendance: new Date('2024-01-15'),
          performance: 'Excelente'
        },
        {
          id: '2',
          name: 'Carlos Eduardo Lima',
          email: 'carlos.lima@estudante.com',
          createdAt: new Date('2023-03-20'),
          totalAttendances: 22,
          validatedAttendances: 20,
          pendingAttendances: 2,
          totalHours: 110,
          averageHours: 5.0,
          lastAttendance: new Date('2024-01-16'),
          performance: 'Excelente'
        },
        {
          id: '3',
          name: 'Maria Fernanda Costa',
          email: 'maria.costa@estudante.com',
          createdAt: new Date('2023-01-10'),
          totalAttendances: 20,
          validatedAttendances: 18,
          pendingAttendances: 2,
          totalHours: 95,
          averageHours: 4.8,
          lastAttendance: new Date('2024-01-17'),
          performance: 'Muito Bom'
        },
        {
          id: '4',
          name: 'João Pedro Oliveira',
          email: 'joao.oliveira@estudante.com',
          createdAt: new Date('2023-04-05'),
          totalAttendances: 18,
          validatedAttendances: 16,
          pendingAttendances: 2,
          totalHours: 88,
          averageHours: 4.9,
          lastAttendance: new Date('2024-01-14'),
          performance: 'Muito Bom'
        },
        {
          id: '5',
          name: 'Luisa Martins Rocha',
          email: 'luisa.rocha@estudante.com',
          createdAt: new Date('2023-06-12'),
          totalAttendances: 16,
          validatedAttendances: 14,
          pendingAttendances: 2,
          totalHours: 80,
          averageHours: 5.0,
          lastAttendance: new Date('2024-01-13'),
          performance: 'Muito Bom'
        }
      ]

      return {
        data: mockStudents,
        summary: {
          total: mockStudents.length,
          active: mockStudents.filter(s => s.totalAttendances > 0).length,
          averageHours: mockStudents.reduce((sum, s) => sum + s.totalHours, 0) / mockStudents.length,
          topPerformer: mockStudents[0] || null
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

  // Exportar relatório para PDF com gráficos
  async exportToPDF(reportType: 'attendance' | 'demand' | 'student', data: any[], chartData: ChartData): Promise<Buffer> {
    try {
      const doc = new (jsPDF as any)()

      // Configurações iniciais
      doc.setFontSize(20)
      doc.text('Relatório NAF Contábil', 14, 22)
      doc.setFontSize(12)
      doc.text(`Tipo: ${reportType === 'attendance' ? 'Atendimentos' : reportType === 'demand' ? 'Demandas' : 'Estudantes'}`, 14, 32)
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 42)

      let currentY = 55

      // Adicionar resumo de gráficos
      doc.setFontSize(14)
      doc.text('Resumo dos Gráficos:', 14, currentY)
      currentY += 10

      doc.setFontSize(10)

      // Gráfico de Pizza - Status
      if (chartData.pieCharts.statusDistribution.length > 0) {
        doc.text('Distribuição por Status:', 14, currentY)
        currentY += 5
        chartData.pieCharts.statusDistribution.forEach(item => {
          doc.text(`• ${item.label}: ${item.value} (${((item.value / chartData.pieCharts.statusDistribution.reduce((sum, x) => sum + x.value, 0)) * 100).toFixed(1)}%)`, 20, currentY)
          currentY += 4
        })
        currentY += 5
      }

      // Gráfico de Pizza - Serviços
      if (chartData.pieCharts.serviceDistribution.length > 0) {
        doc.text('Distribuição por Serviços:', 14, currentY)
        currentY += 5
        chartData.pieCharts.serviceDistribution.forEach(item => {
          doc.text(`• ${item.label}: ${item.value}`, 20, currentY)
          currentY += 4
        })
        currentY += 5
      }

      // Top Estudantes
      if (chartData.barCharts.topStudents.length > 0) {
        doc.text('Top 10 Estudantes por Horas:', 14, currentY)
        currentY += 5
        chartData.barCharts.topStudents.forEach((item, index) => {
          doc.text(`${index + 1}. ${item.label}: ${item.value}h`, 20, currentY)
          currentY += 4
        })
        currentY += 10
      }

      // Adicionar dados tabulares
      if (currentY > 250) {
        doc.addPage()
        currentY = 20
      }

      doc.setFontSize(14)
      doc.text('Dados Detalhados:', 14, currentY)
      currentY += 10

      // Configurar tabela baseada no tipo
      let tableData: any[] = []
      let headers: string[] = []

      switch (reportType) {
        case 'attendance':
          headers = ['Protocolo', 'Estudante', 'Categoria', 'Horas', 'Status', 'Data']
          tableData = data.slice(0, 50).map(item => [
            item.protocol || 'N/A',
            item.user?.name || 'N/A',
            item.category || 'N/A',
            item.hours || 0,
            item.status || 'N/A',
            new Date(item.createdAt).toLocaleDateString('pt-BR')
          ])
          break
        case 'demand':
          headers = ['Protocolo', 'Cliente', 'Serviço', 'Status', 'Atendimentos', 'Data']
          tableData = data.slice(0, 50).map(item => [
            item.protocolNumber || 'N/A',
            item.clientName || 'N/A',
            item.service?.name || 'N/A',
            item.status || 'N/A',
            item.attendances?.length || 0,
            new Date(item.createdAt).toLocaleDateString('pt-BR')
          ])
          break
        case 'student':
          headers = ['Nome', 'Email', 'Atendimentos', 'Horas', 'Performance']
          tableData = data.slice(0, 50).map(item => [
            item.name || 'N/A',
            item.email || 'N/A',
            item.totalAttendances || 0,
            item.totalHours || 0,
            item.performance || 'N/A'
          ])
          break
      }

      (doc as any).autoTable({
        head: [headers],
        body: tableData,
        startY: currentY,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }
      })

      return Buffer.from(doc.output('arraybuffer'))

    } catch (error) {
      console.error('Erro ao exportar para PDF:', error)
      throw error
    }
  }

  // Exportar relatório para TXT com gráficos
  async exportToTXT(reportType: 'attendance' | 'demand' | 'student', data: any[], chartData: ChartData): Promise<Buffer> {
    try {
      let content = '='.repeat(80) + '\n'
      content += 'RELATÓRIO NAF CONTÁBIL\n'
      content += '='.repeat(80) + '\n\n'
      content += `Tipo: ${reportType === 'attendance' ? 'Atendimentos' : reportType === 'demand' ? 'Demandas' : 'Estudantes'}\n`
      content += `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}\n\n`

      // Seção de Gráficos
      content += '-'.repeat(50) + '\n'
      content += 'RESUMO DOS GRÁFICOS\n'
      content += '-'.repeat(50) + '\n\n'

      // Gráfico de Pizza - Status
      if (chartData.pieCharts.statusDistribution.length > 0) {
        content += 'DISTRIBUIÇÃO POR STATUS:\n'
        const totalStatus = chartData.pieCharts.statusDistribution.reduce((sum, x) => sum + x.value, 0)
        chartData.pieCharts.statusDistribution.forEach(item => {
          const percentage = ((item.value / totalStatus) * 100).toFixed(1)
          content += `  • ${item.label.padEnd(20)}: ${item.value.toString().padStart(6)} (${percentage.padStart(5)}%)\n`
        })
        content += '\n'
      }

      // Gráfico de Pizza - Serviços
      if (chartData.pieCharts.serviceDistribution.length > 0) {
        content += 'DISTRIBUIÇÃO POR SERVIÇOS:\n'
        chartData.pieCharts.serviceDistribution.forEach(item => {
          content += `  • ${item.label.padEnd(30)}: ${item.value.toString().padStart(6)}\n`
        })
        content += '\n'
      }

      // Top Estudantes
      if (chartData.barCharts.topStudents.length > 0) {
        content += 'TOP 10 ESTUDANTES POR HORAS:\n'
        chartData.barCharts.topStudents.forEach((item, index) => {
          content += `  ${(index + 1).toString().padStart(2)}. ${item.label.padEnd(25)}: ${item.value.toString().padStart(6)}h\n`
        })
        content += '\n'
      }

      // Dados Detalhados
      content += '-'.repeat(50) + '\n'
      content += 'DADOS DETALHADOS\n'
      content += '-'.repeat(50) + '\n\n'

      // Cabeçalho da tabela baseado no tipo
      switch (reportType) {
        case 'attendance':
          content += 'PROTOCOLO'.padEnd(15) + 'ESTUDANTE'.padEnd(25) + 'CATEGORIA'.padEnd(20) + 'HORAS'.padEnd(8) + 'STATUS'.padEnd(15) + 'DATA\n'
          content += '-'.repeat(88) + '\n'
          data.slice(0, 100).forEach(item => {
            content += (item.protocol || 'N/A').substring(0, 14).padEnd(15) +
                      (item.user?.name || 'N/A').substring(0, 24).padEnd(25) +
                      (item.category || 'N/A').substring(0, 19).padEnd(20) +
                      (item.hours || 0).toString().padEnd(8) +
                      (item.status || 'N/A').substring(0, 14).padEnd(15) +
                      new Date(item.createdAt).toLocaleDateString('pt-BR') + '\n'
          })
          break
        case 'demand':
          content += 'PROTOCOLO'.padEnd(15) + 'CLIENTE'.padEnd(25) + 'SERVIÇO'.padEnd(25) + 'STATUS'.padEnd(15) + 'DATA\n'
          content += '-'.repeat(85) + '\n'
          data.slice(0, 100).forEach(item => {
            content += (item.protocolNumber || 'N/A').substring(0, 14).padEnd(15) +
                      (item.clientName || 'N/A').substring(0, 24).padEnd(25) +
                      (item.service?.name || 'N/A').substring(0, 24).padEnd(25) +
                      (item.status || 'N/A').substring(0, 14).padEnd(15) +
                      new Date(item.createdAt).toLocaleDateString('pt-BR') + '\n'
          })
          break
        case 'student':
          content += 'NOME'.padEnd(25) + 'EMAIL'.padEnd(30) + 'ATEND.'.padEnd(8) + 'HORAS'.padEnd(8) + 'PERFORMANCE\n'
          content += '-'.repeat(76) + '\n'
          data.slice(0, 100).forEach(item => {
            content += (item.name || 'N/A').substring(0, 24).padEnd(25) +
                      (item.email || 'N/A').substring(0, 29).padEnd(30) +
                      (item.totalAttendances || 0).toString().padEnd(8) +
                      (item.totalHours || 0).toString().padEnd(8) +
                      (item.performance || 'N/A') + '\n'
          })
          break
      }

      content += '\n' + '='.repeat(80) + '\n'
      content += 'Fim do Relatório\n'
      content += '='.repeat(80)

      return Buffer.from(content, 'utf-8')

    } catch (error) {
      console.error('Erro ao exportar para TXT:', error)
      throw error
    }
  }

  // Exportar relatório para DOCX com gráficos
  async exportToDOCX(reportType: 'attendance' | 'demand' | 'student', data: any[], chartData: ChartData): Promise<Buffer> {
    try {
      // Simulação de geração DOCX (em uma implementação real, usaria bibliotecas como docx)
      let content = `RELATÓRIO NAF CONTÁBIL - ${reportType.toUpperCase()}\n\n`
      content += `Gerado em: ${new Date().toLocaleDateString('pt-BR')}\n\n`

      content += 'GRÁFICOS E ESTATÍSTICAS:\n\n'

      // Adicionar dados dos gráficos
      if (chartData.pieCharts.statusDistribution.length > 0) {
        content += 'Distribuição por Status:\n'
        chartData.pieCharts.statusDistribution.forEach(item => {
          content += `- ${item.label}: ${item.value}\n`
        })
        content += '\n'
      }

      content += 'DADOS DETALHADOS:\n\n'

      // Adicionar dados em formato de texto estruturado
      data.slice(0, 50).forEach((item, index) => {
        content += `Registro ${index + 1}:\n`
        Object.keys(item).forEach(key => {
          if (typeof item[key] !== 'object') {
            content += `  ${key}: ${item[key]}\n`
          }
        })
        content += '\n'
      })

      return Buffer.from(content, 'utf-8')

    } catch (error) {
      console.error('Erro ao exportar para DOCX:', error)
      throw error
    }
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

  // Gerar dados para gráficos
  async generateChartData(): Promise<ChartData> {
    try {
      const [attendanceData, demandData, studentData, dashboardStats] = await Promise.all([
        this.generateAttendanceReport({}),
        this.generateDemandReport({}),
        this.generateStudentReport(),
        this.getDashboardStats()
      ])

      // Cores para os gráficos
      const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

      // Gráfico de pizza - Distribuição por Status
      const statusDistribution = Object.entries(demandData.summary.statusStats).map(([status, count], index) => ({
        label: status,
        value: count as number,
        color: pieColors[index % pieColors.length]
      }))

      // Gráfico de pizza - Distribuição por Serviços
      const serviceDistribution = Object.entries(demandData.summary.serviceStats)
        .slice(0, 8)
        .map(([service, count], index) => ({
          label: service.length > 20 ? service.substring(0, 17) + '...' : service,
          value: count as number,
          color: pieColors[index % pieColors.length]
        }))

      // Gráfico de pizza - Performance dos Estudantes
      const performanceGroups = studentData.data.reduce((acc: any, student) => {
        acc[student.performance] = (acc[student.performance] || 0) + 1
        return acc
      }, {})

      const studentPerformance = Object.entries(performanceGroups).map(([performance, count], index) => ({
        label: performance,
        value: count as number,
        color: pieColors[index % pieColors.length]
      }))

      // Gráfico de barras - Top 10 Estudantes
      const topStudents = studentData.data
        .slice(0, 10)
        .map(student => ({
          label: student.name.length > 15 ? student.name.substring(0, 12) + '...' : student.name,
          value: student.totalHours
        }))

      // Gráfico de barras - Popularidade dos Serviços
      const servicePopularity = dashboardStats.topServices.map(service => ({
        label: service.name.length > 20 ? service.name.substring(0, 17) + '...' : service.name,
        value: service.count
      }))

      // Dados de tendência mensal (simulado)
      const now = new Date()
      const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short' })
        return {
          label: monthName,
          value: Math.floor(Math.random() * 50) + 20 // Simulado
        }
      })

      // Crescimento de atendimentos (simulado)
      const attendanceGrowth = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short' })
        return {
          label: monthName,
          value: Math.floor(Math.random() * 100) + 50 // Simulado
        }
      })

      // Tendência de demandas (simulado)
      const demandTrends = Array.from({ length: 8 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (7 - i), 1)
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short' })
        return {
          label: monthName,
          value: Math.floor(Math.random() * 80) + 30 // Simulado
        }
      })

      return {
        pieCharts: {
          statusDistribution,
          serviceDistribution,
          studentPerformance
        },
        barCharts: {
          monthlyTrends,
          topStudents,
          servicePopularity
        },
        lineCharts: {
          attendanceGrowth,
          demandTrends
        }
      }

    } catch (error) {
      console.error('Erro ao gerar dados para gráficos:', error)
      throw error
    }
  }

  // Gerar dados para Power BI
  async generatePowerBIData() {
    try {
      const [attendanceData, demandData, studentData, chartData] = await Promise.all([
        this.generateAttendanceReport({}),
        this.generateDemandReport({}),
        this.generateStudentReport(),
        this.generateChartData()
      ])

      return {
        attendances: attendanceData.data,
        demands: demandData.data,
        students: studentData.data,
        charts: chartData,
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
    console.log('📊 Advanced Reports API - Processing request')

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const format = searchParams.get('format')

    console.log(`📊 Report type: ${type}, Format: ${format}`)

    switch (type) {
      case 'dashboard':
        const stats = await reportsService.getDashboardStats()
        return NextResponse.json({ success: true, data: stats })

      case 'general':
        // Alias para dashboard stats
        const generalStats = await reportsService.getDashboardStats()
        const generalChartData = await reportsService.generateChartData()

        if (format === 'json') {
          return NextResponse.json({
            success: true,
            data: generalStats,
            charts: generalChartData
          })
        }

        // Para outros formatos, usar dados de atendimentos como base
        const attendanceData = await reportsService.generateAttendanceReport({})

        if (format === 'excel') {
          const buffer = await reportsService.exportToExcel('attendance', attendanceData.data)
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Content-Disposition': `attachment; filename="relatorio-geral-${new Date().toISOString().split('T')[0]}.xlsx"`
            }
          })
        }

        break

      case 'attendance':
        const attendanceReport = await reportsService.generateAttendanceReport({
          startDate: searchParams.get('startDate') || undefined,
          endDate: searchParams.get('endDate') || undefined,
          status: searchParams.get('status') || undefined,
          studentId: searchParams.get('studentId') || undefined,
          category: searchParams.get('category') || undefined
        })

        // Gerar dados de gráficos para exportação
        const chartData = await reportsService.generateChartData()

        if (format === 'excel') {
          const buffer = await reportsService.exportToExcel('attendance', attendanceReport.data)
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Content-Disposition': `attachment; filename="relatorio-atendimentos-${new Date().toISOString().split('T')[0]}.xlsx"`
            }
          })
        }

        if (format === 'pdf') {
          const buffer = await reportsService.exportToPDF('attendance', attendanceReport.data, chartData)
          return new NextResponse(buffer as any, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="relatorio-atendimentos-${new Date().toISOString().split('T')[0]}.pdf"`
            }
          })
        }

        if (format === 'txt') {
          const buffer = await reportsService.exportToTXT('attendance', attendanceReport.data, chartData)
          return new NextResponse(buffer as any, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Content-Disposition': `attachment; filename="relatorio-atendimentos-${new Date().toISOString().split('T')[0]}.txt"`
            }
          })
        }

        if (format === 'doc' || format === 'docx') {
          const buffer = await reportsService.exportToDOCX('attendance', attendanceReport.data, chartData)
          return new NextResponse(buffer as any, {
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'Content-Disposition': `attachment; filename="relatorio-atendimentos-${new Date().toISOString().split('T')[0]}.docx"`
            }
          })
        }

        return NextResponse.json({ success: true, data: attendanceReport, charts: chartData })

      case 'demand':
        const demandReport = await reportsService.generateDemandReport({
          startDate: searchParams.get('startDate') || undefined,
          endDate: searchParams.get('endDate') || undefined,
          status: searchParams.get('status') || undefined,
          serviceType: searchParams.get('serviceType') || undefined
        })

        const demandChartData = await reportsService.generateChartData()

        if (format === 'excel') {
          const buffer = await reportsService.exportToExcel('demand', demandReport.data)
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Content-Disposition': `attachment; filename="relatorio-demandas-${new Date().toISOString().split('T')[0]}.xlsx"`
            }
          })
        }

        if (format === 'pdf') {
          const buffer = await reportsService.exportToPDF('demand', demandReport.data, demandChartData)
          return new NextResponse(buffer as any, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="relatorio-demandas-${new Date().toISOString().split('T')[0]}.pdf"`
            }
          })
        }

        if (format === 'txt') {
          const buffer = await reportsService.exportToTXT('demand', demandReport.data, demandChartData)
          return new NextResponse(buffer as any, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Content-Disposition': `attachment; filename="relatorio-demandas-${new Date().toISOString().split('T')[0]}.txt"`
            }
          })
        }

        if (format === 'doc' || format === 'docx') {
          const buffer = await reportsService.exportToDOCX('demand', demandReport.data, demandChartData)
          return new NextResponse(buffer as any, {
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'Content-Disposition': `attachment; filename="relatorio-demandas-${new Date().toISOString().split('T')[0]}.docx"`
            }
          })
        }

        return NextResponse.json({ success: true, data: demandReport, charts: demandChartData })

      case 'student':
        const studentReport = await reportsService.generateStudentReport()
        const studentChartData = await reportsService.generateChartData()

        if (format === 'excel') {
          const buffer = await reportsService.exportToExcel('student', studentReport.data)
          return new NextResponse(buffer as any, {
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Content-Disposition': `attachment; filename="relatorio-estudantes-${new Date().toISOString().split('T')[0]}.xlsx"`
            }
          })
        }

        if (format === 'pdf') {
          const buffer = await reportsService.exportToPDF('student', studentReport.data, studentChartData)
          return new NextResponse(buffer as any, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="relatorio-estudantes-${new Date().toISOString().split('T')[0]}.pdf"`
            }
          })
        }

        if (format === 'txt') {
          const buffer = await reportsService.exportToTXT('student', studentReport.data, studentChartData)
          return new NextResponse(buffer as any, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Content-Disposition': `attachment; filename="relatorio-estudantes-${new Date().toISOString().split('T')[0]}.txt"`
            }
          })
        }

        if (format === 'doc' || format === 'docx') {
          const buffer = await reportsService.exportToDOCX('student', studentReport.data, studentChartData)
          return new NextResponse(buffer as any, {
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'Content-Disposition': `attachment; filename="relatorio-estudantes-${new Date().toISOString().split('T')[0]}.docx"`
            }
          })
        }

        return NextResponse.json({ success: true, data: studentReport, charts: studentChartData })

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
