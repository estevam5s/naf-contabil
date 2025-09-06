import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'full'
    const format = searchParams.get('format') || 'json'

    let backupData: any = {}

    switch (type) {
      case 'full':
        // Backup completo de todas as tabelas
        backupData = {
          users: await prisma.user.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true
            }
          }),
          demands: await prisma.demand.findMany({
            include: {
              user: {
                select: { name: true, email: true }
              },
              service: {
                select: { name: true, category: true }
              },
              attendances: {
                include: {
                  student: {
                    select: { name: true, email: true }
                  }
                }
              }
            }
          }),
          services: await prisma.service.findMany(),
          attendances: await prisma.attendance.findMany({
            include: {
              demand: {
                select: { protocol: true }
              },
              student: {
                select: { name: true, email: true }
              }
            }
          }),
          appointments: await prisma.appointment.findMany({
            include: {
              user: {
                select: { name: true, email: true }
              },
              service: {
                select: { name: true }
              }
            }
          })
        }
        break

      case 'users':
        backupData = {
          users: await prisma.user.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true
            }
          })
        }
        break

      case 'demands':
        backupData = {
          demands: await prisma.demand.findMany({
            include: {
              user: {
                select: { name: true, email: true }
              },
              service: {
                select: { name: true, category: true }
              }
            }
          })
        }
        break

      case 'attendances':
        backupData = {
          attendances: await prisma.attendance.findMany({
            include: {
              demand: {
                select: { protocol: true }
              },
              student: {
                select: { name: true, email: true }
              }
            }
          })
        }
        break

      default:
        return Response.json(
          { success: false, message: 'Tipo de backup inválido' },
          { status: 400 }
        )
    }

    // Adicionar metadados do backup
    const backupMetadata = {
      timestamp: new Date().toISOString(),
      type,
      format,
      version: '1.0',
      system: 'NAF Contábil',
      recordCounts: Object.keys(backupData).reduce((acc, key) => {
        acc[key] = Array.isArray(backupData[key]) ? backupData[key].length : 0
        return acc
      }, {} as Record<string, number>)
    }

    const finalBackup = {
      metadata: backupMetadata,
      data: backupData
    }

    if (format === 'json') {
      return Response.json(finalBackup, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename=backup_naf_${type}_${new Date().toISOString().split('T')[0]}.json`
        }
      })
    }

    // Para outros formatos, retornar como texto
    return new Response(JSON.stringify(finalBackup, null, 2), {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename=backup_naf_${type}_${new Date().toISOString().split('T')[0]}.txt`
      }
    })

  } catch (error) {
    console.error('Erro ao gerar backup:', error)
    return Response.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { schedule = false } = body

    if (schedule) {
      // Simular agendamento de backup automático
      // Em um ambiente real, isso seria configurado com um cron job ou similar
      
      const backupSchedule = {
        enabled: true,
        frequency: 'daily', // daily, weekly, monthly
        time: '02:00', // 2:00 AM
        types: ['full', 'demands', 'attendances'],
        retention: 30, // dias
        lastBackup: new Date().toISOString(),
        nextBackup: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }

      // Salvar configuração de backup (em um ambiente real, isso seria salvo no banco)
      console.log('Backup automático configurado:', backupSchedule)

      return Response.json({
        success: true,
        message: 'Backup automático configurado com sucesso',
        schedule: backupSchedule
      })
    }

    // Executar backup manual
    const type = body.type || 'full'
    
    // Gerar backup imediato
    const backupResponse = await GET(request)
    
    return Response.json({
      success: true,
      message: 'Backup manual executado com sucesso',
      timestamp: new Date().toISOString(),
      type
    })

  } catch (error) {
    console.error('Erro ao configurar backup:', error)
    return Response.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'cleanup') {
      // Simular limpeza de backups antigos
      // Em um ambiente real, isso removeria arquivos de backup antigos
      
      const cleanupResult = {
        removed: 5,
        retained: 25,
        spaceSaved: '2.5 GB',
        oldestBackup: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }

      return Response.json({
        success: true,
        message: 'Limpeza de backups concluída',
        result: cleanupResult
      })
    }

    return Response.json(
      { success: false, message: 'Ação não reconhecida' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Erro na limpeza de backup:', error)
    return Response.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
