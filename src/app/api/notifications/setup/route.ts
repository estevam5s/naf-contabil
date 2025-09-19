import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST - Setup notification templates and sample data
export async function POST(request: NextRequest) {
  try {
    // Sample notification templates
    const templates = [
      {
        template_name: 'appointment_scheduled',
        user_type: 'student',
        notification_type: 'appointment_scheduled',
        title_template: 'Novo Atendimento Agendado',
        message_template: 'Você foi designado para atender {{client_name}} no serviço {{service_type}} em {{scheduled_date}} às {{scheduled_time}}. Protocolo: {{protocol}}',
        default_priority: 'high',
        default_icon: 'calendar',
        default_color: 'blue',
        default_send_email: true,
        default_send_push: false,
        default_send_sms: false,
        default_expires_hours: 48,
        is_persistent: true,
        is_active: true
      },
      {
        template_name: 'appointment_confirmed',
        user_type: 'student',
        notification_type: 'appointment_confirmed',
        title_template: 'Atendimento Confirmado',
        message_template: 'O atendimento para {{client_name}} foi confirmado para {{scheduled_date}} às {{scheduled_time}}. Protocolo: {{protocol}}',
        default_priority: 'medium',
        default_icon: 'check-circle',
        default_color: 'green',
        default_send_email: true,
        default_send_push: false,
        default_send_sms: false,
        default_expires_hours: 24,
        is_persistent: true,
        is_active: true
      },
      {
        template_name: 'appointment_reminder',
        user_type: 'student',
        notification_type: 'appointment_reminder',
        title_template: 'Lembrete de Atendimento',
        message_template: 'Você tem um atendimento com {{client_name}} amanhã ({{scheduled_date}}) às {{scheduled_time}}. Não se esqueça!',
        default_priority: 'medium',
        default_icon: 'clock',
        default_color: 'yellow',
        default_send_email: true,
        default_send_push: false,
        default_send_sms: true,
        default_expires_hours: 12,
        is_persistent: false,
        is_active: true
      },
      {
        template_name: 'appointment_completed',
        user_type: 'student',
        notification_type: 'appointment_completed',
        title_template: 'Atendimento Concluído',
        message_template: 'O atendimento para {{client_name}} foi marcado como concluído. Protocolo: {{protocol}}',
        default_priority: 'low',
        default_icon: 'check-circle-2',
        default_color: 'green',
        default_send_email: false,
        default_send_push: false,
        default_send_sms: false,
        default_expires_hours: 72,
        is_persistent: true,
        is_active: true
      },
      {
        template_name: 'training_assigned',
        user_type: 'student',
        notification_type: 'training_assigned',
        title_template: 'Novo Treinamento Disponível',
        message_template: 'Um novo treinamento foi atribuído a você: "{{training_title}}" ({{difficulty}}). Duração estimada: {{duration_minutes}} minutos.',
        default_priority: 'medium',
        default_icon: 'graduation-cap',
        default_color: 'purple',
        default_send_email: true,
        default_send_push: false,
        default_send_sms: false,
        default_expires_hours: 168, // 1 week
        is_persistent: true,
        is_active: true
      },
      {
        template_name: 'document_required',
        user_type: 'student',
        notification_type: 'document_required',
        title_template: 'Documentos Necessários',
        message_template: 'O cliente {{client_name}} precisa fornecer documentos adicionais para o serviço {{service_type}}. Documentos: {{document_list}}',
        default_priority: 'high',
        default_icon: 'file-text',
        default_color: 'orange',
        default_send_email: true,
        default_send_push: false,
        default_send_sms: false,
        default_expires_hours: 24,
        is_persistent: true,
        is_active: true
      },
      {
        template_name: 'performance_report',
        user_type: 'student',
        notification_type: 'performance_report',
        title_template: 'Relatório de Performance',
        message_template: 'Seu relatório de performance do período {{period}} está disponível. Total de atendimentos: {{total_attendances}}, Taxa de conclusão: {{completion_rate}}%',
        default_priority: 'low',
        default_icon: 'chart-bar',
        default_color: 'blue',
        default_send_email: true,
        default_send_push: false,
        default_send_sms: false,
        default_expires_hours: 168, // 1 week
        is_persistent: true,
        is_active: true
      },
      {
        template_name: 'system_maintenance',
        user_type: 'user',
        notification_type: 'system_maintenance',
        title_template: 'Manutenção Programada do Sistema',
        message_template: 'O sistema entrará em manutenção em {{maintenance_date}} às {{maintenance_time}}. Duração estimada: {{estimated_duration}}.',
        default_priority: 'high',
        default_icon: 'settings',
        default_color: 'red',
        default_send_email: true,
        default_send_push: false,
        default_send_sms: false,
        default_expires_hours: 4,
        is_persistent: false,
        is_active: true
      },
      {
        template_name: 'achievement_earned',
        user_type: 'student',
        notification_type: 'achievement_earned',
        title_template: 'Conquista Desbloqueada! 🏆',
        message_template: 'Parabéns! Você conquistou: "{{achievement_title}}" - {{achievement_description}}. Pontos ganhos: {{points_earned}}',
        default_priority: 'medium',
        default_icon: 'trophy',
        default_color: 'gold',
        default_send_email: false,
        default_send_push: false,
        default_send_sms: false,
        default_expires_hours: 72,
        is_persistent: true,
        is_active: true
      },
      // Coordinator templates
      {
        template_name: 'appointment_scheduled',
        user_type: 'coordinator',
        notification_type: 'appointment_scheduled',
        title_template: 'Novo Atendimento no Sistema',
        message_template: 'Um novo atendimento foi agendado: {{client_name}} solicitou {{service_type}} com urgência {{urgency_level}}.',
        default_priority: 'medium',
        default_icon: 'calendar',
        default_color: 'blue',
        default_send_email: true,
        default_send_push: false,
        default_send_sms: false,
        default_expires_hours: 24,
        is_persistent: true,
        is_active: true
      }
    ]

    // Insert templates
    const { data: templatesData, error: templatesError } = await supabase
      .from('notification_templates')
      .upsert(templates, {
        onConflict: 'template_name,user_type',
        ignoreDuplicates: false
      })

    if (templatesError) {
      console.error('Error inserting templates:', templatesError)
      return NextResponse.json({
        error: 'Erro ao inserir templates',
        details: templatesError
      }, { status: 500 })
    }

    // Sample notifications for demonstration
    const sampleNotifications = [
      {
        recipient_id: 'student-1',
        recipient_type: 'student',
        recipient_email: 'student1@example.com',
        title: 'Bem-vindo ao Sistema NAF!',
        message: 'Sua conta foi ativada com sucesso. Explore os treinamentos disponíveis e comece a atender clientes.',
        notification_type: 'system_notification',
        priority: 'medium',
        icon: 'user-plus',
        color: 'green',
        send_email: false,
        send_push: true,
        send_sms: false,
        is_persistent: true,
        metadata: { type: 'welcome_message' }
      },
      {
        recipient_id: 'coordinator-1',
        recipient_type: 'coordinator',
        recipient_email: 'coordinator1@example.com',
        title: 'Dashboard Coordenador Ativado',
        message: 'Seu acesso ao dashboard de coordenação foi configurado. Você pode acompanhar métricas e gerenciar estudantes.',
        notification_type: 'system_notification',
        priority: 'medium',
        icon: 'settings',
        color: 'blue',
        send_email: false,
        send_push: true,
        send_sms: false,
        is_persistent: true,
        metadata: { type: 'welcome_message' }
      },
      {
        recipient_id: 'naf-admin-1',
        recipient_type: 'user',
        recipient_email: 'admin@naf.edu.br',
        title: 'Sistema de Notificações Ativado',
        message: 'O sistema de notificações está funcionando perfeitamente! Todas as funcionalidades foram integradas com sucesso.',
        notification_type: 'system_notification',
        priority: 'low',
        icon: 'check-circle',
        color: 'green',
        send_email: false,
        send_push: true,
        send_sms: false,
        is_persistent: true,
        metadata: { type: 'system_status' }
      }
    ]

    // Insert sample notifications
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('notifications')
      .insert(sampleNotifications)

    if (notificationsError) {
      console.error('Error inserting sample notifications:', notificationsError)
      return NextResponse.json({
        error: 'Erro ao inserir notificações de exemplo',
        details: notificationsError
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Sistema de notificações configurado com sucesso',
      templates_inserted: templates.length,
      sample_notifications_inserted: sampleNotifications.length,
      templates: templatesData,
      notifications: notificationsData
    }, { status: 201 })

  } catch (error) {
    console.error('Error in notifications setup POST:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// GET - Check setup status
export async function GET() {
  try {
    const { data: templates, error: templatesError } = await supabase
      .from('notification_templates')
      .select('template_name, user_type, is_active')

    if (templatesError) {
      return NextResponse.json({
        error: 'Erro ao verificar templates',
        details: templatesError
      }, { status: 500 })
    }

    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('id, recipient_type, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    if (notificationsError) {
      return NextResponse.json({
        error: 'Erro ao verificar notificações',
        details: notificationsError
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'Sistema de notificações configurado',
      templates_count: templates?.length || 0,
      templates: templates,
      recent_notifications: notifications
    })

  } catch (error) {
    console.error('Error in notifications setup GET:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}