// Notification service for creating and managing system notifications

interface CreateNotificationParams {
  recipientId: string
  recipientType: 'user' | 'student' | 'coordinator'
  recipientEmail?: string
  templateName?: string
  variables?: Record<string, any>
  title?: string
  message?: string
  notificationType?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  icon?: string
  color?: string
  actionUrl?: string
  actionLabel?: string
  metadata?: any
  sendEmail?: boolean
  expiresHours?: number
}

export class NotificationService {
  private static baseUrl = ''

  // Create notification using template
  static async createFromTemplate(params: CreateNotificationParams): Promise<any> {
    try {
      const response = await fetch('/api/notifications/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateName: params.templateName,
          recipientId: params.recipientId,
          recipientType: params.recipientType,
          recipientEmail: params.recipientEmail,
          variables: params.variables || {},
          metadata: params.metadata || {}
        })
      })

      if (response.ok) {
        return await response.json()
      } else {
        console.error('Failed to create notification from template:', await response.text())
        return null
      }
    } catch (error) {
      console.error('Error creating notification from template:', error)
      return null
    }
  }

  // Create custom notification
  static async createCustom(params: CreateNotificationParams): Promise<any> {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: params.recipientId,
          recipientType: params.recipientType,
          title: params.title,
          message: params.message,
          notificationType: params.notificationType || 'system_notification',
          priority: params.priority || 'medium',
          icon: params.icon,
          color: params.color,
          actionUrl: params.actionUrl,
          actionLabel: params.actionLabel,
          metadata: params.metadata || {},
          sendEmail: params.sendEmail || false,
          expiresHours: params.expiresHours
        })
      })

      if (response.ok) {
        return await response.json()
      } else {
        console.error('Failed to create custom notification:', await response.text())
        return null
      }
    } catch (error) {
      console.error('Error creating custom notification:', error)
      return null
    }
  }

  // Appointment-related notifications
  static async notifyAppointmentScheduled(
    appointmentData: any,
    recipientId: string,
    recipientType: 'student' | 'coordinator' | 'user'
  ) {
    return await this.createFromTemplate({
      templateName: 'appointment_scheduled',
      recipientId,
      recipientType,
      variables: {
        client_name: appointmentData.client_name,
        service_type: appointmentData.service_type,
        scheduled_date: appointmentData.scheduled_date,
        scheduled_time: appointmentData.scheduled_time,
        protocol: appointmentData.protocol
      },
      metadata: {
        appointment_id: appointmentData.id,
        type: 'appointment_notification'
      }
    })
  }

  static async notifyAppointmentConfirmed(
    appointmentData: any,
    recipientId: string,
    recipientType: 'student' | 'coordinator' | 'user'
  ) {
    return await this.createFromTemplate({
      templateName: 'appointment_confirmed',
      recipientId,
      recipientType,
      variables: {
        client_name: appointmentData.client_name,
        service_type: appointmentData.service_type,
        scheduled_date: appointmentData.scheduled_date,
        scheduled_time: appointmentData.scheduled_time,
        protocol: appointmentData.protocol
      },
      metadata: {
        appointment_id: appointmentData.id,
        type: 'appointment_notification'
      }
    })
  }

  static async notifyAppointmentReminder(
    appointmentData: any,
    recipientId: string,
    recipientType: 'student' | 'coordinator' | 'user'
  ) {
    return await this.createFromTemplate({
      templateName: 'appointment_reminder',
      recipientId,
      recipientType,
      variables: {
        client_name: appointmentData.client_name,
        service_type: appointmentData.service_type,
        scheduled_date: appointmentData.scheduled_date,
        scheduled_time: appointmentData.scheduled_time,
        protocol: appointmentData.protocol
      },
      metadata: {
        appointment_id: appointmentData.id,
        type: 'appointment_reminder'
      }
    })
  }

  static async notifyAppointmentCompleted(
    appointmentData: any,
    recipientId: string,
    recipientType: 'student' | 'coordinator' | 'user'
  ) {
    return await this.createFromTemplate({
      templateName: 'appointment_completed',
      recipientId,
      recipientType,
      variables: {
        client_name: appointmentData.client_name,
        service_type: appointmentData.service_type,
        protocol: appointmentData.protocol
      },
      metadata: {
        appointment_id: appointmentData.id,
        type: 'appointment_notification'
      }
    })
  }

  // Training-related notifications
  static async notifyTrainingAssigned(
    trainingData: any,
    recipientId: string,
    recipientType: 'student'
  ) {
    return await this.createFromTemplate({
      templateName: 'training_assigned',
      recipientId,
      recipientType,
      variables: {
        training_title: trainingData.title,
        difficulty: trainingData.difficulty,
        duration_minutes: trainingData.duration_minutes
      },
      metadata: {
        training_id: trainingData.id,
        type: 'training_notification'
      }
    })
  }

  static async notifyTrainingCompleted(
    trainingData: any,
    recipientId: string,
    recipientType: 'student',
    score?: number
  ) {
    return await this.createFromTemplate({
      templateName: 'training_completed',
      recipientId,
      recipientType,
      variables: {
        training_title: trainingData.title,
        score: score ? score.toString() : 'N/A'
      },
      metadata: {
        training_id: trainingData.id,
        score: score,
        type: 'training_notification'
      }
    })
  }

  // Document-related notifications
  static async notifyDocumentRequired(
    clientData: any,
    recipientId: string,
    recipientType: 'student' | 'coordinator'
  ) {
    return await this.createFromTemplate({
      templateName: 'document_required',
      recipientId,
      recipientType,
      variables: {
        client_name: clientData.client_name,
        service_type: clientData.service_type,
        document_list: clientData.required_documents || 'Documentos específicos'
      },
      metadata: {
        appointment_id: clientData.appointment_id,
        type: 'document_notification'
      }
    })
  }

  // Performance and reporting notifications
  static async notifyPerformanceReport(
    reportData: any,
    recipientId: string,
    recipientType: 'student' | 'coordinator'
  ) {
    return await this.createFromTemplate({
      templateName: 'performance_report',
      recipientId,
      recipientType,
      variables: {
        period: reportData.period,
        total_attendances: reportData.total_attendances?.toString() || '0',
        completion_rate: reportData.completion_rate?.toString() || '0'
      },
      metadata: {
        report_id: reportData.id,
        type: 'performance_notification'
      }
    })
  }

  // System notifications
  static async notifySystemMaintenance(
    maintenanceData: any,
    recipientId: string,
    recipientType: 'user' | 'student' | 'coordinator'
  ) {
    return await this.createFromTemplate({
      templateName: 'system_maintenance',
      recipientId,
      recipientType,
      variables: {
        maintenance_date: maintenanceData.scheduled_date,
        maintenance_time: maintenanceData.scheduled_time,
        estimated_duration: maintenanceData.estimated_duration || '2 horas'
      },
      metadata: {
        maintenance_id: maintenanceData.id,
        type: 'system_notification'
      }
    })
  }

  // Achievement notifications
  static async notifyAchievementEarned(
    achievementData: any,
    recipientId: string,
    recipientType: 'student'
  ) {
    return await this.createFromTemplate({
      templateName: 'achievement_earned',
      recipientId,
      recipientType,
      variables: {
        achievement_title: achievementData.title,
        achievement_description: achievementData.description,
        points_earned: achievementData.points?.toString() || '0'
      },
      metadata: {
        achievement_id: achievementData.id,
        type: 'achievement_notification'
      }
    })
  }

  // Bulk notifications
  static async notifyAllStudents(
    templateName: string,
    variables: Record<string, any>,
    metadata?: any
  ) {
    // This would typically fetch all active students and send notifications
    // For now, we'll create a placeholder implementation
    console.log(`Sending ${templateName} notification to all students with variables:`, variables)
  }

  static async notifyAllCoordinators(
    templateName: string,
    variables: Record<string, any>,
    metadata?: any
  ) {
    // This would typically fetch all coordinators and send notifications
    // For now, we'll create a placeholder implementation
    console.log(`Sending ${templateName} notification to all coordinators with variables:`, variables)
  }
}

