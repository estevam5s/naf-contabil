// Mock do Supabase para desenvolvimento local
interface MockData {
  chat_conversations: Map<string, any>
  chat_messages: Map<string, any[]>
  students: Map<string, any>
  student_performance: Map<string, any>
  student_activity_logs: Map<string, any>
}

class MockSupabaseClient {
  private data: MockData = {
    chat_conversations: new Map(),
    chat_messages: new Map(),
    students: new Map(),
    student_performance: new Map(),
    student_activity_logs: new Map()
  }

  constructor() {
    // Inicializar com alguns dados de teste
    this.data.chat_conversations.set('test-conversation-1', {
      id: 'test-conversation-1',
      user_id: 'user-123',
      user_name: 'Maria Silva',
      user_email: 'maria@email.com',
      status: 'active',
      human_requested: true,
      human_request_timestamp: new Date().toISOString(),
      chat_accepted_by: null,
      chat_accepted_at: null,
      coordinator_id: null,
      created_at: new Date().toISOString()
    })

    this.data.chat_messages.set('test-conversation-1', [
      {
        id: '1',
        conversation_id: 'test-conversation-1',
        content: 'Olá, preciso de ajuda com declaração de IR',
        sender_type: 'user',
        sender_id: 'user-123',
        sender_name: 'Maria Silva',
        is_ai_response: false,
        is_read: true,
        created_at: new Date().toISOString()
      }
    ])
  }

  from(table: string) {
    return new MockTable(table, this.data)
  }
}

class MockTable {
  constructor(private tableName: string, private data: MockData) {}

  select(columns?: string) {
    const query = new MockQuery(this.tableName, this.data, 'select', columns)
    return query
  }

  insert(data: any) {
    return new MockQuery(this.tableName, this.data, 'insert', undefined, data)
  }

  update(data: any) {
    return new MockQuery(this.tableName, this.data, 'update', undefined, data)
  }

  delete() {
    return new MockQuery(this.tableName, this.data, 'delete')
  }
}

class MockQuery {
  private filters: any[] = []
  private updateData: any = null
  private insertData: any = null
  private isSingle: boolean = false

  constructor(
    private tableName: string,
    private data: MockData,
    private operation: string,
    private columns?: string,
    private operationData?: any
  ) {
    if (operation === 'insert') {
      this.insertData = operationData
    } else if (operation === 'update') {
      this.updateData = operationData
    }
  }

  eq(column: string, value: any) {
    this.filters.push({ type: 'eq', column, value })
    return this
  }

  is(column: string, value: any) {
    this.filters.push({ type: 'is', column, value })
    return this
  }

  select(columns?: string) {
    this.columns = columns
    return this
  }

  single() {
    this.isSingle = true
    return this
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.execute().then(onfulfilled, onrejected)
  }

  private async execute() {
    try {
      if (this.tableName === 'chat_conversations') {
        return await this.handleChatConversations()
      } else if (this.tableName === 'chat_messages') {
        return await this.handleChatMessages()
      } else if (this.tableName === 'students') {
        return await this.handleStudents()
      } else if (this.tableName === 'student_performance') {
        return await this.handleStudentPerformance()
      } else if (this.tableName === 'student_activity_logs') {
        return await this.handleStudentActivityLogs()
      }

      return { data: null, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  private async handleChatConversations() {
    if (this.operation === 'update') {
      // Simular update de conversa
      const idFilter = this.filters.find(f => f.column === 'id')
      if (idFilter) {
        const conversation = this.data.chat_conversations.get(idFilter.value)
        if (conversation) {
          const updated = { ...conversation, ...this.updateData }
          this.data.chat_conversations.set(idFilter.value, updated)
          return { data: updated, error: null }
        }
      }
      return { data: null, error: null }
    }

    return { data: null, error: null }
  }

  private async handleChatMessages() {
    if (this.operation === 'insert') {
      // Simular insert de mensagem
      const conversationId = this.insertData.conversation_id
      if (!this.data.chat_messages.has(conversationId)) {
        this.data.chat_messages.set(conversationId, [])
      }

      const message = {
        ...this.insertData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      }

      this.data.chat_messages.get(conversationId)?.push(message)
      return { data: message, error: null }
    }

    return { data: null, error: null }
  }

  private async handleStudents() {
    if (this.operation === 'insert') {
      // Simular insert de estudante
      const studentId = `student-${Date.now()}`
      const student = {
        ...this.insertData,
        id: studentId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Verificar se email já existe
      const studentsArray = Array.from(this.data.students.values())
      if (studentsArray.find(s => s.email === student.email)) {
        return { data: null, error: { message: 'Email já cadastrado' } }
      }

      // Verificar se CPF já existe (se fornecido)
      if (student.document) {
        const cleanDocument = student.document.replace(/\D/g, '')
        if (studentsArray.find(s => s.document === cleanDocument)) {
          return { data: null, error: { message: 'CPF já cadastrado' } }
        }
      }

      // Verificar se matrícula já existe (se fornecida)
      if (student.registration_number) {
        if (studentsArray.find(s => s.registration_number === student.registration_number)) {
          return { data: null, error: { message: 'Número de matrícula já cadastrado' } }
        }
      }

      this.data.students.set(studentId, student)
      return { data: student, error: null }
    }

    if (this.operation === 'select') {
      // Buscar estudante existente
      const emailFilter = this.filters.find(f => f.column === 'email')
      const documentFilter = this.filters.find(f => f.column === 'document')
      const registrationFilter = this.filters.find(f => f.column === 'registration_number')

      if (emailFilter) {
        const studentsArray = Array.from(this.data.students.values())
        const student = studentsArray.find(s => s.email === emailFilter.value)
        if (student) {
          return { data: student, error: null }
        }
      }

      if (documentFilter) {
        const studentsArray = Array.from(this.data.students.values())
        const student = studentsArray.find(s => s.document === documentFilter.value)
        if (student) {
          return { data: student, error: null }
        }
      }

      if (registrationFilter) {
        const studentsArray = Array.from(this.data.students.values())
        const student = studentsArray.find(s => s.registration_number === registrationFilter.value)
        if (student) {
          return { data: student, error: null }
        }
      }

      return { data: null, error: null }
    }

    return { data: null, error: null }
  }

  private async handleStudentPerformance() {
    if (this.operation === 'insert') {
      // Simular insert de performance do estudante
      const performanceId = `performance-${Date.now()}`
      const performance = {
        ...this.insertData,
        id: performanceId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      this.data.student_performance.set(performanceId, performance)
      return { data: performance, error: null }
    }

    return { data: null, error: null }
  }

  private async handleStudentActivityLogs() {
    if (this.operation === 'insert') {
      // Simular insert de log de atividade
      const logId = `log-${Date.now()}`
      const log = {
        ...this.insertData,
        id: logId,
        created_at: new Date().toISOString()
      }

      this.data.student_activity_logs.set(logId, log)
      return { data: log, error: null }
    }

    return { data: null, error: null }
  }
}

export const mockSupabaseAdmin = new MockSupabaseClient()