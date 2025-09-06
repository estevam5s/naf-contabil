// Sistema de Notificações por Email - NAF Contábil
import nodemailer from 'nodemailer'

interface EmailData {
  to: string
  subject: string
  html: string
  attachments?: any[]
}

interface NotificationData {
  type: 'schedule_confirmation' | 'attendance_validation' | 'demand_update' | 'reminder'
  recipient: {
    name: string
    email: string
    role?: string
  }
  data: any
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initTransporter()
  }

  private initTransporter() {
    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        })
      } else {
        console.warn('Configurações SMTP não encontradas, usando modo de desenvolvimento')
        this.transporter = null
      }
    } catch (error) {
      console.error('Erro ao inicializar transporter de email:', error)
      this.transporter = null
    }
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.log(`[MODO DEV] Email simulado para: ${data.to}`)
        console.log(`[MODO DEV] Assunto: ${data.subject}`)
        return true
      }

      const mailOptions = {
        from: `"NAF Contábil" <${process.env.SMTP_USER}>`,
        to: data.to,
        subject: data.subject,
        html: data.html,
        attachments: data.attachments || []
      }

      await this.transporter.sendMail(mailOptions)
      console.log(`Email enviado para: ${data.to}`)
      return true
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      return false
    }
  }

  // Template para confirmação de agendamento
  private getScheduleConfirmationTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1e40af, #059669); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .info-box { background: #f8fafc; border-left: 4px solid #1e40af; padding: 15px; margin: 15px 0; }
            .button { background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
            .footer { background: #f1f5f9; padding: 15px; text-align: center; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎯 NAF Contábil</h1>
            <h2>Confirmação de Agendamento</h2>
          </div>
          
          <div class="content">
            <p>Olá <strong>${data.clientName}</strong>,</p>
            
            <p>Seu agendamento foi registrado com sucesso! Seguem os detalhes:</p>
            
            <div class="info-box">
              <h3>📋 Detalhes do Agendamento</h3>
              <p><strong>Protocolo:</strong> ${data.protocol}</p>
              <p><strong>Serviço:</strong> ${data.serviceName}</p>
              <p><strong>Data:</strong> ${data.date}</p>
              <p><strong>Horário:</strong> ${data.time}</p>
              <p><strong>Local:</strong> ${data.location || 'A definir'}</p>
            </div>
            
            <div class="info-box">
              <h3>📝 Próximos Passos</h3>
              <ul>
                <li>Um professor/coordenador será designado para seu atendimento</li>
                <li>Você receberá uma confirmação final em até 48 horas</li>
                <li>Prepare a documentação necessária para o serviço</li>
                <li>Chegue com 10 minutos de antecedência</li>
              </ul>
            </div>
            
            <div class="info-box">
              <h3>📄 Documentos Necessários</h3>
              <p>Para ${data.serviceName}, você precisará de:</p>
              <ul>
                ${data.requiredDocs?.map((doc: string) => `<li>${doc}</li>`).join('') || '<li>Documentos serão informados na confirmação</li>'}
              </ul>
            </div>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">
                Acompanhar Status
              </a>
            </p>
          </div>
          
          <div class="footer">
            <p><strong>NAF - Núcleo de Apoio Contábil e Fiscal</strong></p>
            <p>📧 ${process.env.SMTP_USER} | 📱 WhatsApp: (XX) XXXX-XXXX</p>
            <p>Este é um email automático, não responda.</p>
          </div>
        </body>
      </html>
    `
  }

  // Template para validação de atendimento
  private getAttendanceValidationTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #059669, #1e40af); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .success-box { background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin: 15px 0; }
            .info-box { background: #f8fafc; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; }
            .footer { background: #f1f5f9; padding: 15px; text-align: center; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ NAF Contábil</h1>
            <h2>Atendimento Validado</h2>
          </div>
          
          <div class="content">
            <p>Olá <strong>${data.studentName}</strong>,</p>
            
            <div class="success-box">
              <h3>🎉 Parabéns! Seu atendimento foi validado</h3>
              <p>O atendimento que você prestou foi aprovado pelo professor orientador.</p>
            </div>
            
            <div class="info-box">
              <h3>📋 Detalhes do Atendimento</h3>
              <p><strong>Protocolo:</strong> ${data.protocol}</p>
              <p><strong>Cliente:</strong> ${data.clientName}</p>
              <p><strong>Serviço:</strong> ${data.serviceType}</p>
              <p><strong>Horas Validadas:</strong> ${data.hours}h</p>
              <p><strong>Data:</strong> ${data.date}</p>
              <p><strong>Validado por:</strong> ${data.validatedBy}</p>
            </div>
            
            <div class="info-box">
              <h3>📊 Seu Progresso</h3>
              <p><strong>Total de Horas:</strong> ${data.totalHours || 'Consulte o dashboard'}h</p>
              <p><strong>Atendimentos Validados:</strong> ${data.totalAttendances || 'Consulte o dashboard'}</p>
              <p><strong>Nível:</strong> ${data.level || 'Consulte o dashboard'}</p>
            </div>
            
            ${data.feedback ? `
              <div class="info-box">
                <h3>💬 Feedback do Professor</h3>
                <p><em>"${data.feedback}"</em></p>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p><strong>NAF - Núcleo de Apoio Contábil e Fiscal</strong></p>
            <p>Continue prestando excelentes atendimentos!</p>
          </div>
        </body>
      </html>
    `
  }

  // Template para lembretes
  private getReminderTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #f59e0b, #1e40af); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .reminder-box { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 15px 0; }
            .button { background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
            .footer { background: #f1f5f9; padding: 15px; text-align: center; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>⏰ NAF Contábil</h1>
            <h2>Lembrete de Agendamento</h2>
          </div>
          
          <div class="content">
            <p>Olá <strong>${data.clientName}</strong>,</p>
            
            <div class="reminder-box">
              <h3>📅 Você tem um atendimento amanhã!</h3>
              <p><strong>Protocolo:</strong> ${data.protocol}</p>
              <p><strong>Serviço:</strong> ${data.serviceName}</p>
              <p><strong>Data:</strong> ${data.date}</p>
              <p><strong>Horário:</strong> ${data.time}</p>
              <p><strong>Local:</strong> ${data.location}</p>
            </div>
            
            <h3>📝 Checklist para o Atendimento:</h3>
            <ul>
              <li>✅ Chegue 10 minutos antes do horário</li>
              <li>📄 Traga todos os documentos necessários</li>
              <li>📱 Tenha em mãos o protocolo: <strong>${data.protocol}</strong></li>
              <li>🆔 Documento de identificação com foto</li>
            </ul>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">
                Ver Detalhes
              </a>
            </p>
            
            <p><small><strong>Importante:</strong> Se não puder comparecer, entre em contato conosco com antecedência.</small></p>
          </div>
          
          <div class="footer">
            <p><strong>NAF - Núcleo de Apoio Contábil e Fiscal</strong></p>
            <p>📧 ${process.env.SMTP_USER} | 📱 WhatsApp: (XX) XXXX-XXXX</p>
          </div>
        </body>
      </html>
    `
  }

  // Método principal para enviar notificações
  async sendNotification(notification: NotificationData): Promise<boolean> {
    try {
      let subject = ''
      let template = ''

      switch (notification.type) {
        case 'schedule_confirmation':
          subject = `✅ Agendamento Confirmado - Protocolo ${notification.data.protocol}`
          template = this.getScheduleConfirmationTemplate(notification.data)
          break

        case 'attendance_validation':
          subject = `🎉 Atendimento Validado - ${notification.data.hours}h adicionadas`
          template = this.getAttendanceValidationTemplate(notification.data)
          break

        case 'demand_update':
          subject = `📋 Atualização da Demanda ${notification.data.protocol}`
          template = `<p>Sua demanda ${notification.data.protocol} foi atualizada. Status: ${notification.data.status}</p>`
          break

        case 'reminder':
          subject = `⏰ Lembrete: Atendimento amanhã - ${notification.data.serviceName}`
          template = this.getReminderTemplate(notification.data)
          break

        default:
          throw new Error('Tipo de notificação inválido')
      }

      return await this.sendEmail({
        to: notification.recipient.email,
        subject,
        html: template
      })

    } catch (error) {
      console.error('Erro ao enviar notificação:', error)
      return false
    }
  }

  // Enviar lembrete em lote
  async sendBatchReminders(appointments: any[]): Promise<void> {
    for (const appointment of appointments) {
      await this.sendNotification({
        type: 'reminder',
        recipient: {
          name: appointment.clientName,
          email: appointment.clientEmail
        },
        data: appointment
      })
      
      // Delay para evitar spam
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}

export const emailService = new EmailService()
export default EmailService