// Trigger functions for common system events
export const NotificationTriggers = {
  // When an appointment is created
  onAppointmentCreated: async (appointmentData: any) => {
    // Notify assigned student
    if (appointmentData.assigned_student_id) {
      await NotificationService.notifyAppointmentScheduled(
        appointmentData,
        appointmentData.assigned_student_id,
        'student'
      )
    }

    // Notify coordinators
    await NotificationService.notifyAllCoordinators('appointment_scheduled', {
      client_name: appointmentData.client_name,
      service_type: appointmentData.service_type,
      urgency_level: appointmentData.urgency_level
    })
  },

  // When an appointment status changes
  onAppointmentStatusChanged: async (appointmentData: any, oldStatus: string, newStatus: string) => {
    if (newStatus === 'CONFIRMADO') {
      if (appointmentData.assigned_student_id) {
        await NotificationService.notifyAppointmentConfirmed(
          appointmentData,
          appointmentData.assigned_student_id,
          'student'
        )
      }
    } else if (newStatus === 'CONCLUIDO') {
      if (appointmentData.assigned_student_id) {
        await NotificationService.notifyAppointmentCompleted(
          appointmentData,
          appointmentData.assigned_student_id,
          'student'
        )
      }
    }
  },

  // When a training is assigned to a student
  onTrainingAssigned: async (trainingData: any, studentId: string) => {
    await NotificationService.notifyTrainingAssigned(
      trainingData,
      studentId,
      'student'
    )
  },

  // When a student completes a training
  onTrainingCompleted: async (trainingData: any, studentId: string, score?: number) => {
    await NotificationService.notifyTrainingCompleted(
      trainingData,
      studentId,
      'student',
      score
    )

    // Notify coordinators of training completion
    await NotificationService.notifyAllCoordinators('training_completed', {
      student_name: 'Estudante', // Would be fetched from database
      training_title: trainingData.title,
      score: score?.toString() || 'N/A'
    })
  },

  // Daily reminders for upcoming appointments
  onDailyAppointmentReminders: async () => {
    // This would typically query for appointments scheduled for tomorrow
    // and send reminders to the assigned students
    console.log('Sending daily appointment reminders...')
  },

  // Weekly performance reports
  onWeeklyPerformanceReports: async () => {
    // This would generate and send performance reports to students and coordinators
    console.log('Generating weekly performance reports...')
  },

  // System maintenance notifications
  onSystemMaintenance: async (maintenanceData: any) => {
    // Notify all users about upcoming maintenance
    const userTypes = ['user', 'student', 'coordinator'] as const

    for (const userType of userTypes) {
      // This would fetch all users of this type and send notifications
      console.log(`Notifying all ${userType}s about system maintenance`)
    }
  }
}